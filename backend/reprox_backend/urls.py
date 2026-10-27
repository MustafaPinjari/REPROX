"""
URL configuration for reprox_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from .views import root_status_page, health_check

urlpatterns = [
    path('', root_status_page, name='root-status'),
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='api-health'),
    path('api/auth/', include('authentication.urls')),
    path('api/incidents/', include('incidents.urls')),
    path('api/events/', include('events.urls')),
    path('api/tests/', include('tests_runner.urls')),
    path('api/voice/', include('voice_intake.urls')),
]

