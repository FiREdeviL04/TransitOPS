from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaintenanceRecordViewSet

router = DefaultRouter()
router.register('', MaintenanceRecordViewSet, basename='maintenance')

urlpatterns = [
    path('', include(router.urls)),
]
