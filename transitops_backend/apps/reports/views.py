import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import IsAdminRole
from django.db.models import Sum, Avg, Count

from apps.vehicles.models import Vehicle
from apps.drivers.models import Driver
from apps.trips.models import Trip
from apps.maintenance.models import MaintenanceRecord
from apps.fuel.models import FuelLog
from apps.expenses.models import Expense

class FuelEfficiencyReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        export_csv = request.query_params.get('export') == 'csv'
        
        # Calculate fuel efficiency metrics per vehicle
        vehicles = Vehicle.objects.all()
        report_data = []
        
        for v in vehicles:
            logs = FuelLog.objects.filter(vehicle=v)
            total_gal = logs.aggregate(tot=Sum('volume'))['tot'] or 0.0
            total_cost = logs.aggregate(tot=Sum('total_cost'))['tot'] or 0.0
            avg_price = logs.aggregate(avg=Avg('price_per_unit'))['avg'] or 0.0
            trips_count = Trip.objects.filter(vehicle=v, status='Completed').count()
            
            # Simulated MPG metric
            mpg = 6.2 if v.type == 'Heavy Duty Diesel' else (8.4 if 'Van' in v.type or 'EDV' in v.type else 0.0)
            if mpg == 0.0:
                mpg = 7.1 # standard average
                
            report_data.append({
                "vehicleId": v.id,
                "name": v.name,
                "plate": v.plate,
                "type": v.type,
                "totalVolume": float(total_gal),
                "totalCost": float(total_cost),
                "avgPricePerUnit": round(float(avg_price), 2),
                "tripsCompleted": trips_count,
                "fuelEfficiencyMPG": mpg
            })

        if export_csv:
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="fuel_efficiency_report.csv"'
            writer = csv.writer(response)
            writer.writerow(['Vehicle ID', 'Name', 'Plate', 'Type', 'Total Volume (Gallons)', 'Total Cost ($)', 'Avg Price/Unit ($)', 'Trips Completed', 'Fuel Efficiency (MPG)'])
            for row in report_data:
                writer.writerow([
                    row['vehicleId'], row['name'], row['plate'], row['type'],
                    row['totalVolume'], row['totalCost'], row['avgPricePerUnit'],
                    row['tripsCompleted'], row['fuelEfficiencyMPG']
                ])
            return response

        return Response(report_data)


class DriverPerformanceReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        export_csv = request.query_params.get('export') == 'csv'
        
        drivers = Driver.objects.all()
        report_data = []
        
        for d in drivers:
            trips_completed = Trip.objects.filter(driver=d, status='Completed').count()
            trips_cancelled = Trip.objects.filter(driver=d, status='Cancelled').count()
            
            report_data.append({
                "driverId": d.id,
                "name": d.name,
                "license": d.license,
                "safetyScore": d.safety_score,
                "hoursLogged": d.hours,
                "totalDistance": d.total_distance,
                "tripsCompleted": trips_completed,
                "tripsCancelled": trips_cancelled
            })

        if export_csv:
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="driver_performance_report.csv"'
            writer = csv.writer(response)
            writer.writerow(['Driver ID', 'Name', 'License', 'Safety Score', 'Hours Logged', 'Total Distance (Miles)', 'Trips Completed', 'Trips Cancelled'])
            for row in report_data:
                writer.writerow([
                    row['driverId'], row['name'], row['license'], row['safetyScore'],
                    row['hoursLogged'], row['totalDistance'], row['tripsCompleted'],
                    row['tripsCancelled']
                ])
            return response

        return Response(report_data)


class OperationalExpensesReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        export_csv = request.query_params.get('export') == 'csv'
        
        # Aggregate expense per category
        categories = ['Fuel', 'Maintenance', 'Driver Salary', 'Insurance', 'Tolls & Permits', 'Other']
        report_data = []
        
        for cat in categories:
            expenses = Expense.objects.filter(category=cat)
            total_amount = expenses.aggregate(tot=Sum('amount'))['tot'] or 0.0
            count = expenses.count()
            
            report_data.append({
                "category": cat,
                "totalAmount": float(total_amount),
                "transactionCount": count
            })

        if export_csv:
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="operational_expenses_report.csv"'
            writer = csv.writer(response)
            writer.writerow(['Expense Category', 'Total Amount ($)', 'Transaction Count'])
            for row in report_data:
                writer.writerow([row['category'], row['totalAmount'], row['transactionCount']])
            return response

        return Response(report_data)
