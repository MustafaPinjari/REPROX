from rest_framework import serializers
from .models import GeneratedTest, ExecutionReport

class GeneratedTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedTest
        fields = '__all__'

class ExecutionReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecutionReport
        fields = '__all__'
