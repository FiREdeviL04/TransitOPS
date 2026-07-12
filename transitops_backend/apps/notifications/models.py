from django.db import models

class Notification(models.Model):
    TYPE_CHOICES = (
        ('success', 'success'),
        ('info', 'info'),
        ('warning', 'warning'),
        ('danger', 'danger'),
    )

    title = models.CharField(max_length=150)
    message = models.CharField(max_length=300)
    unread = models.BooleanField(default=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.type} (Unread: {self.unread})"
