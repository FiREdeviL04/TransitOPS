from django.contrib import admin
from .models import Trip

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('id', 'vehicle', 'driver', 'destination', 'departure', 'status', 'progress', 'cost', 'date')
    list_filter = ('status', 'date')
    search_fields = ('id', 'destination', 'departure', 'freight')
    ordering = ('-date', 'id')
