from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('username', email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'Admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('Driver', 'Driver'),
    )
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='Admin')
    name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    # Linked Driver Profile ID (Optional, used if role is Driver)
    driver_id_ref = models.CharField(max_length=50, blank=True, null=True, help_text="Points to the Driver ID in driver roster")

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = f"{self.first_name} {self.last_name}".strip() or self.email.split('@')[0]
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} ({self.role})"
