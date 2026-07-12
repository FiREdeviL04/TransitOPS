from rest_framework import serializers
from django.utils.timesince import timesince
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'unread', 'type', 'time']

    def get_time(self, obj):
        # Format like '5m ago', '1h ago', etc., as used in the React frontend
        try:
            return f"{timesince(obj.created_at).split(',')[0]} ago"
        except Exception:
            return "Just now"
