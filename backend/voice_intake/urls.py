from django.urls import path
from .views import TranscribeAudioView, ParseVoiceIntentView, VoiceHistoryListView

urlpatterns = [
    path('transcribe/', TranscribeAudioView.as_view(), name='voice-transcribe'),
    path('parse-intent/', ParseVoiceIntentView.as_view(), name='voice-parse-intent'),
    path('history/', VoiceHistoryListView.as_view(), name='voice-history'),
]
