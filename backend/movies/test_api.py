from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Movie


class MovieApiTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name='Action')
        self.movie = Movie.objects.create(
            title='Shadow Protocol',
            description='A fictional action story.',
            genre='Action',
            release_year=2026,
            duration=118,
            rating='8.4',
        )
        self.movie.categories.add(self.category)

    def test_list_search_and_category_movies(self):
        listing = self.client.get('/api/movies/')
        self.assertEqual(listing.status_code, status.HTTP_200_OK)
        self.assertEqual(len(listing.data), 1)

        search = self.client.get('/api/movies/search/', {'q': 'shadow'})
        self.assertEqual(search.status_code, status.HTTP_200_OK)
        self.assertEqual(search.data[0]['id'], self.movie.id)

        category_movies = self.client.get(f'/api/categories/{self.category.id}/movies/')
        self.assertEqual(category_movies.status_code, status.HTTP_200_OK)
        self.assertEqual(category_movies.data[0]['id'], self.movie.id)

    def test_movie_writes_are_limited_to_staff(self):
        payload = {
            'title': 'New Fictional Feature',
            'description': 'A demo film.',
            'genre': 'Drama',
            'release_year': 2026,
            'duration': 100,
            'rating': '7.2',
            'categories': [],
        }
        denied = self.client.post('/api/movies/', payload, format='json')
        self.assertEqual(denied.status_code, status.HTTP_401_UNAUTHORIZED)

        admin = get_user_model().objects.create_superuser(
            username='catalog-admin',
            email='catalog-admin@example.test',
            password='LongSafe!admin-pass-2026',
        )
        self.client.force_authenticate(user=admin)
        created = self.client.post('/api/movies/', payload, format='json')
        self.assertEqual(created.status_code, status.HTTP_201_CREATED)
        movie_id = created.data['id']

        payload['title'] = 'Updated Fictional Feature'
        updated = self.client.put(f'/api/movies/{movie_id}/', payload, format='json')
        self.assertEqual(updated.status_code, status.HTTP_200_OK)

        deleted = self.client.delete(f'/api/movies/{movie_id}/')
        self.assertEqual(deleted.status_code, status.HTTP_204_NO_CONTENT)