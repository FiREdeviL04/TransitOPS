from rest_framework import viewsets
from apps.accounts.permissions import IsAdminOrDriverReadOnly
from .models import Vehicle
from .serializers import VehicleSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAdminOrDriverReadOnly]
    filterset_fields = ['status', 'type']
    search_fields = ['name', 'plate', 'capacity']
    ordering_fields = ['id', 'fuel', 'health', 'last_service']
