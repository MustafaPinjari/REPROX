from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Incident
from .serializers import IncidentSerializer

class IncidentListCreateView(generics.ListCreateAPIView):
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Enforce strict tenant data isolation:
        A user can ONLY see incidents they own.
        """
        queryset = Incident.objects.filter(owner=self.request.user)
        status_param = self.request.query_params.get('status')
        search_param = self.request.query_params.get('search')

        if status_param and status_param != 'all':
            queryset = queryset.filter(status=status_param)
        if search_param:
            queryset = queryset.filter(title__icontains=search_param) | queryset.filter(description__icontains=search_param)
        return queryset

    def perform_create(self, serializer):
        """
        Automatically bind new incidents to the authenticated owner.
        """
        serializer.save(owner=self.request.user)


class IncidentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'incident_id'

    def get_queryset(self):
        """
        Strict data boundary: A user cannot access, modify, or delete another user's incidents.
        """
        return Incident.objects.filter(owner=self.request.user)
