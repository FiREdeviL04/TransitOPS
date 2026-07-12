from django.db import models
from apps.vehicles.models import Vehicle

class MaintenanceRecord(models.Model):
    PRIORITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('Critical', 'Critical'),
    )
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
    )

    id = models.CharField(max_length=50, primary_key=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='maintenance_records')
    type = models.CharField(max_length=150) # e.g. "Brake Overhaul"
    priority = models.CharField(max_length=15, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    technician = models.CharField(max_length=150)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', 'id']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
        ]

    def __str__(self):
        return f"{self.vehicle.plate} - {self.type} ({self.status})"
