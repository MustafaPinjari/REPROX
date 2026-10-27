from rest_framework import serializers
from .models import VoiceReport

class VoiceReportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='report_id')
    rawTranscript = serializers.CharField(source='raw_transcript')
    dictationSource = serializers.CharField(source='dictation_source')
    detectedIntent = serializers.JSONField(source='detected_intent')
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = VoiceReport
        fields = [
            'id',
            'rawTranscript',
            'dictationSource',
            'detectedIntent',
            'confidence_score',
            'timestamp',
            'created_at',
        ]

    def get_timestamp(self, obj):
        import time
        return int(obj.created_at.timestamp() * 1000)
