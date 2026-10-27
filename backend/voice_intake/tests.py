from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from .views import parse_natural_language_intent

class VoiceIntakeApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='voice_tester',
            email='voice@reprox.dev',
            password='Password123!'
        )
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        self.transcribe_url = reverse('voice-transcribe')
        self.parse_url = reverse('voice-parse-intent')
        self.history_url = reverse('voice-history')

    def test_transcribe_and_intent_extraction(self):
        sample_transcript = "Customer Acme Corp tries submitting an invoice for $4,850 without entering a GST identification number."
        response = self.client.post(
            self.transcribe_url,
            {'transcript': sample_transcript, 'source': 'browser-speech-nlp'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data['rawTranscript'], sample_transcript)
        self.assertIn('detectedIntent', data)
        self.assertEqual(data['detectedIntent']['clientName'], 'Acme Corp')
        self.assertEqual(data['detectedIntent']['invoiceAmount'], '4850')
        self.assertEqual(data['detectedIntent']['feature'], 'invoice-gstin')

    def test_parse_intent_endpoint_valid_input(self):
        response = self.client.post(
            self.parse_url,
            {'transcript': 'User Acme Corp attempts submitting invoice for $1200 without GST'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['intent']['feature'], 'invoice-gstin')
        self.assertEqual(response.json()['intent']['invoiceAmount'], '1200')
        self.assertEqual(response.json()['engine'], 'deterministic-reprox-nlp')

    def test_parse_intent_endpoint_empty_input_rejected(self):
        response = self.client.post(
            self.parse_url,
            {'transcript': ''},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.json())

    def test_parse_natural_language_intent_unit_logic(self):
        # Test auth feature classification
        auth_transcript = "User cannot login with valid SSO OAuth token and password"
        auth_intent = parse_natural_language_intent(auth_transcript)
        self.assertEqual(auth_intent['feature'], 'authentication')

        # Test settings feature classification
        settings_transcript = "Profile settings page crashes when saving new user avatar"
        settings_intent = parse_natural_language_intent(settings_transcript)
        self.assertEqual(settings_intent['feature'], 'settings')

    def test_voice_history_requires_authentication(self):
        anon_client = APIClient()
        response = anon_client.get(self.history_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticated access
        auth_response = self.client.get(self.history_url)
        self.assertEqual(auth_response.status_code, status.HTTP_200_OK)
