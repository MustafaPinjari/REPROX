from django.urls import path
from .views import EventListCreateView, EventBatchSyncView, EventClearView

urlpatterns = [
    path('', EventListCreateView.as_view(), name='event-list-create'),
    path('batch/', EventBatchSyncView.as_view(), name='event-batch-sync'),
    path('clear/', EventClearView.as_view(), name='event-clear'),
]
