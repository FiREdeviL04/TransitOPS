from rest_framework import serializers
from .models import Driver

class DriverSerializer(serializers.ModelSerializer):
    safetyScore = serializers.IntegerField(source='safety_score', default=100)
    avatarColor = serializers.CharField(source='avatar_color', default='bg-indigo-600')
    licenseCategory = serializers.CharField(source='license_category', required=False, allow_null=True)
    licenseExpiry = serializers.DateField(source='license_expiry', required=False, allow_null=True)
    totalDistance = serializers.IntegerField(source='total_distance', default=0)
    fuelEfficiency = serializers.CharField(source='fuel_efficiency', required=False, allow_null=True)
    recentActivity = serializers.JSONField(source='recent_activity', required=False)
    performanceTimeline = serializers.JSONField(source='performance_timeline', required=False)
    upcomingTripsCount = serializers.IntegerField(source='upcoming_trips_count', default=0)
    todayDistance = serializers.IntegerField(source='today_distance', default=0)

    class Meta:
        model = Driver
        fields = [
            'id', 'name', 'license', 'safetyScore', 'status', 'hours', 'phone', 
            'avatarColor', 'email', 'licenseCategory', 'licenseExpiry', 'experience', 
            'totalDistance', 'fuelEfficiency', 'achievements', 'recentActivity', 
            'performanceTimeline', 'upcomingTripsCount', 'todayDistance'
        ]
        
    def validate_license(self, value):
        instance = self.instance
        queryset = Driver.objects.filter(license=value)
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A driver with this license number already exists.")
        return value
