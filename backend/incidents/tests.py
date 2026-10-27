from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Incident

class IncidentCrudAndAuthorizationTests(TestCase):
    def setUp(self):
        self.client_a = APIClient()
        self.user_a = User.objects.create_user(
            username='user_alice',
            email='alice@example.com',
            password='Password123!'
        )
        self.token_a = Token.objects.create(user=self.user_a)
        self.client_a.credentials(HTTP_AUTHORIZATION=f'Token {self.token_a.key}')

        self.client_b = APIClient()
        self.user_b = User.objects.create_user(
            username='user_bob',
            email='bob@example.com',
            password='Password123!'
        )
        self.token_b = Token.objects.create(user=self.user_b)
        self.client_b.credentials(HTTP_AUTHORIZATION=f'Token {self.token_b.key}')

        self.list_create_url = reverse('incident-list-create')

    def test_unauthenticated_request_rejected(self):
        anon_client = APIClient()
        response = anon_client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_incident_assigns_authenticated_owner(self):
        payload = {
            'incident_id': 'INC-ALICE-1',
            'title': 'Alice invoice tax issue',
            'description': 'Description for Alice invoice',
            'status': 'buggy',
            'severity': 'high',
            'tags': ['billing', 'tax']
        }
        response = self.client_a.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        incident = Incident.objects.get(incident_id='INC-ALICE-1')
        self.assertEqual(incident.owner, self.user_a)
        self.assertEqual(response.json()['owner'], 'user_alice')

    def test_tenant_data_isolation_list(self):
        # Alice creates an incident
        Incident.objects.create(
            owner=self.user_a,
            incident_id='INC-ALICE-99',
            title='Alice Secret Incident',
            description='Proprietary data'
        )
        # Bob creates an incident
        Incident.objects.create(
            owner=self.user_b,
            incident_id='INC-BOB-99',
            title='Bob Incident',
            description='Bob public data'
        )

        # Alice's view: only Alice's incidents
        res_a = self.client_a.get(self.list_create_url)
        self.assertEqual(res_a.status_code, status.HTTP_200_OK)
        ids_a = [item['id'] for item in res_a.json()]
        self.assertIn('INC-ALICE-99', ids_a)
        self.assertNotIn('INC-BOB-99', ids_a)

        # Bob's view: only Bob's incidents
        res_b = self.client_b.get(self.list_create_url)
        self.assertEqual(res_b.status_code, status.HTTP_200_OK)
        ids_b = [item['id'] for item in res_b.json()]
        self.assertIn('INC-BOB-99', ids_b)
        self.assertNotIn('INC-ALICE-99', ids_b)

    def test_user_cannot_read_other_users_incident_detail(self):
        Incident.objects.create(
            owner=self.user_a,
            incident_id='INC-PRIVATE-A',
            title='Alice Private Incident',
            description='Confidential bug reproduction'
        )
        detail_url = reverse('incident-detail', kwargs={'incident_id': 'INC-PRIVATE-A'})

        # Alice can read it
        res_a = self.client_a.get(detail_url)
        self.assertEqual(res_a.status_code, status.HTTP_200_OK)

        # Bob CANNOT read it -> 404 Not Found (tenant-isolated)
        res_b = self.client_b.get(detail_url)
        self.assertEqual(res_b.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_update_other_users_incident(self):
        Incident.objects.create(
            owner=self.user_a,
            incident_id='INC-PRIVATE-A',
            title='Alice Private Incident',
            description='Confidential bug reproduction'
        )
        detail_url = reverse('incident-detail', kwargs={'incident_id': 'INC-PRIVATE-A'})

        # Bob attempts to overwrite Alice's incident
        res_b = self.client_b.patch(detail_url, {'title': 'Hacked Title'}, format='json')
        self.assertEqual(res_b.status_code, status.HTTP_404_NOT_FOUND)

        # Verify title remains unchanged in DB
        incident = Incident.objects.get(incident_id='INC-PRIVATE-A')
        self.assertEqual(incident.title, 'Alice Private Incident')

    def test_user_cannot_delete_other_users_incident(self):
        Incident.objects.create(
            owner=self.user_a,
            incident_id='INC-PRIVATE-A',
            title='Alice Private Incident',
            description='Confidential bug reproduction'
        )
        detail_url = reverse('incident-detail', kwargs={'incident_id': 'INC-PRIVATE-A'})

        # Bob attempts to delete Alice's incident
        res_b = self.client_b.delete(detail_url)
        self.assertEqual(res_b.status_code, status.HTTP_404_NOT_FOUND)

        # Verify incident still exists
        self.assertTrue(Incident.objects.filter(incident_id='INC-PRIVATE-A').exists())

    def test_incident_filters(self):
        Incident.objects.create(
            owner=self.user_a,
            incident_id='INC-FILTER-1',
            title='Buggy Invoice Flow',
            status='buggy'
        )
        Incident.objects.create(
            owner=self.user_a,
            incident_id='INC-FILTER-2',
            title='Fixed Checkout Form',
            status='fixed'
        )

        # Filter by status=fixed
        res = self.client_a.get(f"{self.list_create_url}?status=fixed")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.json()
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], 'INC-FILTER-2')

        # Filter by search=Invoice
        res_search = self.client_a.get(f"{self.list_create_url}?search=Invoice")
        self.assertEqual(res_search.status_code, status.HTTP_200_OK)
        self.assertEqual(res_search.json()[0]['id'], 'INC-FILTER-1')
