from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('apps.accounts.urls')),
    path('api/vehicles/', include('apps.vehicles.urls')),
    path('api/drivers/', include('apps.drivers.urls')),
    path('api/trips/', include('apps.trips.urls')),
    path('api/maintenance/', include('apps.maintenance.urls')),
    path('api/fuel/', include('apps.fuel.urls')),
    path('api/expenses/', include('apps.expenses.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
    path('api/reports/', include('apps.reports.urls')),

    # Schema & Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
