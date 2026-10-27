import time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import TimelineEvent
from .serializers import TimelineEventSerializer
from .privacy import scrub_sensitive_text
from incidents.models import Incident

class EventListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        incident_id = request.query_params.get('incident', 'INC-104')
        
        # Verify incident ownership
        incident = Incident.objects.filter(incident_id=incident_id, owner=request.user).first()
        if not incident:
            return Response(
                {'error': f"Incident '{incident_id}' does not exist or you do not have permission to access it."},
                status=status.HTTP_404_NOT_FOUND
            )

        events = TimelineEvent.objects.filter(incident_id=incident_id)
        serializer = TimelineEventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        incident_id = request.data.get('incident_id', 'INC-104')
        incident = Incident.objects.filter(incident_id=incident_id, owner=request.user).first()
        if not incident:
            return Response(
                {'error': f"Incident '{incident_id}' does not exist or you do not have permission to modify it."},
                status=status.HTTP_404_NOT_FOUND
            )

        data = request.data.copy()
        raw_val = data.get('value', '')
        scrubbed_val, was_val_scrubbed = scrub_sensitive_text(raw_val)
        raw_desc = data.get('description', '')
        scrubbed_desc, was_desc_scrubbed = scrub_sensitive_text(raw_desc)

        data['value'] = scrubbed_val
        data['description'] = scrubbed_desc
        if was_val_scrubbed or was_desc_scrubbed:
            data['is_pii_masked'] = True

        serializer = TimelineEventSerializer(data=data)
        if serializer.is_valid():
            event = serializer.save()
            return Response(TimelineEventSerializer(event).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventBatchSyncView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        incident_id = request.data.get('incident_id', 'INC-104')
        raw_events = request.data.get('events', [])
        
        # Verify incident ownership
        incident = Incident.objects.filter(incident_id=incident_id, owner=request.user).first()
        if not incident:
            return Response(
                {'error': f"Incident '{incident_id}' does not exist or you do not have permission to modify it."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Replace existing events for this incident
        TimelineEvent.objects.filter(incident_id=incident_id).delete()
        
        created = []
        for i, item in enumerate(raw_events):
            raw_val = item.get('value', '')
            scrubbed_val, was_val_scrubbed = scrub_sensitive_text(raw_val)
            raw_desc = item.get('description', '')
            scrubbed_desc, was_desc_scrubbed = scrub_sensitive_text(raw_desc)
            is_masked = item.get('isPiiMasked', False) or was_val_scrubbed or was_desc_scrubbed

            evt = TimelineEvent(
                event_id=item.get('id') or f"EVT-{int(time.time() * 1000) + i}",
                incident_id=incident_id,
                timestamp=item.get('timestamp') or int(time.time() * 1000),
                event_type=item.get('type', 'click'),
                selector=item.get('selector', ''),
                target_label=item.get('targetLabel', ''),
                target_test_id=item.get('targetTestId', ''),
                target_role=item.get('targetRole', ''),
                value=scrubbed_val,
                description=scrubbed_desc,
                is_pii_masked=is_masked
            )
            created.append(evt)
        
        TimelineEvent.objects.bulk_create(created)
        saved_events = TimelineEvent.objects.filter(incident_id=incident_id)
        return Response(TimelineEventSerializer(saved_events, many=True).data, status=status.HTTP_200_OK)


class EventClearView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        incident_id = request.query_params.get('incident', 'INC-104')
        incident = Incident.objects.filter(incident_id=incident_id, owner=request.user).first()
        if not incident:
            return Response(
                {'error': f"Incident '{incident_id}' does not exist or you do not have permission to modify it."},
                status=status.HTTP_404_NOT_FOUND
            )

        TimelineEvent.objects.filter(incident_id=incident_id).delete()
        return Response({'message': f'Timeline events cleared for {incident_id}.'}, status=status.HTTP_200_OK)
