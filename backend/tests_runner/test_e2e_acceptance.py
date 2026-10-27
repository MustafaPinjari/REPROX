import os
import json
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from incidents.models import Incident
from events.models import TimelineEvent
from tests_runner.models import ExecutionReport, GeneratedTest
from tests_runner.views import get_sanitized_subprocess_env

class ReproxEndToEndAcceptanceTests(TestCase):
    """
    Acceptance test suite verifying the complete REPROX user workflow,
    multi-user data isolation, fault injection, edge cases, and genuine Playwright execution.
    """

    def setUp(self):
        self.client = APIClient()

    def test_full_workflow_registration_incident_generate_run_export(self):
        """
        Scenario 1: Full User Journey
        1. Register user
        2. Authenticate and retrieve DRF Token
        3. Parse natural language bug description via intent grammar
        4. Create incident linked to authenticated user
        5. Record and sync timeline events with automatic PII scrubbing
        6. Generate Playwright test code
        7. Execute buggy mode (assert failure exit code 1)
        8. Execute fixed mode (assert verified pass exit code 0)
        9. Retrieve execution reports and export markdown reproduction
        """
        # 1. Registration
        register_url = reverse('auth-register')
        reg_payload = {
            'email': 'lead_qa@reprox.dev',
            'username': 'lead_qa',
            'password': 'StrongProductionPassword2026!',
            'first_name': 'Lead',
            'last_name': 'Engineer'
        }
        reg_res = self.client.post(register_url, reg_payload, format='json')
        self.assertEqual(reg_res.status_code, status.HTTP_201_CREATED)
        token = reg_res.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        # 2. Verify Profile via /api/auth/me/
        me_res = self.client.get(reverse('auth-me'))
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.json()['email'], 'lead_qa@reprox.dev')

        # 3. Parse Voice/Text Bug Description
        parse_url = reverse('voice-parse-intent')
        transcript = (
            "Customer Acme Corp tries submitting an invoice for $4,850 without entering a GST identification number. "
            "The app mistakenly shows an invoice created toast instead of validating the GSTIN field."
        )
        parse_res = self.client.post(parse_url, {'transcript': transcript}, format='json')
        self.assertEqual(parse_res.status_code, status.HTTP_200_OK)
        intent = parse_res.json()['intent']
        self.assertEqual(intent['feature'], 'invoice-gstin')
        self.assertEqual(intent['clientName'], 'Acme Corp')
        self.assertEqual(intent['invoiceAmount'], '4850')

        # 4. Create Incident
        incidents_url = reverse('incident-list-create')
        incident_payload = {
            'incident_id': 'INC-E2E-101',
            'title': intent['actionTaken'],
            'description': transcript,
            'status': 'buggy',
            'severity': intent['severity'],
            'tags': ['invoice', 'validation', 'gst'],
            'spec_file': 'repro-buggy.spec.ts',
            'is_primary_demo': True
        }
        inc_res = self.client.post(incidents_url, incident_payload, format='json')
        self.assertEqual(inc_res.status_code, status.HTTP_201_CREATED)
        incident_id = inc_res.json()['id']
        self.assertEqual(incident_id, 'INC-E2E-101')
        self.assertEqual(inc_res.json()['owner'], 'lead_qa')

        # 5. Record & Sync Timeline Events with Sensitive Credential Scrubbing
        events_batch_url = reverse('event-batch-sync')
        events = [
            {
                'id': 'EVT-1',
                'type': 'fill',
                'selector': '#clientName',
                'targetLabel': 'Client Business Name',
                'targetTestId': 'input-client-name',
                'targetRole': 'textbox',
                'value': 'Acme Global Ltd',
                'description': 'Entered client name'
            },
            {
                'id': 'EVT-2',
                'type': 'fill',
                'selector': '#invoiceAmount',
                'targetLabel': 'Invoice Total (USD)',
                'targetTestId': 'input-amount',
                'targetRole': 'textbox',
                'value': '4850.00',
                'description': 'Entered invoice amount'
            },
            {
                'id': 'EVT-3',
                'type': 'fill',
                'selector': '#authHeader',
                'targetLabel': 'Authorization Bearer Header',
                'value': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.supersecret',
                'description': 'Pasted authorization token'
            },
            {
                'id': 'EVT-4',
                'type': 'click',
                'selector': '#dispatchInvoiceBtn',
                'targetLabel': 'Generate & Dispatch Invoice',
                'targetRole': 'button',
                'description': 'Clicked dispatch invoice'
            },
            {
                'id': 'EVT-5',
                'type': 'assert',
                'selector': '[role="alert"]',
                'targetRole': 'alert',
                'value': 'GSTIN is required for commercial invoices.',
                'description': 'Assert statutory GSTIN alert is visible'
            }
        ]
        sync_res = self.client.post(
            events_batch_url,
            {'incident_id': incident_id, 'events': events},
            format='json'
        )
        self.assertEqual(sync_res.status_code, status.HTTP_200_OK)
        saved_events = sync_res.json()
        self.assertEqual(len(saved_events), 5)
        # Verify secret token was scrubbed before persistence
        auth_evt = saved_events[2]
        self.assertTrue(auth_evt['isPiiMasked'])
        self.assertIn('[REDACTED_TOKEN]', auth_evt['value'])
        self.assertNotIn('supersecret', auth_evt['value'])

        # 6. Synthesize Playwright Test
        gen_url = reverse('test-generate')
        gen_res = self.client.post(
            gen_url,
            {'events': saved_events, 'incident_id': incident_id},
            format='json'
        )
        self.assertEqual(gen_res.status_code, status.HTTP_200_OK)
        code = gen_res.json()['code']
        self.assertIn("test('reproduce incident ' + \"INC-E2E-101\"", code)
        self.assertIn("getByRole('alert')", code)

        # 7. Execute Playwright Runner (Buggy Build Mode)
        run_url = reverse('test-run')
        buggy_res = self.client.post(
            run_url,
            {'buildMode': 'buggy', 'incident_id': incident_id},
            format='json'
        )
        self.assertEqual(buggy_res.status_code, status.HTTP_200_OK)
        buggy_data = buggy_res.json()
        self.assertEqual(buggy_data['buildMode'], 'buggy')
        self.assertEqual(buggy_data['status'], 'failed')
        self.assertEqual(buggy_data['exitCode'], 1)
        self.assertIn('reportId', buggy_data)

        # 8. Execute Playwright Runner (Fixed Build Mode)
        fixed_res = self.client.post(
            run_url,
            {'buildMode': 'fixed', 'incident_id': incident_id},
            format='json'
        )
        self.assertEqual(fixed_res.status_code, status.HTTP_200_OK)
        fixed_data = fixed_res.json()
        self.assertEqual(fixed_data['buildMode'], 'fixed')
        self.assertEqual(fixed_data['status'], 'passed')
        self.assertEqual(fixed_data['exitCode'], 0)

        # 9. Query Execution Reports
        reports_url = f"{reverse('test-reports-list')}?incident={incident_id}"
        rep_res = self.client.get(reports_url)
        self.assertEqual(rep_res.status_code, status.HTTP_200_OK)
        reports = rep_res.json()
        self.assertEqual(len(reports), 2)

        # 10. Export Reproduction Report
        export_url = reverse('test-export-report', kwargs={'incident_id': incident_id})
        exp_res = self.client.get(export_url)
        self.assertEqual(exp_res.status_code, status.HTTP_200_OK)
        content = exp_res.json()['content']
        self.assertIn('# REPROX Automated Incident Report: INC-E2E-101', content)
        self.assertIn('**Owner:** lead_qa', content)
        self.assertIn('BUGGY', content)
        self.assertIn('FIXED', content)

    def test_two_user_strict_isolation(self):
        """
        Scenario 2: Strict Multi-Tenant Data Isolation
        User Alice creates an incident, events, and reports.
        User Bob authenticates and attempts to read, write, update, execute, or export Alice's data.
        Every attempt MUST return 404 Not Found or be excluded from listings.
        """
        # Create Alice
        alice = User.objects.create_user(
            username='alice',
            email='alice@reprox.dev',
            password='AliceSecurePassword123!'
        )
        token_alice = Token.objects.create(user=alice)
        client_alice = APIClient()
        client_alice.credentials(HTTP_AUTHORIZATION=f'Token {token_alice.key}')

        # Alice creates private incident
        inc_alice = Incident.objects.create(
            owner=alice,
            incident_id='INC-ALICE-SECURE',
            title='Alice Confidential Security Incident',
            description='Sensitive vulnerability details'
        )

        # Alice records an event
        TimelineEvent.objects.create(
            event_id='EVT-ALICE-1',
            incident_id='INC-ALICE-SECURE',
            timestamp=1700000000,
            event_type='fill',
            selector='#secretField',
            value='AlicePrivateValue'
        )

        # Alice records an execution report
        ExecutionReport.objects.create(
            report_id='REP-ALICE-1',
            incident_id='INC-ALICE-SECURE',
            build_mode='fixed',
            status='passed',
            exit_code=0
        )

        # Create Bob
        bob = User.objects.create_user(
            username='bob',
            email='bob@reprox.dev',
            password='BobSecurePassword123!'
        )
        token_bob = Token.objects.create(user=bob)
        client_bob = APIClient()
        client_bob.credentials(HTTP_AUTHORIZATION=f'Token {token_bob.key}')

        # Bob lists incidents -> Alice's incident must NOT appear
        bob_list_res = client_bob.get(reverse('incident-list-create'))
        self.assertEqual(bob_list_res.status_code, status.HTTP_200_OK)
        bob_inc_ids = [item['id'] for item in bob_list_res.json()]
        self.assertNotIn('INC-ALICE-SECURE', bob_inc_ids)

        # Bob attempts to fetch Alice's incident detail -> 404
        detail_url = reverse('incident-detail', kwargs={'incident_id': 'INC-ALICE-SECURE'})
        self.assertEqual(client_bob.get(detail_url).status_code, status.HTTP_404_NOT_FOUND)

        # Bob attempts to update Alice's incident -> 404
        self.assertEqual(
            client_bob.patch(detail_url, {'title': 'Tampered by Bob'}, format='json').status_code,
            status.HTTP_404_NOT_FOUND
        )

        # Bob attempts to delete Alice's incident -> 404
        self.assertEqual(client_bob.delete(detail_url).status_code, status.HTTP_404_NOT_FOUND)

        # Bob attempts to fetch Alice's timeline events -> 404
        events_url = f"{reverse('event-list-create')}?incident=INC-ALICE-SECURE"
        self.assertEqual(client_bob.get(events_url).status_code, status.HTTP_404_NOT_FOUND)

        # Bob attempts to post event to Alice's incident -> 404
        self.assertEqual(
            client_bob.post(
                reverse('event-list-create'),
                {'incident_id': 'INC-ALICE-SECURE', 'event_type': 'click', 'selector': '#btn'},
                format='json'
            ).status_code,
            status.HTTP_404_NOT_FOUND
        )

        # Bob attempts to batch sync to Alice's incident -> 404
        self.assertEqual(
            client_bob.post(
                reverse('event-batch-sync'),
                {'incident_id': 'INC-ALICE-SECURE', 'events': []},
                format='json'
            ).status_code,
            status.HTTP_404_NOT_FOUND
        )

        # Bob attempts to clear Alice's events -> 404
        clear_url = f"{reverse('event-clear')}?incident=INC-ALICE-SECURE"
        self.assertEqual(client_bob.delete(clear_url).status_code, status.HTTP_404_NOT_FOUND)

        # Bob attempts to generate test for Alice's incident -> 404
        self.assertEqual(
            client_bob.post(
                reverse('test-generate'),
                {'incident_id': 'INC-ALICE-SECURE', 'events': []},
                format='json'
            ).status_code,
            status.HTTP_404_NOT_FOUND
        )

        # Bob attempts to run Playwright test on Alice's incident -> 404
        self.assertEqual(
            client_bob.post(
                reverse('test-run'),
                {'incident_id': 'INC-ALICE-SECURE', 'buildMode': 'fixed'},
                format='json'
            ).status_code,
            status.HTTP_404_NOT_FOUND
        )

        # Bob attempts to view reports for Alice's incident -> 404
        rep_url = f"{reverse('test-reports-list')}?incident=INC-ALICE-SECURE"
        self.assertEqual(client_bob.get(rep_url).status_code, status.HTTP_404_NOT_FOUND)

        # Bob attempts to export Alice's incident report -> 404
        export_url = reverse('test-export-report', kwargs={'incident_id': 'INC-ALICE-SECURE'})
        self.assertEqual(client_bob.get(export_url).status_code, status.HTTP_404_NOT_FOUND)

    def test_fault_injection_and_edge_cases(self):
        """
        Scenario 3: Fault Injection, Edge Cases & Error Handling
        - Empty inputs
        - Malicious injection payloads
        - Malformed requests
        - Invalid/expired tokens
        - Logout token invalidation
        - Argument validation
        - Subprocess environment secret stripping
        """
        user = User.objects.create_user(
            username='tester',
            email='tester@reprox.dev',
            password='TestPassword123!'
        )
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

        # 1. Empty input handling in voice intent parser
        empty_res = self.client.post(reverse('voice-parse-intent'), {'transcript': ''}, format='json')
        self.assertEqual(empty_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', empty_res.json())

        # 2. Malformed / missing required fields on incident creation
        bad_inc = self.client.post(reverse('incident-list-create'), {}, format='json')
        self.assertEqual(bad_inc.status_code, status.HTTP_400_BAD_REQUEST)

        # 3. Invalid buildMode command injection attempts
        inc = Incident.objects.create(owner=user, incident_id='INC-SEC-1', title='Security Incident')
        injection_modes = [
            '../../bin/sh',
            'fixed; rm -rf /',
            '`reboot`',
            '$(whoami)',
            'unknown_flag',
            ''
        ]
        for mode in injection_modes:
            res = self.client.post(
                reverse('test-run'),
                {'incident_id': 'INC-SEC-1', 'buildMode': mode},
                format='json'
            )
            self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn('Invalid buildMode', res.json()['error'])

        # 4. Expired or forged token rejection
        forged_client = APIClient()
        forged_client.credentials(HTTP_AUTHORIZATION='Token invalid_fake_token_key_12345')
        unauth_res = forged_client.get(reverse('incident-list-create'))
        self.assertEqual(unauth_res.status_code, status.HTTP_401_UNAUTHORIZED)

        # 5. Logout properly invalidates token
        logout_res = self.client.post(reverse('auth-logout'))
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)
        # Token must be deleted from DB
        self.assertFalse(Token.objects.filter(key=token.key).exists())
        # Subsequent request with old token is rejected
        subsequent = self.client.get(reverse('auth-me'))
        self.assertEqual(subsequent.status_code, status.HTTP_401_UNAUTHORIZED)

        # 6. Verify environment secret stripping
        os.environ['DJANGO_SECRET_KEY'] = 'insecure-test-secret-key'
        os.environ['DATABASE_URL'] = 'postgres://prod_user:secret_pass@db:5432/reprox'
        os.environ['WISPR_FLOW_API_KEY'] = 'wispr_prod_api_key'
        clean_env = get_sanitized_subprocess_env()
        self.assertNotIn('DJANGO_SECRET_KEY', clean_env)
        self.assertNotIn('DATABASE_URL', clean_env)
        self.assertNotIn('WISPR_FLOW_API_KEY', clean_env)
        self.assertIn('PATH', clean_env)
        self.assertEqual(clean_env['NODE_ENV'], 'test')
