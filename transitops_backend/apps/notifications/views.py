from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from .services import NotificationService

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='read')
    def mark_read(self, request, pk=None):
        notif = NotificationService.mark_as_read(pk)
        if notif:
            return Response(self.get_serializer(notif).data)
        return Response({"detail": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='read-all')
    def mark_all_read(self, request):
        NotificationService.mark_all_as_read()
        return Response({"detail": "All notifications marked as read."}, status=status.HTTP_200_OK)
