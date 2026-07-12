from django.db import transaction
from django.utils import timezone
from datetime import date
from rest_framework.exceptions import ValidationError

from apps.vehicles.models import Vehicle
from apps.vehicles.services import VehicleService
from .models import MaintenanceRecord

class MaintenanceService:
    @transaction.atomic
    @staticmethod
    def create_maintenance_record(id, vehicle_id, type_val, priority, status, cost, date_val, technician):
        try:
            vehicle = Vehicle.objects.select_for_update().get(id=vehicle_id)
        except Vehicle.DoesNotExist:
            raise ValidationError("Vehicle not found.")

        # Business Rule: If status is 'In Progress' or 'Pending', vehicle moves to 'Maintenance' (In Shop)
        if status in ['Pending', 'In Progress']:
            vehicle.status = 'Maintenance'
            vehicle.save()

        record = MaintenanceRecord.objects.create(
            id=id,
            vehicle=vehicle,
            type=type_val,
            priority=priority,
            status=status,
            cost=cost,
            date=date_val,
            technician=technician
        )

        # Notify
        from apps.notifications.services import NotificationService
        NotificationService.create_notification(
            title="Maintenance Opened",
            message=f"Maintenance record {record.id} ({type_val}) was opened for vehicle {vehicle.plate}. Status set to In Shop.",
            notif_type="warning" if priority == 'Critical' else "info"
        )

        return record

    @transaction.atomic
    @staticmethod
    def resolve_maintenance_record(record_id, resolution_cost=None, technician=None):
        """
        Business Rule: Maintenance Completion -> Vehicle status changes to Available.
        Automatically logs Expense (Category: Maintenance).
        """
        try:
            record = MaintenanceRecord.objects.select_for_update().get(id=record_id)
        except MaintenanceRecord.DoesNotExist:
            raise ValidationError("Maintenance record not found.")

        if record.status == 'Resolved':
            raise ValidationError("This maintenance record is already resolved.")

        vehicle = record.vehicle

        # Update record details
        record.status = 'Resolved'
        if resolution_cost is not None:
            record.cost = resolution_cost
        if technician is not None:
            record.technician = technician
        record.save()

        # Update vehicle status back to Active (Available) and update last service date
        vehicle.status = 'Active'
        vehicle.last_service = date.today()
        vehicle.health = min(100, vehicle.health + 20)  # repair restores vehicle health
        vehicle.save()

        # Automatically Create Expense
        from apps.expenses.models import Expense
        Expense.objects.create(
            category='Maintenance',
            amount=record.cost,
            date=date.today(),
            description=f"Maintenance resolution: {record.type} for vehicle {vehicle.plate} performed by {record.technician}.",
            reference=f"MAINT-{record.id}"
        )

        # Notification
        from apps.notifications.services import NotificationService
        NotificationService.create_notification(
            title="Maintenance Completed",
            message=f"Vehicle {vehicle.plate} maintenance record {record.id} resolved. Returned to service availability.",
            notif_type="success"
        )

        return record
