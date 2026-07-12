from django.contrib import admin
from .models import MaintenanceRecord

@admin.register(MaintenanceRecord)
class MaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'vehicle', 'type', 'priority', 'status', 'cost', 'date', 'technician')
    list_filter = ('status', 'priority', 'date')
    search_fields = ('id', 'type', 'technician')
    ordering = ('-date', 'id')
