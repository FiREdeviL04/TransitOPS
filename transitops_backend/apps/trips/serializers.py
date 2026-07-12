from rest_framework import serializers
from .models import Trip
from apps.vehicles.serializers import VehicleSerializer
from apps.drivers.serializers import DriverSerializer
from apps.vehicles.models import Vehicle
from apps.drivers.models import Driver

class TripSerializer(serializers.ModelSerializer):
    vehicleId = serializers.PrimaryKeyRelatedField(
        source='vehicle',
        queryset=Vehicle.objects.all(),
        write_only=True
    )
    driverId = serializers.PrimaryKeyRelatedField(
        source='driver',
        queryset=Driver.objects.all(),
        write_only=True
    )
    
    # Nested fields for read/detail operations
    vehicleDetails = VehicleSerializer(source='vehicle', read_only=True)
    driverDetails = DriverSerializer(source='driver', read_only=True)
    
    # Backward compatible read field strings for camelCase representation
    vehicleId_str = serializers.CharField(source='vehicle.id', read_only=True)
    driverId_str = serializers.CharField(source='driver.id', read_only=True)

    class Meta:
        model = Trip
        fields = [
            'id', 'vehicleId', 'driverId', 'vehicleId_str', 'driverId_str',
            'destination', 'departure', 'status', 'eta', 'progress', 
            'freight', 'cost', 'date', 'vehicleDetails', 'driverDetails'
        ]

    def to_representation(self, instance):
        """
        Force standard camelCase return keys for the frontend integration.
        """
        data = super().to_representation(instance)
        # Inject vehicleId and driverId back as flat strings matching React state expectations
        data['vehicleId'] = instance.vehicle.id
        data['driverId'] = instance.driver.id
        return data
