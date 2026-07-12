from django.urls import path
from .views import FuelEfficiencyReportView, DriverPerformanceReportView, OperationalExpensesReportView

urlpatterns = [
    path('fuel-efficiency/', FuelEfficiencyReportView.as_view(), name='report-fuel-efficiency'),
    path('driver-performance/', DriverPerformanceReportView.as_view(), name='report-driver-performance'),
    path('operational-expenses/', OperationalExpensesReportView.as_view(), name='report-operational-expenses'),
]
