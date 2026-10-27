from django.urls import path
from .views import IncidentListCreateView, IncidentDetailView

urlpatterns = [
    path('', IncidentListCreateView.as_view(), name='incident-list-create'),
    path('<str:incident_id>/', IncidentDetailView.as_view(), name='incident-detail'),
]
