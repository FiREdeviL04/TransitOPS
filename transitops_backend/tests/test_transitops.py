from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date, timedelta

from apps.vehicles.models import Vehicle
from apps.drivers.models import Driver
from apps.trips.models import Trip
from apps.maintenance.models import MaintenanceRecord
from apps.fuel.models import FuelLog
from apps.expenses.models import Expense
from apps.notifications.models import Notification

User = get_user_model()

class TransitOpsAPITests(APITestCase):

    def setUp(self):
        # 1. Create standard Users for authentication and RBAC testing
        self.admin_user = User.objects.create_user(
            email='admin@transitops.com',
            password='securepassword123',
            name='James Donovan',
            role='Admin'
        )
        
        self.driver_user = User.objects.create_user(
            email='driver@transitops.com',
            password='securepassword123',
            name='Alex Rivera',
            role='Driver',
            driver_id_ref='d-alex'
        )

        # 2. Setup initial test entities
        self.vehicle_1 = Vehicle.objects.create(
            id='v-1',
            name='Freightliner Cascadia',
            plate='AX-902-KL',
            type='Heavy Duty Diesel',
            status='Active',
            fuel=80,
            health=90,
            capacity='24 Tons',
            last_service='2026-06-15'
        )
        
        self.driver_1 = Driver.objects.create(
            id='d-alex',
            name='Alex Rivera',
            license='CDL-A-9942',
            safety_score=97,
            status='Active',
            hours=120,
            phone='+1 (555) 432-8890',
            email='driver@transitops.com',
            license_expiry=date.today() + timedelta(days=365)
        )

    def get_jwt_headers(self, user):
        response = self.client.post('/api/auth/login/', {
            'email': user.email,
            'password': 'securepassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['access']
        return {'HTTP_AUTHORIZATION': f'Bearer {token}'}

    def test_jwt_login(self):
        """Test successful login returns access & refresh tokens along with custom claims"""
        response = self.client.post('/api/auth/login/', {
            'email': 'admin@transitops.com',
            'password': 'securepassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['role'], 'Admin')

    def test_rbac_admin_vs_driver_vehicles(self):
        """Test Admin has full CRUD and Driver has only read permission on vehicles"""
        admin_headers = self.get_jwt_headers(self.admin_user)
        driver_headers = self.get_jwt_headers(self.driver_user)

        # 1. Driver attempts to create a vehicle -> Expect 403 Forbidden
        response = self.client.post('/api/vehicles/', {
            'id': 'v-test',
            'name': 'Test Truck',
            'plate': 'TEST-123',
            'type': 'Electric Delivery',
            'capacity': '5 Tons'
        }, **driver_headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # 2. Admin successfully creates a vehicle
        response = self.client.post('/api/vehicles/', {
            'id': 'v-test',
            'name': 'Test Truck',
            'plate': 'TEST-123',
            'type': 'Electric Delivery',
            'capacity': '5 Tons',
            'status': 'Active'
        }, **admin_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_business_rule_driver_expired_license(self):
        """Test business logic rule that prevents dispatching driver with an expired license"""
        admin_headers = self.get_jwt_headers(self.admin_user)
        
        # Expire license
        self.driver_1.license_expiry = date.today() - timedelta(days=5)
        self.driver_1.save()

        # Try to create a dispatch trip
        response = self.client.post('/api/trips/', {
            'id': 'TR-TEST',
            'vehicleId': 'v-1',
            'driverId': 'd-alex',
            'destination': 'Denver, CO',
            'departure': 'Chicago, IL',
            'freight': 'Industrial Equipment',
            'cost': 1500,
            'date': '2026-07-20',
            'status': 'On Route'
        }, format='json', **admin_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('expired', response.data['detail'].lower())

    def test_trip_lifecycle_workflow(self):
        """Test the whole atomic trip transaction: Create -> Complete (automatic FuelLog, Expense, Notification creation)"""
        admin_headers = self.get_jwt_headers(self.admin_user)

        # 1. Create trip (Pending)
        response = self.client.post('/api/trips/', {
            'id': 'TR-FLOW-1',
            'vehicleId': 'v-1',
            'driverId': 'd-alex',
            'destination': 'Denver, CO',
            'departure': 'Chicago, IL',
            'freight': 'Medical Supplies',
            'cost': 2200,
            'date': '2026-07-20',
            'status': 'Pending'
        }, format='json', **admin_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify initial states
        self.assertEqual(Vehicle.objects.get(id='v-1').status, 'Active')
        self.assertEqual(Driver.objects.get(id='d-alex').status, 'Active')

        # 2. Dispatch trip
        response = self.client.post('/api/trips/TR-FLOW-1/dispatch/', {}, **admin_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Vehicle.objects.get(id='v-1').status, 'In Service')
        self.assertEqual(Driver.objects.get(id='d-alex').status, 'On Duty')

        # 3. Complete trip (entering fuel details logs fuel and expenses automatically in atomic transaction)
        response = self.client.post('/api/trips/TR-FLOW-1/complete/', {
            'fuelVolume': 120,
            'fuelPrice': 3.85,
            'odometer': 146000,
            'station': 'Pilot St. Louis'
        }, **admin_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 4. Verify post-conditions
        # Trip must be completed
        self.assertEqual(Trip.objects.get(id='TR-FLOW-1').status, 'Completed')
        # Vehicle and driver returned to available status
        self.assertEqual(Vehicle.objects.get(id='v-1').status, 'Active')
        self.assertEqual(Driver.objects.get(id='d-alex').status, 'Active')
        # Check automatic Fuel Log creation
        self.assertTrue(FuelLog.objects.filter(vehicle_id='v-1', odometer=146000).exists())
        # Check automatic Expense log creation
        self.assertTrue(Expense.objects.filter(category='Fuel', amount=120 * 3.85).exists())
        # Check automatic Notification creation
        self.assertTrue(Notification.objects.filter(title="Trip Completed").exists())

    def test_maintenance_lifecycle(self):
        """Test maintenance creation -> vehicle status Maintenance, completion -> vehicle status Active and automatic Expense logged"""
        admin_headers = self.get_jwt_headers(self.admin_user)

        # 1. Create Maintenance record
        response = self.client.post('/api/maintenance/', {
            'id': 'm-test',
            'vehicleId': 'v-1',
            'type': 'Brake Overhaul',
            'priority': 'Critical',
            'status': 'In Progress',
            'cost': 850,
            'date': '2026-07-15',
            'technician': 'Elite Truck Repair'
        }, format='json', **admin_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Vehicle must transition to Maintenance
        self.assertEqual(Vehicle.objects.get(id='v-1').status, 'Maintenance')

        # 2. Resolve Maintenance record
        response = self.client.post('/api/maintenance/m-test/resolve/', {
            'cost': 900,
            'technician': 'Elite Truck Repair'
        }, **admin_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Vehicle must transition back to Active
        self.assertEqual(Vehicle.objects.get(id='v-1').status, 'Active')
        # Expense must be logged
        self.assertTrue(Expense.objects.filter(category='Maintenance', amount=900).exists())

    def test_dashboard_metrics(self):
        """Test dashboard counts and aggregates match expectation"""
        headers = self.get_jwt_headers(self.admin_user)
        response = self.client.get('/api/dashboard/metrics/', **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('kpis', response.data)
        self.assertEqual(response.data['kpis']['totalVehicles'], 1)
        self.assertEqual(response.data['kpis']['totalDrivers'], 1)
