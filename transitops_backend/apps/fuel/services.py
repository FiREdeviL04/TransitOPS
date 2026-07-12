from django.db import transaction
from rest_framework.exceptions import ValidationError
from datetime import date

from apps.vehicles.models import Vehicle
from .models import FuelLog

class FuelLogService:
    @transaction.atomic
    @staticmethod
    def log_fuel(id, vehicle_id, volume, price_per_unit, odometer, station, date_val):
        try:
            vehicle = Vehicle.objects.select_for_update().get(id=vehicle_id)
        except Vehicle.DoesNotExist:
            raise ValidationError("Vehicle not found.")

        total_cost = float(volume) * float(price_per_unit)

        log = FuelLog.objects.create(
            id=id,
            vehicle=vehicle,
            volume=volume,
            price_per_unit=price_per_unit,
            total_cost=total_cost,
            odometer=odometer,
            station=station,
            date=date_val
        )

        # Update vehicle fuel state to full (as it was just refueled)
        vehicle.fuel = 100
        vehicle.save()

        # Automatically Create Fuel Expense
        from apps.expenses.models import Expense
        Expense.objects.create(
            category='Fuel',
            amount=total_cost,
            date=date_val,
            description=f"Refuel: {volume} gal @ ${price_per_unit}/gal for vehicle {vehicle.plate} at {station}.",
            reference=f"FUEL-{log.id}"
        )

        # Notify
        from apps.notifications.services import NotificationService
        NotificationService.create_notification(
            title="Fuel Logged",
            message=f"Logged {volume} gallons for vehicle {vehicle.plate} at {station}. Telemetry status updated.",
            notif_type="info"
        )

        return log
