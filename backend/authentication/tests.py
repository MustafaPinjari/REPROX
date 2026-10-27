from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token

class AuthenticationApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.me_url = reverse('auth-me')
        self.logout_url = reverse('auth-logout')
        self.recover_url = reverse('auth-recover')

        self.user = User.objects.create_user(
            username='mustafa',
            email='mustafa@example.com',
            password='reprox-secure-password-2026',
            first_name='Mustafa',
            last_name='Pinjari'
        )
        self.token, _ = Token.objects.get_or_create(user=self.user)

    def test_registration_with_password_hashing(self):
        payload = {
            'email': 'developer@reprox.dev',
            'username': 'devuser',
            'password': 'SuperStrongPassword123!',
            'first_name': 'Dev',
            'last_name': 'Tester'
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertIn('token', data)
        self.assertEqual(data['user']['email'], 'developer@reprox.dev')

        # Verify password is cryptographically hashed (PBKDF2 SHA256)
        created_user = User.objects.get(email='developer@reprox.dev')
        self.assertTrue(created_user.password.startswith('pbkdf2_sha256$'))
        self.assertNotEqual(created_user.password, 'SuperStrongPassword123!')
        self.assertTrue(created_user.check_password('SuperStrongPassword123!'))

    def test_registration_rejects_duplicate_email(self):
        payload = {
            'email': 'mustafa@example.com',
            'username': 'mustafa_new',
            'password': 'SuperStrongPassword123!'
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.json())

    def test_registration_rejects_short_password(self):
        payload = {
            'email': 'shortpass@example.com',
            'username': 'shortpass',
            'password': '123'
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success_returns_real_token(self):
        payload = {
            'email': 'mustafa@example.com',
            'password': 'reprox-secure-password-2026'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['token'], self.token.key)
        self.assertEqual(data['user']['username'], 'mustafa')

    def test_login_failure_with_wrong_password(self):
        payload = {
            'email': 'mustafa@example.com',
            'password': 'wrong-password'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verify no rogue user or token was created
        self.assertEqual(User.objects.count(), 1)

    def test_login_failure_with_nonexistent_user(self):
        payload = {
            'email': 'nonexistent@example.com',
            'password': 'reprox-secure-password-2026'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verify user was NOT auto-created
        self.assertFalse(User.objects.filter(email='nonexistent@example.com').exists())

    def test_me_endpoint_requires_authentication(self):
        # Anonymous request
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_endpoint_with_valid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['username'], 'mustafa')
        self.assertEqual(response.json()['email'], 'mustafa@example.com')

    def test_logout_invalidates_token(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Token should be deleted from DB
        self.assertFalse(Token.objects.filter(key=self.token.key).exists())
        # Subsequent request with old token is rejected
        subsequent = self.client.get(self.me_url)
        self.assertEqual(subsequent.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_password_recovery_dispatches_token(self):
        response = self.client.post(self.recover_url, {'email': 'mustafa@example.com'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('recoveryToken', response.json())
        self.assertTrue(len(response.json()['recoveryToken']) > 16)
