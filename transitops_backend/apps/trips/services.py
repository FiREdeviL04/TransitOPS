import re
from django.db import transaction
from django.utils import timezone
from datetime import date
from rest_framework.exceptions import ValidationError

from apps.vehicles.models import Vehicle
from apps.vehicles.services import VehicleService
from apps.drivers.models import Driver
from apps.drivers.services import DriverService
from .models import Trip

class TripService:
    @staticmethod
    def parse_weight(text):
        """
        Helper to parse weight numbers from strings like '24 Tons', '15,000 lbs', '12t'.
        Returns value in lbs (standardized).
        """
        if not text:
            return 0
        text = text.lower().replace(',', '')
        match = re.search(r'(\d+)\s*(ton|t|lb|l|kg|k)', text)
        if not match:
            # fallback to extract first sequence of digits
            fallback_match = re.search(r'\d+', text)
            return int(fallback_match.group(0)) if fallback_match else 10000
        
        val = int(match.group(1))
        unit = match.group(2)
        if unit in ['ton', 't']:
            return val * 2000  # 1 ton = 2000 lbs
        elif unit == 'kg':
            return val * 2.20462  # 1 kg = 2.2 lbs
        return val

    @staticmethod
    def validate_cargo_capacity(vehicle, freight_text):
        """
        Business Rule: Cargo/freight cannot exceed vehicle capacity.
        """
        veh_capacity_lbs = TripService.parse_weight(vehicle.capacity)
        freight_weight_lbs = TripService.parse_weight(freight_text)
        
        if freight_weight_lbs > veh_capacity_lbs:
            raise ValidationError(
                f"Cargo weight ({freight_text}) exceeds vehicle max carrying capacity ({vehicle.capacity})."
            )
        return True

    @staticmethod
    @transaction.atomic
    def create_trip(id, vehicle_id, driver_id, destination, departure, freight, cost, date_val, status='Pending'):
        try:
            vehicle = Vehicle.objects.select_for_update().get(id=vehicle_id)
        except Vehicle.DoesNotExist:
            raise ValidationError("Vehicle not found.")
            
        try:
            driver = Driver.objects.select_for_update().get(id=driver_id)
        except Driver.DoesNotExist:
            raise ValidationError("Driver not found.")

        # Business validations
        TripService.validate_cargo_capacity(vehicle, freight)
        
        # If starting on route or loading immediately, verify dispatch readiness
        if status in ['On Route', 'Loading']:
            VehicleService.check_can_dispatch(vehicle)
            DriverService.check_can_dispatch(driver)
            
            # Transition vehicle and driver
            vehicle.status = 'In Service'
            vehicle.save()
            driver.status = 'On Duty'
            driver.save()

        trip = Trip.objects.create(
            id=id,
            vehicle=vehicle,
            driver=driver,
            destination=destination,
            departure=departure,
            status=status,
            freight=freight,
            cost=cost,
            date=date_val,
            progress=15 if status == 'Loading' else (0 if status == 'Pending' else 25),
            eta='10h remaining' if status == 'On Route' else 'Scheduling'
        )

        # Create system notification
        from apps.notifications.services import NotificationService
        NotificationService.create_notification(
            title="Trip Dispatched",
            message=f"Trip {trip.id} has been created and assigned to driver {driver.name} with vehicle {vehicle.plate}.",
            notif_type="info"
        )

        return trip

    @staticmethod
    @transaction.atomic
    def dispatch_trip(trip_id):
        try:
            trip = Trip.objects.select_for_update().get(id=trip_id)
        except Trip.DoesNotExist:
            raise ValidationError("Trip not found.")

        if trip.status in ['On Route', 'Completed', 'Cancelled']:
            raise ValidationError(f"Trip is already {trip.status} and cannot be dispatched.")

        vehicle = trip.vehicle
        driver = trip.driver

        # Check dispatch capability
        VehicleService.check_can_dispatch(vehicle)
        DriverService.check_can_dispatch(driver)

        # Atomic status transitions
        trip.status = 'On Route'
        trip.progress = 25
        trip.eta = '8h remaining'
        trip.save()

        vehicle.status = 'In Service'
        vehicle.save()

        driver.status = 'On Duty'
        driver.save()

        # Update driver activity
        DriverService.add_activity(driver, f"Dispatched on route {trip.id} to {trip.destination}")

        # Notification
        from apps.notifications.services import NotificationService
        NotificationService.create_notification(
            title="Trip On Route",
            message=f"Trip {trip.id} is now on route to {trip.destination}.",
            notif_type="info"
        )

        return trip

    @staticmethod
    @transaction.atomic
    def complete_trip(trip_id, fuel_volume=None, fuel_price=None, odometer=None, station=None):
        """
        Business Rule: Trip -> Completed, Vehicle -> Available, Driver -> Available.
        Automatically logs fuel and expense, and notifies the team.
        """
        try:
            trip = Trip.objects.select_for_update().get(id=trip_id)
        except Trip.DoesNotExist:
            raise ValidationError("Trip not found.")

        if trip.status == 'Completed':
            raise ValidationError("Trip is already completed.")

        vehicle = trip.vehicle
        driver = trip.driver

        # Update trip completion status
        trip.status = 'Completed'
        trip.progress = 100
        trip.eta = 'Done'
        trip.save()

        # Restore vehicle and driver to available status ('Active')
        vehicle.status = 'Active'
        if fuel_volume and odometer:
            # decrement fuel level as mockup simulator or logic
            vehicle.fuel = min(100, max(15, int(100 - (fuel_volume / 2))))
        vehicle.save()

        driver.status = 'Active'
        # Add hours to driver
        driver.hours += 8
        driver.total_distance += 250  # estimate distance
        driver.save()

        DriverService.add_activity(driver, f"Completed trip {trip.id} to {trip.destination}")

        # Automatically Create Fuel Log & Expense if volume is entered
        fuel_log = None
        if fuel_volume and fuel_price and odometer and station:
            from apps.fuel.models import FuelLog
            from apps.expenses.models import Expense
            
            total_cost = float(fuel_volume) * float(fuel_price)
            
            # Create fuel log
            fuel_log = FuelLog.objects.create(
                vehicle=vehicle,
                volume=fuel_volume,
                price_per_unit=fuel_price,
                total_cost=total_cost,
                odometer=odometer,
                station=station,
                date=date.today()
            )
            
            # Create expense record
            Expense.objects.create(
                category='Fuel',
                amount=total_cost,
                date=date.today(),
                description=f"Fuel refill for vehicle {vehicle.plate} during trip {trip.id} completion at {station}.",
                reference=f"FUEL-{fuel_log.id}"
            )

        # Create system notification
        from apps.notifications.services import NotificationService
        NotificationService.create_notification(
            title="Trip Completed",
            message=f"Trip {trip.id} has successfully arrived in {trip.destination}. Logged auto-completion details.",
            notif_type="success"
        )

        return trip, fuel_log

    @staticmethod
    @transaction.atomic
    def cancel_trip(trip_id):
        try:
            trip = Trip.objects.select_for_update().get(id=trip_id)
        except Trip.DoesNotExist:
            raise ValidationError("Trip not found.")

        if trip.status in ['Completed', 'Cancelled']:
            raise ValidationError(f"Cannot cancel a trip that is already {trip.status}.")

        vehicle = trip.vehicle
        driver = trip.driver

        # Cancel status
        trip.status = 'Cancelled'
        trip.progress = 0
        trip.eta = 'Cancelled'
        trip.save()

        # Restore vehicle & driver availability
        vehicle.status = 'Active'
        vehicle.save()

        driver.status = 'Active'
        driver.save()

        # Driver activity
        DriverService.add_activity(driver, f"Trip {trip.id} was cancelled.")

        # Notification
        from apps.notifications.services import NotificationService
        NotificationService.create_notification(
            title="Trip Cancelled",
            message=f"Trip {trip.id} dispatch was cancelled. Vehicle and driver set back to Available.",
            notif_type="warning"
        )

        return trip
