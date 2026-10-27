from django.db import models

class GeneratedTest(models.Model):
    name = models.CharField(max_length=255)
    incident_id = models.CharField(max_length=50, default='INC-104')
    test_code = models.TextField()
    spec_filename = models.CharField(max_length=255, default='invoice-gst.spec.ts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.spec_filename})"

class ExecutionReport(models.Model):
    STATUS_CHOICES = [
        ('passed', 'Passed'),
        ('failed', 'Failed'),
        ('running', 'Running'),
    ]

    report_id = models.CharField(max_length=100, unique=True)
    incident_id = models.CharField(max_length=50, default='INC-104')
    build_mode = models.CharField(max_length=20) # 'buggy' or 'fixed'
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    exit_code = models.IntegerField(default=0)
    total_duration_ms = models.IntegerField(default=0)
    stdout_log = models.TextField(blank=True, default='')
    stderr_log = models.TextField(blank=True, default='')
    steps_data = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.report_id} - {self.build_mode} ({self.status})"
