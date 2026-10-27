from rest_framework import serializers
from .models import Incident

class IncidentSerializer(serializers.ModelSerializer):
    statusLabel = serializers.SerializerMethodField()
    badgeColor = serializers.SerializerMethodField()
    iconColor = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    id = serializers.CharField(source='incident_id', required=False)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Incident
        fields = [
            'id',
            'owner',
            'title',
            'description',
            'status',
            'statusLabel',
            'severity',
            'tags',
            'spec_file',
            'is_primary_demo',
            'badgeColor',
            'iconColor',
            'time',
            'created_at',
            'updated_at',
        ]

    def to_internal_value(self, data):
        data = data.copy()
        if 'incident_id' in data and 'id' not in data:
            data['id'] = data['incident_id']
        return super().to_internal_value(data)

    def create(self, validated_data):
        incident_id = validated_data.pop('incident_id', None)
        if not incident_id:
            import uuid
            incident_id = f"INC-{uuid.uuid4().hex[:6].upper()}"
        return Incident.objects.create(incident_id=incident_id, **validated_data)

    def get_statusLabel(self, obj):
        if obj.status == 'buggy':
            return 'Buggy'
        elif obj.status == 'fixed':
            return 'Fixed (v1.0.5)'
        return 'Suite Ready'

    def get_badgeColor(self, obj):
        if obj.status == 'buggy':
            return 'bg-[#FBF0F3] text-[#D9534F] border-[#EFB6C8]'
        elif obj.status == 'fixed':
            return 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]'
        return 'bg-[#FAF7F2] text-[#8174A0] border-[#EBE7DF]'

    def get_iconColor(self, obj):
        return self.get_badgeColor(obj)

    def get_time(self, obj):
        return 'Recently'
