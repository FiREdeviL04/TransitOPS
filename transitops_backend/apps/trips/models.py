from django.db import models
from apps.vehicles.models import Vehicle
from apps.drivers.models import Driver

class Trip(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Loading', 'Loading'),
        ('On Route', 'On Route'),
        ('Delayed', 'Delayed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )

    id = models.CharField(max_length=50, primary_key=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name='trips')
    driver = models.ForeignKey(Driver, on_delete=models.PROTECT, related_name='trips')
    destination = models.CharField(max_length=150)
    departure = models.CharField(max_length=150)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    eta = models.CharField(max_length=100, blank=True, null=True, default='TBD')
    progress = models.IntegerField(default=0)  # 0 to 100 percentage
    freight = models.CharField(max_length=200)  # Cargo details
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', 'id']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.id} -> {self.destination}"
