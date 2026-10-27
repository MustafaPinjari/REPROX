from django.db import models
from django.contrib.auth.models import User

class Incident(models.Model):
    STATUS_CHOICES = [
        ('buggy', 'Buggy'),
        ('fixed', 'Fixed'),
        ('review', 'Need Review'),
    ]

    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incidents', null=True, blank=True)
    incident_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='buggy')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='high')
    tags = models.JSONField(default=list, blank=True)
    spec_file = models.CharField(max_length=255, default='repro-buggy.spec.ts')
    is_primary_demo = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        owner_name = self.owner.username if self.owner else 'unassigned'
        return f"{self.incident_id} [{owner_name}]: {self.title}"
