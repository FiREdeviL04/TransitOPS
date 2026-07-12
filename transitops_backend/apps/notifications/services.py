from .models import Notification

class NotificationService:
    @staticmethod
    def create_notification(title, message, notif_type='info'):
        notification = Notification.objects.create(
            title=title,
            message=message,
            type=notif_type,
            unread=True
        )
        return notification

    @staticmethod
    def mark_as_read(notification_id):
        try:
            notification = Notification.objects.get(id=notification_id)
            notification.unread = False
            notification.save()
            return notification
        except Notification.DoesNotExist:
            return None

    @staticmethod
    def mark_all_as_read():
        Notification.objects.filter(unread=True).update(unread=False)
