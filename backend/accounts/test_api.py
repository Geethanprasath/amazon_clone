from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationApiTests(APITestCase):
    def test_register_login_profile_and_logout(self):
        registration = self.client.post(
            '/api/auth/register/',
            {
                'username': 'streamer',
                'email': 'streamer@example.test',
                'password': 'LongSafe!sample-pass-2026',
            },
            format='json',
        )
        self.assertEqual(registration.status_code, status.HTTP_201_CREATED)

        login = self.client.post(
            '/api/auth/login/',
            {'username': 'streamer', 'password': 'LongSafe!sample-pass-2026'},
            format='json',
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        access_token = login.data['access']
        refresh_token = login.data['refresh']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        profile = self.client.get('/api/auth/profile/')
        self.assertEqual(profile.status_code, status.HTTP_200_OK)
        self.assertEqual(profile.data['watchlist_count'], 0)

        logout = self.client.post(
            '/api/auth/logout/', {'refresh': refresh_token}, format='json'
        )
        self.assertEqual(logout.status_code, status.HTTP_205_RESET_CONTENT)

        refresh = self.client.post(
            '/api/auth/token/refresh/', {'refresh': refresh_token}, format='json'
        )
        self.assertEqual(refresh.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_requires_authentication(self):
        response = self.client.get('/api/auth/profile/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)