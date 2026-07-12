from django.contrib import admin
from .models import FuelLog

@admin.register(FuelLog)
class FuelLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'vehicle', 'volume', 'price_per_unit', 'total_cost', 'odometer', 'station', 'date')
    list_filter = ('date', 'station')
    search_fields = ('id', 'station')
    ordering = ('-date', 'id')
