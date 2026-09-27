from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from movies.models import Movie


class WatchlistApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='watcher',
            email='watcher@example.test',
            password='LongSafe!watcher-pass-2026',
        )
        self.movie = Movie.objects.create(
            title='Quiet Orbit',
            description='A fictional science-fiction story.',
            genre='Sci-Fi',
            release_year=2026,
            duration=105,
            rating='8.1',
        )

    def test_watchlist_requires_authentication(self):
        response = self.client.get('/api/watchlist/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_list_and_remove_movie(self):
        self.client.force_authenticate(user=self.user)

        added = self.client.post(
            '/api/watchlist/', {'movie': self.movie.id}, format='json'
        )
        self.assertEqual(added.status_code, status.HTTP_201_CREATED)
        self.assertEqual(added.data['movie_details']['title'], self.movie.title)

        duplicate = self.client.post(
            '/api/watchlist/', {'movie': self.movie.id}, format='json'
        )
        self.assertEqual(duplicate.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.user.watchlist_entries.count(), 1)

        listing = self.client.get('/api/watchlist/')
        self.assertEqual(listing.status_code, status.HTTP_200_OK)
        self.assertEqual(len(listing.data), 1)

        removed = self.client.delete(f'/api/watchlist/{self.movie.id}/')
        self.assertEqual(removed.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.user.watchlist_entries.count(), 0)