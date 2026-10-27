from django.urls import path
from .views import (
    GenerateTestCodeView,
    RunPlaywrightTestView,
    ExecutionReportListView,
    ExportReportView
)

urlpatterns = [
    path('generate/', GenerateTestCodeView.as_view(), name='test-generate'),
    path('run/', RunPlaywrightTestView.as_view(), name='test-run'),
    path('reports/', ExecutionReportListView.as_view(), name='test-reports-list'),
    path('reports/export/<str:incident_id>/', ExportReportView.as_view(), name='test-export-report'),
]
