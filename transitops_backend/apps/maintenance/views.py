from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.accounts.permissions import IsAdminOrDriverReadOnly
from .models import MaintenanceRecord
from .serializers import MaintenanceRecordSerializer
from .services import MaintenanceService

class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRecord.objects.select_related('vehicle').all()
    serializer_class = MaintenanceRecordSerializer
    permission_classes = [IsAdminOrDriverReadOnly]
    filterset_fields = ['status', 'priority', 'vehicle']
    search_fields = ['type', 'technician']
    ordering_fields = ['id', 'date', 'cost']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            record = MaintenanceService.create_maintenance_record(
                id=serializer.validated_data.get('id', f"m-{MaintenanceRecord.objects.count() + 10}"),
                vehicle_id=request.data.get('vehicleId'),
                type_val=serializer.validated_data.get('type'),
                priority=serializer.validated_data.get('priority'),
                status=serializer.validated_data.get('status'),
                cost=serializer.validated_data.get('cost'),
                date_val=serializer.validated_data.get('date'),
                technician=serializer.validated_data.get('technician')
            )
            return Response(self.get_serializer(record).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='resolve')
    def resolve_record(self, request, pk=None):
        cost = request.data.get('cost')
        technician = request.data.get('technician')
        try:
            record = MaintenanceService.resolve_maintenance_record(
                record_id=pk,
                resolution_cost=float(cost) if cost else None,
                technician=technician
            )
            return Response(self.get_serializer(record).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
