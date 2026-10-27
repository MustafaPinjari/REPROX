from rest_framework import serializers
from .models import TimelineEvent

class TimelineEventSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='event_id', required=False)
    type = serializers.CharField(source='event_type', required=False)
    targetLabel = serializers.CharField(source='target_label', required=False, allow_blank=True)
    targetTestId = serializers.CharField(source='target_test_id', required=False, allow_blank=True)
    targetRole = serializers.CharField(source='target_role', required=False, allow_blank=True)
    isPiiMasked = serializers.BooleanField(source='is_pii_masked', required=False, default=False)

    class Meta:
        model = TimelineEvent
        fields = [
            'id',
            'timestamp',
            'type',
            'selector',
            'targetLabel',
            'targetTestId',
            'targetRole',
            'value',
            'description',
            'isPiiMasked',
            'incident_id',
        ]

    def to_internal_value(self, data):
        data = data.copy()
        if 'event_id' in data and 'id' not in data:
            data['id'] = data['event_id']
        if 'event_type' in data and 'type' not in data:
            data['type'] = data['event_type']
        if 'is_pii_masked' in data and 'isPiiMasked' not in data:
            data['isPiiMasked'] = data['is_pii_masked']
        return super().to_internal_value(data)

    def create(self, validated_data):
        if 'event_id' not in validated_data:
            import time
            validated_data['event_id'] = f"EVT-{int(time.time() * 1000)}"
        return TimelineEvent.objects.create(**validated_data)
