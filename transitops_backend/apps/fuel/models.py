from django.db import models
from apps.vehicles.models import Vehicle

class FuelLog(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='fuel_logs')
    volume = models.DecimalField(max_digits=10, decimal_places=2) # Gallons
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2) # Price per gallon
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    odometer = models.IntegerField()
    station = models.CharField(max_length=150)
    date = models.DateField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', 'id']
        indexes = [
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.vehicle.plate} - {self.volume} Gallons @ {self.station}"
