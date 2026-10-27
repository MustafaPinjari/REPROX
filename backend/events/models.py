from django.db import models

class TimelineEvent(models.Model):
    event_id = models.CharField(max_length=100, unique=True)
    incident_id = models.CharField(max_length=50, blank=True, null=True, default='INC-104')
    timestamp = models.BigIntegerField()
    event_type = models.CharField(max_length=50) # 'fill', 'click', 'assert', 'navigate'
    selector = models.CharField(max_length=255)
    target_label = models.CharField(max_length=255, blank=True, default='')
    target_test_id = models.CharField(max_length=255, blank=True, default='')
    target_role = models.CharField(max_length=50, blank=True, default='')
    value = models.TextField(blank=True, default='')
    description = models.TextField(blank=True, default='')
    is_pii_masked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp', 'id']

    def __str__(self):
        return f"{self.event_id} ({self.event_type}) - {self.selector}"
