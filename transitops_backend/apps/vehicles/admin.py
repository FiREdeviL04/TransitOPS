from django.contrib import admin
from .models import Vehicle

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'plate', 'type', 'status', 'fuel', 'health', 'last_service')
    list_filter = ('status', 'type')
    search_fields = ('id', 'name', 'plate')
    ordering = ('id',)
