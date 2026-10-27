"""
URL configuration for reprox_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'REPROX Backend Engine',
        'version': '1.0.5',
        'database': 'SQLite3 (Active)',
        'playwrightRunner': 'Ready',
        'wisprFlowEngine': 'Active',
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='api-health'),
    path('api/auth/', include('authentication.urls')),
    path('api/incidents/', include('incidents.urls')),
    path('api/events/', include('events.urls')),
    path('api/tests/', include('tests_runner.urls')),
    path('api/voice/', include('voice_intake.urls')),
]
