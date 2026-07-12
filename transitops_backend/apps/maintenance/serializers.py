from rest_framework import serializers
from .models import MaintenanceRecord
from apps.vehicles.serializers import VehicleSerializer
from apps.vehicles.models import Vehicle

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    vehicleId = serializers.PrimaryKeyRelatedField(
        source='vehicle',
        queryset=Vehicle.objects.all(),
        write_only=True
    )
    vehicleDetails = VehicleSerializer(source='vehicle', read_only=True)
    
    class Meta:
        model = MaintenanceRecord
        fields = [
            'id', 'vehicleId', 'vehicleDetails', 'type', 'priority', 
            'status', 'cost', 'date', 'technician'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Flatten vehicleId matching React frontend expect state
        data['vehicleId'] = instance.vehicle.id
        return data
