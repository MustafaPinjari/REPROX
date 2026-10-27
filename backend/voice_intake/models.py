from django.db import models

class VoiceReport(models.Model):
    report_id = models.CharField(max_length=100, unique=True)
    raw_transcript = models.TextField()
    dictation_source = models.CharField(max_length=50, default='wispr-flow')
    detected_intent = models.JSONField(default=dict, blank=True)
    confidence_score = models.FloatField(default=0.98)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.report_id} ({self.dictation_source})"
