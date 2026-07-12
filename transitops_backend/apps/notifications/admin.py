from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'unread', 'type', 'created_at')
    list_filter = ('unread', 'type', 'created_at')
    search_fields = ('title', 'message')
    ordering = ('-created_at',)
