from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from incidents.models import Incident
from .models import TimelineEvent
from .privacy import scrub_sensitive_text

class TimelineEventsAndPrivacyTests(TestCase):
    def setUp(self):
        self.user_alice = User.objects.create_user(
            username='alice',
            email='alice@example.com',
            password='Password123!'
        )
        self.token_alice = Token.objects.create(user=self.user_alice)
        self.client_alice = APIClient()
        self.client_alice.credentials(HTTP_AUTHORIZATION=f'Token {self.token_alice.key}')

        self.user_bob = User.objects.create_user(
            username='bob',
            email='bob@example.com',
            password='Password123!'
        )
        self.token_bob = Token.objects.create(user=self.user_bob)
        self.client_bob = APIClient()
        self.client_bob.credentials(HTTP_AUTHORIZATION=f'Token {self.token_bob.key}')

        self.incident_alice = Incident.objects.create(
            owner=self.user_alice,
            incident_id='INC-ALICE-100',
            title='Alice billing issue'
        )

        self.events_url = reverse('event-list-create')
        self.batch_url = reverse('event-batch-sync')
        self.clear_url = reverse('event-clear')

    def test_unauthenticated_access_rejected(self):
        anon_client = APIClient()
        response = anon_client.get(f"{self.events_url}?incident=INC-ALICE-100")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_bob_cannot_access_alices_incident_events(self):
        # Bob tries to view events of Alice's incident
        response = self.client_bob.get(f"{self.events_url}?incident=INC-ALICE-100")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_bob_cannot_post_event_to_alices_incident(self):
        payload = {
            'incident_id': 'INC-ALICE-100',
            'event_id': 'EVT-BOB-INJECTION',
            'timestamp': 1700000000,
            'event_type': 'click',
            'selector': '#malicious'
        }
        response = self.client_bob.post(self.events_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_bob_cannot_batch_sync_to_alices_incident(self):
        payload = {
            'incident_id': 'INC-ALICE-100',
            'events': [{'id': 'EVT-1', 'type': 'click', 'selector': '#btn'}]
        }
        response = self.client_bob.post(self.batch_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_bob_cannot_clear_alices_incident_events(self):
        response = self.client_bob.delete(f"{self.clear_url}?incident=INC-ALICE-100")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_privacy_scrubbing_unit_function(self):
        # JWT Token
        raw_jwt = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotLeakThis"
        scrubbed, was_redacted = scrub_sensitive_text(raw_jwt)
        self.assertTrue(was_redacted)
        self.assertIn('[REDACTED_TOKEN]', scrubbed)
        self.assertNotIn('doNotLeakThis', scrubbed)

        # Credit card
        raw_cc = "Payment with card 4111 2222 3333 4444"
        scrubbed_cc, was_cc_redacted = scrub_sensitive_text(raw_cc)
        self.assertTrue(was_cc_redacted)
        self.assertIn('[REDACTED_CREDIT_CARD]', scrubbed_cc)

        # Password
        raw_pwd = 'Config: password="SuperSecretPassword"'
        scrubbed_pwd, was_pwd_redacted = scrub_sensitive_text(raw_pwd)
        self.assertTrue(was_pwd_redacted)
        self.assertIn('[REDACTED_SECRET]', scrubbed_pwd)

    def test_post_event_automatically_masks_pii(self):
        payload = {
            'incident_id': 'INC-ALICE-100',
            'event_id': 'EVT-PII-TEST',
            'timestamp': 1700000000,
            'event_type': 'fill',
            'selector': '#bearerTokenInput',
            'value': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.supersecret',
            'description': 'Pasted Bearer token into authorization header input'
        }
        response = self.client_alice.post(self.events_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertTrue(data.get('isPiiMasked', data.get('is_pii_masked')))
        self.assertIn('[REDACTED_TOKEN]', data['value'])
        self.assertNotIn('supersecret', data['value'])

    def test_batch_sync_masks_pii_and_stores_clean_events(self):
        events_payload = [
            {
                'id': 'EVT-B1',
                'type': 'fill',
                'selector': '#creditCard',
                'value': '4111 2222 3333 4444',
                'description': 'Entered credit card for corporate subscription'
            },
            {
                'id': 'EVT-B2',
                'type': 'fill',
                'selector': '#userEmail',
                'value': 'ceo@acmeglobal.com',
                'description': 'Entered CEO email'
            }
        ]
        response = self.client_alice.post(
            self.batch_url,
            {'incident_id': 'INC-ALICE-100', 'events': events_payload},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        saved = response.json()
        self.assertEqual(len(saved), 2)
        # Verify first event had credit card masked
        self.assertTrue(saved[0].get('isPiiMasked', saved[0].get('is_pii_masked')))
        self.assertEqual(saved[0]['value'], '[REDACTED_CREDIT_CARD]')
        # Verify second event had email masked
        self.assertTrue(saved[1].get('isPiiMasked', saved[1].get('is_pii_masked')))
        self.assertEqual(saved[1]['value'], '[REDACTED_EMAIL]')
