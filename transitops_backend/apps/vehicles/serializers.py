from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    lastService = serializers.DateField(source='last_service', required=False, allow_null=True)
    
    class Meta:
        model = Vehicle
        fields = ['id', 'name', 'plate', 'type', 'status', 'fuel', 'health', 'capacity', 'lastService']
        
    def validate_plate(self, value):
        # Enforce unique registration plate constraint
        instance = self.instance
        queryset = Vehicle.objects.filter(plate=value)
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A vehicle with this registration plate already exists.")
        return value
