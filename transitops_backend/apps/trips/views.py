from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.accounts.permissions import IsAdminOrDriverReadOnly
from .models import Trip
from .serializers import TripSerializer
from .services import TripService

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.select_related('vehicle', 'driver').all()
    serializer_class = TripSerializer
    permission_classes = [IsAdminOrDriverReadOnly]
    filterset_fields = ['status', 'vehicle', 'driver']
    search_fields = ['destination', 'departure', 'freight']
    ordering_fields = ['id', 'date', 'progress', 'cost']

    def create(self, request, *args, **kwargs):
        """
        Custom create utilizing TripService to coordinate business logic transactions.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Call the TripService atomic transaction
        try:
            trip = TripService.create_trip(
                id=serializer.validated_data.get('id', f"TR-{Trip.objects.count() + 8950}"),
                vehicle_id=request.data.get('vehicleId'),
                driver_id=request.data.get('driverId'),
                destination=serializer.validated_data.get('destination'),
                departure=serializer.validated_data.get('departure'),
                freight=serializer.validated_data.get('freight'),
                cost=serializer.validated_data.get('cost'),
                date_val=serializer.validated_data.get('date'),
                status=request.data.get('status', 'Pending')
            )
            return Response(self.get_serializer(trip).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='dispatch')
    def dispatch_trip(self, request, pk=None):
        try:
            trip = TripService.dispatch_trip(pk)
            return Response(self.get_serializer(trip).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='complete')
    def complete_trip(self, request, pk=None):
        fuel_volume = request.data.get('fuelVolume')
        fuel_price = request.data.get('fuelPrice')
        odometer = request.data.get('odometer')
        station = request.data.get('station', 'Station Unspecified')
        
        try:
            trip, fuel_log = TripService.complete_trip(
                trip_id=pk,
                fuel_volume=float(fuel_volume) if fuel_volume else None,
                fuel_price=float(fuel_price) if fuel_price else None,
                odometer=int(odometer) if odometer else None,
                station=station
            )
            
            res_data = {
                "trip": self.get_serializer(trip).data,
                "fuel_log_created": fuel_log is not None
            }
            return Response(res_data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_trip(self, request, pk=None):
        try:
            trip = TripService.cancel_trip(pk)
            return Response(self.get_serializer(trip).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
