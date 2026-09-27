from django.conf import settings
from django.db import models
from movies.models import Movie


class Watchlist(models.Model):
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='watchlist_entries',
	)
	movie = models.ForeignKey(
		Movie,
		on_delete=models.CASCADE,
		related_name='watchlist_entries',
	)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']
		constraints = [
			models.UniqueConstraint(fields=['user', 'movie'], name='unique_user_movie_watchlist'),
		]

	def __str__(self):
		return f'{self.user.username}: {self.movie.title}'
