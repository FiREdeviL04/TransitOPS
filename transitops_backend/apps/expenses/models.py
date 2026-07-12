from django.db import models

class Expense(models.Model):
    CATEGORY_CHOICES = (
        ('Fuel', 'Fuel'),
        ('Maintenance', 'Maintenance'),
        ('Driver Salary', 'Driver Salary'),
        ('Insurance', 'Insurance'),
        ('Tolls & Permits', 'Tolls & Permits'),
        ('Other', 'Other'),
    )

    id = models.CharField(max_length=50, primary_key=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.CharField(max_length=300)
    reference = models.CharField(max_length=100)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', 'id']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.category} - ${self.amount} ({self.date})"
