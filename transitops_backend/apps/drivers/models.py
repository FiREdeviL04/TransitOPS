from django.db import models

class Driver(models.Model):
    STATUS_CHOICES = (
        ('On Duty', 'On Duty'),      # Driving / currently assigned
        ('Active', 'Active'),        # Available for dispatch
        ('Off Duty', 'Off Duty'),    # Not working right now
        ('Sick', 'Sick'),            # Unavailable
    )

    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    license = models.CharField(max_length=50, unique=True, db_index=True)
    safety_score = models.IntegerField(default=100)  # 0 to 100
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    hours = models.IntegerField(default=0)  # On duty hours
    phone = models.CharField(max_length=20, blank=True)
    avatar_color = models.CharField(max_length=50, default='bg-indigo-600')
    email = models.EmailField(blank=True, null=True, unique=True)
    
    # Expanded specifications
    license_category = models.CharField(max_length=50, blank=True, null=True)
    license_expiry = models.DateField(blank=True, null=True)
    experience = models.CharField(max_length=30, blank=True, null=True)
    total_distance = models.IntegerField(default=0)
    fuel_efficiency = models.CharField(max_length=30, blank=True, null=True) # e.g. "6.8 MPG"
    
    # Advanced metadata JSON stores
    achievements = models.JSONField(default=list, blank=True)
    recent_activity = models.JSONField(default=list, blank=True)
    performance_timeline = models.JSONField(default=list, blank=True) # Array of {date, score}
    
    upcoming_trips_count = models.IntegerField(default=0)
    today_distance = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['license']),
        ]

    def __str__(self):
        return self.name
