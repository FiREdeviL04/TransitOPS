from django.contrib import admin
from .models import Driver

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'license', 'safety_score', 'status', 'hours', 'email', 'license_expiry')
    list_filter = ('status', 'license_category')
    search_fields = ('id', 'name', 'license', 'email')
    ordering = ('id',)
