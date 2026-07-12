import os
import sys
import django
from datetime import date, timedelta

# Set up django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.vehicles.models import Vehicle
from apps.drivers.models import Driver
from apps.trips.models import Trip
from apps.maintenance.models import MaintenanceRecord
from apps.fuel.models import FuelLog
from apps.expenses.models import Expense

User = get_user_model()

def seed():
    print("Starting database seeding...")

    # 1. Create Users
    admin_email = 'admin@transitops.com'
    if not User.objects.filter(email=admin_email).exists():
        User.objects.create_superuser(
            email=admin_email,
            password='adminpassword123',
            name='James Donovan',
            role='Admin'
        )
        print("Admin user created.")

    driver_email = 'alex@transitops.com'
    if not User.objects.filter(email=driver_email).exists():
        User.objects.create_user(
            email=driver_email,
            password='driverpassword123',
            name='Alex Rivera',
            role='Driver',
            driver_id_ref='d-alex'
        )
        print("Driver user created.")

    # 2. Seed Vehicles
    vehicles_data = [
        { 'id': 'v-1', 'name': 'Volvo FH16', 'plate': 'AX-902-KL', 'type': 'Heavy Truck', 'status': 'Active', 'fuel': 85, 'health': 94, 'capacity': '25 Tons', 'last_service': date(2026, 6, 15) },
        { 'id': 'v-2', 'name': 'Scania R450', 'plate': 'TY-341-PP', 'type': 'Heavy Truck', 'status': 'In Service', 'fuel': 62, 'health': 89, 'capacity': '24 Tons', 'last_service': date(2026, 5, 20) },
        { 'id': 'v-3', 'name': 'Ford Transit', 'plate': 'ER-881-QQ', 'type': 'Delivery Van', 'status': 'Maintenance', 'fuel': 35, 'health': 68, 'capacity': '3.5 Tons', 'last_service': date(2026, 7, 10) },
        { 'id': 'v-4', 'name': 'Rivian EDV', 'plate': 'EV-772-DX', 'type': 'Electric Carrier', 'status': 'Active', 'fuel': 95, 'health': 99, 'capacity': '2.0 Tons', 'last_service': date(2026, 7, 8) },
    ]

    for v in vehicles_data:
        Vehicle.objects.update_or_create(id=v['id'], defaults=v)
    print("Vehicles seeded.")

    # 3. Seed Drivers
    drivers_data = [
        { 'id': 'd-1', 'name': 'Robert Vance', 'license': 'CDL-A-8821', 'safety_score': 98, 'status': 'On Duty', 'hours': 142, 'phone': '+1 (555) 321-4567', 'avatar_color': 'bg-indigo-600' },
        { 'id': 'd-2', 'name': 'Arun Singh', 'license': 'CDL-A-4190', 'safety_score': 94, 'status': 'On Duty', 'hours': 118, 'phone': '+1 (555) 890-1234', 'avatar_color': 'bg-purple-600' },
        { 'id': 'd-3', 'name': 'Sarah Parker', 'license': 'CDL-B-5532', 'safety_score': 96, 'status': 'Active', 'hours': 160, 'phone': '+1 (555) 765-4321', 'avatar_color': 'bg-emerald-600' },
        { 'id': 'd-4', 'name': 'Leo Gaultier', 'license': 'CDL-A-9912', 'safety_score': 78, 'status': 'Off Duty', 'hours': 110, 'phone': '+1 (555) 234-5678', 'avatar_color': 'bg-amber-600' },
        { 
            'id': 'd-alex', 
            'name': 'Alex Rivera', 
            'license': 'CDL-A-9942', 
            'safety_score': 97, 
            'status': 'On Duty', 
            'hours': 145, 
            'phone': '+1 (555) 432-8890', 
            'avatar_color': 'bg-[#5B3DF5]', 
            'email': 'driver@transitops.com',
            'license_category': 'CDL Class A',
            'license_expiry': date(2028, 11, 15),
            'experience': '8 Years',
            'total_distance': 12450,
            'fuel_efficiency': '6.8 MPG',
            'achievements': ['Safe Driver of the Month', 'Eco-Hauler Certified', 'Zero Incidents 2025'],
            'recent_activity': [
                'Logged fuel volume at Pilot Center Denver',
                'Completed cargo transit route TR-8944',
                'Pre-trip checks approved'
            ],
            'performance_timeline': [
                { 'date': 'Mon', 'score': 95 },
                { 'date': 'Tue', 'score': 96 },
                { 'date': 'Wed', 'score': 98 },
                { 'date': 'Thu', 'score': 97 },
                { 'date': 'Fri', 'score': 97 }
            ],
            'upcoming_trips_count': 3,
            'today_distance': 245
        }
    ]

    for d in drivers_data:
        Driver.objects.update_or_create(id=d['id'], defaults=d)
    print("Drivers seeded.")

    # 4. Seed Trips
    trips_data = [
        { 'id': 'TR-8942', 'vehicle_id': 'v-1', 'driver_id': 'd-alex', 'destination': 'Chicago, IL', 'departure': 'St. Louis, MO', 'status': 'On Route', 'eta': '14:20 PM', 'progress': 75, 'freight': 'Industrial Equipment', 'cost': 1450.00, 'date': date(2026, 7, 11) },
        { 'id': 'TR-8943', 'vehicle_id': 'v-2', 'driver_id': 'd-2', 'destination': 'New York, NY', 'departure': 'Philadelphia, PA', 'status': 'Loading', 'eta': '16:45 PM', 'progress': 15, 'freight': 'Consumer Goods', 'cost': 850.00, 'date': date(2026, 7, 11) },
        { 'id': 'TR-8944', 'vehicle_id': 'v-4', 'driver_id': 'd-3', 'destination': 'Seattle, WA', 'departure': 'Portland, OR', 'status': 'Completed', 'eta': 'Done', 'progress': 100, 'freight': 'Medical Supplies', 'cost': 500.00, 'date': date(2026, 7, 10) },
        { 'id': 'TR-8945', 'vehicle_id': 'v-1', 'driver_id': 'd-alex', 'destination': 'Denver, CO', 'departure': 'Chicago, IL', 'status': 'Pending', 'eta': 'Tomorrow 08:00 AM', 'progress': 0, 'freight': 'Automotive Parts', 'cost': 2100.00, 'date': date(2026, 7, 13) },
    ]

    for t in trips_data:
        Trip.objects.update_or_create(id=t['id'], defaults=t)
    print("Trips seeded.")

    # 5. Seed Maintenance
    maintenance_data = [
        { 'id': 'm-1', 'vehicle_id': 'v-3', 'type': 'Brake Overhaul', 'priority': 'Critical', 'status': 'In Progress', 'cost': 850.00, 'date': date(2026, 7, 10), 'technician': 'Elite Truck Service' },
        { 'id': 'm-2', 'vehicle_id': 'v-2', 'type': 'Engine Tuning', 'priority': 'Medium', 'status': 'Pending', 'cost': 420.00, 'date': date(2026, 7, 15), 'technician': 'McGrath Mechanics' },
    ]

    for m in maintenance_data:
        MaintenanceRecord.objects.update_or_create(id=m['id'], defaults=m)
    print("Maintenance records seeded.")

    # 6. Seed Fuel Logs
    fuel_data = [
        { 'id': 'f-1', 'vehicle_id': 'v-1', 'volume': 120.0, 'price_per_unit': 3.85, 'total_cost': 462.00, 'odometer': 145800, 'station': 'Shell St. Louis', 'date': date(2026, 7, 9) },
        { 'id': 'f-2', 'vehicle_id': 'v-2', 'volume': 145.0, 'price_per_unit': 3.92, 'total_cost': 568.40, 'odometer': 92310, 'station': 'Pilot Center Denver', 'date': date(2026, 7, 8) },
    ]

    for f in fuel_data:
        FuelLog.objects.update_or_create(id=f['id'], defaults=f)
    print("Fuel logs seeded.")

    # 7. Seed Expenses
    expenses_data = [
        { 'id': 'e-1', 'category': 'Fuel', 'amount': 1030.40, 'date': date(2026, 7, 9), 'description': 'Fleet fuel bulk refills', 'reference': 'INV-9942' },
        { 'id': 'e-2', 'category': 'Maintenance', 'amount': 850.00, 'date': date(2026, 7, 10), 'description': 'Volvo Brake System Overhaul', 'reference': 'INV-8831' },
        { 'id': 'e-3', 'category': 'Driver Salary', 'amount': 3200.00, 'date': date(2026, 7, 5), 'description': 'Bi-weekly Driver payroll', 'reference': 'PAY-2291' },
    ]

    for ex in expenses_data:
        Expense.objects.update_or_create(id=ex['id'], defaults=ex)
    print("Expenses seeded.")

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
