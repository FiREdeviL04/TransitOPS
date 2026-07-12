from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.accounts.permissions import IsAdminOrDriverReadOnly
from .models import Driver
from .serializers import DriverSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [IsAdminOrDriverReadOnly]
    filterset_fields = ['status', 'license_category']
    search_fields = ['name', 'license', 'phone', 'email']
    ordering_fields = ['id', 'safety_score', 'hours', 'total_distance']

    @action(detail=False, methods=['get'], url_path='me')
    def get_my_driver_profile(self, request):
        """
        Retrieves the driver profile for the currently logged-in user.
        """
        driver_id = getattr(request.user, 'driver_id_ref', None)
        if not driver_id:
            return Response({"detail": "This user does not have an associated driver profile."}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            driver = Driver.objects.get(id=driver_id)
            serializer = self.get_serializer(driver)
            return Response(serializer.data)
        except Driver.DoesNotExist:
            return Response({"detail": "Driver profile not found."}, status=status.HTTP_404_NOT_FOUND)
