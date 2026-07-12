from .models import Vehicle
from rest_framework.exceptions import ValidationError

class VehicleService:
    @staticmethod
    def register_vehicle(id, name, plate, type, capacity, fuel=100, health=100, last_service=None):
        if Vehicle.objects.filter(plate=plate).exists():
            raise ValidationError({"plate": "A vehicle with this registration plate already exists."})
            
        vehicle = Vehicle.objects.create(
            id=id,
            name=name,
            plate=plate,
            type=type,
            capacity=capacity,
            fuel=fuel,
            health=health,
            last_service=last_service
        )
        return vehicle

    @staticmethod
    def check_can_dispatch(vehicle):
        """
        Business Rule: Cannot dispatch retired, in shop (Maintenance), or already on trip (In Service).
        """
        if vehicle.status == 'Maintenance':
            raise ValidationError(f"Vehicle {vehicle.id} is in shop and cannot be dispatched.")
        if vehicle.status == 'In Service':
            raise ValidationError(f"Vehicle {vehicle.id} is already on an active trip.")
        return True

    @staticmethod
    def update_status(vehicle, status):
        vehicle.status = status
        vehicle.save()
        return vehicle

    @staticmethod
    def update_metrics(vehicle, fuel=None, health=None):
        if fuel is not None:
            vehicle.fuel = max(0, min(100, fuel))
        if health is not None:
            vehicle.health = max(0, min(100, health))
        vehicle.save()
        return vehicle
