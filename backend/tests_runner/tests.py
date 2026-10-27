import os
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from incidents.models import Incident
from .models import ExecutionReport, GeneratedTest
from .views import synthesize_playwright_script, get_sanitized_subprocess_env

class TestRunnerSecurityAndExecutionTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='qa_lead',
            email='qalead@reprox.dev',
            password='Password123!'
        )
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        self.incident = Incident.objects.create(
            owner=self.user,
            incident_id='INC-TEST-RUNNER',
            title='Runner Verification Incident'
        )

        self.other_user = User.objects.create_user(
            username='other_dev',
            email='other@reprox.dev',
            password='Password123!'
        )
        self.other_token = Token.objects.create(user=self.other_user)
        self.other_client = APIClient()
        self.other_client.credentials(HTTP_AUTHORIZATION=f'Token {self.other_token.key}')

        self.health_url = reverse('api-health')
        self.generate_url = reverse('test-generate')
        self.run_url = reverse('test-run')
        self.reports_url = reverse('test-reports-list')

    def test_health_check_public_access(self):
        anon_client = APIClient()
        response = anon_client.get(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['service'], 'REPROX Backend Engine')

    def test_generate_playwright_test_with_json_escaping(self):
        # Malicious payload designed to break naive f-string string interpolation
        events = [
            {
                'type': 'fill',
                'selector': '#userInput"); alert("hacked"); //',
                'value': 'safe value with \'single\' and "double" quotes',
                'description': 'Input step'
            },
            {
                'type': 'assert',
                'selector': '[role="alert"]',
                'targetRole': 'alert',
                'value': 'Statutory GSTIN requirement'
            }
        ]
        response = self.client.post(
            self.generate_url,
            {'events': events, 'incident_id': 'INC-TEST-RUNNER'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        code = response.json()['code']
        # Verify quotes are properly escaped via json.dumps and cannot inject unescaped statements
        self.assertIn('#userInput\\"); alert(\\"hacked\\"); //', code)
        self.assertIn('expect(alertBanner).toBeVisible', code)

    def test_generate_rejects_unauthorized_incident(self):
        response = self.other_client.post(
            self.generate_url,
            {'events': [], 'incident_id': 'INC-TEST-RUNNER'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mode_validation_rejects_arbitrary_commands(self):
        # Attempt command injection or path traversal via mode parameter
        bad_modes = ['rm -rf /', '../../script.sh', 'fixed; node evil.js', 'unknown_mode', '']
        for bad_mode in bad_modes:
            response = self.client.post(
                self.run_url,
                {'buildMode': bad_mode, 'incident_id': 'INC-TEST-RUNNER'},
                format='json'
            )
            self.assertEqual(
                response.status_code,
                status.HTTP_400_BAD_REQUEST,
                f"Mode '{bad_mode}' should have been rejected with 400"
            )
            self.assertIn('Invalid buildMode', response.json()['error'])

    def test_run_rejects_unauthorized_incident(self):
        response = self.other_client.post(
            self.run_url,
            {'buildMode': 'fixed', 'incident_id': 'INC-TEST-RUNNER'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_subprocess_environment_sanitization_strips_secrets(self):
        # Set dummy sensitive environment variables
        os.environ['DJANGO_SECRET_KEY'] = 'super-secret-django-key'
        os.environ['WISPR_FLOW_API_KEY'] = 'wispr-live-bearer-token'
        os.environ['AWS_SECRET_ACCESS_KEY'] = 'AKIA_EXPOSED_KEY'
        os.environ['DATABASE_URL'] = 'postgres://user:password@db:5432/reprox'

        clean_env = get_sanitized_subprocess_env()

        # Assert all sensitive environment variables are stripped
        self.assertNotIn('DJANGO_SECRET_KEY', clean_env)
        self.assertNotIn('WISPR_FLOW_API_KEY', clean_env)
        self.assertNotIn('AWS_SECRET_ACCESS_KEY', clean_env)
        self.assertNotIn('DATABASE_URL', clean_env)
        # Verify necessary execution variables are preserved
        self.assertIn('PATH', clean_env)
        self.assertEqual(clean_env.get('NODE_ENV'), 'test')
        self.assertEqual(clean_env.get('PLAYWRIGHT_SUBPROCESS'), '1')

    def test_reports_list_isolation(self):
        ExecutionReport.objects.create(
            report_id='REP-USER-1',
            incident_id='INC-TEST-RUNNER',
            build_mode='fixed',
            status='passed',
            exit_code=0
        )
        ExecutionReport.objects.create(
            report_id='REP-OTHER-1',
            incident_id='INC-OTHER-99',
            build_mode='buggy',
            status='failed',
            exit_code=1
        )

        # Primary user should only see reports for their incidents
        res = self.client.get(self.reports_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        report_ids = [r['report_id'] for r in res.json()]
        self.assertIn('REP-USER-1', report_ids)
        self.assertNotIn('REP-OTHER-1', report_ids)

    def test_export_report_markdown_endpoint(self):
        ExecutionReport.objects.create(
            report_id='REP-EXPORT-1',
            incident_id='INC-TEST-RUNNER',
            build_mode='buggy',
            status='failed',
            exit_code=1,
            total_duration_ms=2100
        )
        export_url = reverse('test-export-report', kwargs={'incident_id': 'INC-TEST-RUNNER'})
        res = self.client.get(export_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        content = res.json()['content']
        self.assertIn('# REPROX Automated Incident Report', content)
        self.assertIn('REP-EXPORT-1', content)
