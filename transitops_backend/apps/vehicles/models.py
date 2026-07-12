from django.db import models

class Vehicle(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),          # Active on the road or available
        ('In Service', 'In Service'),  # Under active trip
        ('Maintenance', 'Maintenance'),# Undergoing repair in shop
        ('Idle', 'Idle'),              # Parked
    )
    
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    plate = models.CharField(max_length=30, unique=True, db_index=True)
    type = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    fuel = models.IntegerField(default=100)  # 0 to 100 percentage
    health = models.IntegerField(default=100)  # 0 to 100 percentage
    capacity = models.CharField(max_length=50)
    last_service = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['plate']),
        ]

    def __str__(self):
        return f"{self.name} ({self.plate})"
