from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .models import FuelLog
from .serializers import FuelLogSerializer
from .services import FuelLogService

class FuelLogPermission(permissions.BasePermission):
    """
    Custom permission for FuelLogs:
    - Admin: Full Access
    - Driver: GET (view logs) and POST (create log)
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == 'Admin':
            return True
        if request.user.role == 'Driver':
            # Drivers can read and create
            return request.method in ['GET', 'POST', 'HEAD', 'OPTIONS']
        return False

class FuelLogViewSet(viewsets.ModelViewSet):
    queryset = FuelLog.objects.select_related('vehicle').all()
    serializer_class = FuelLogSerializer
    permission_classes = [FuelLogPermission]
    filterset_fields = ['vehicle']
    search_fields = ['station']
    ordering_fields = ['id', 'date', 'volume', 'total_cost']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            log = FuelLogService.log_fuel(
                id=serializer.validated_data.get('id', f"f-{FuelLog.objects.count() + 10}"),
                vehicle_id=request.data.get('vehicleId'),
                volume=serializer.validated_data.get('volume'),
                price_per_unit=request.data.get('pricePerUnit'),
                odometer=serializer.validated_data.get('odometer'),
                station=serializer.validated_data.get('station'),
                date_val=serializer.validated_data.get('date')
            )
            return Response(self.get_serializer(log).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
