from rest_framework import serializers
from .models import FuelLog
from apps.vehicles.serializers import VehicleSerializer
from apps.vehicles.models import Vehicle

class FuelLogSerializer(serializers.ModelSerializer):
    vehicleId = serializers.PrimaryKeyRelatedField(
        source='vehicle',
        queryset=Vehicle.objects.all(),
        write_only=True
    )
    pricePerUnit = serializers.DecimalField(source='price_per_unit', max_digits=10, decimal_places=2)
    totalCost = serializers.DecimalField(source='total_cost', max_digits=10, decimal_places=2, read_only=True)
    vehicleDetails = VehicleSerializer(source='vehicle', read_only=True)

    class Meta:
        model = FuelLog
        fields = [
            'id', 'vehicleId', 'vehicleDetails', 'volume', 'pricePerUnit', 
            'totalCost', 'odometer', 'station', 'date'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Flatten vehicleId for frontend
        data['vehicleId'] = instance.vehicle.id
        return data
