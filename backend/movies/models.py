from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Category(models.Model):
	name = models.CharField(max_length=100, unique=True)
	description = models.TextField(blank=True)

	class Meta:
		ordering = ['name']

	def __str__(self):
		return self.name


class Movie(models.Model):
	title = models.CharField(max_length=255, db_index=True)
	description = models.TextField()
	poster = models.URLField(max_length=500, blank=True)
	backdrop = models.URLField(max_length=500, blank=True)
	video_url = models.URLField(max_length=500, blank=True)
	genre = models.CharField(max_length=100, db_index=True)
	categories = models.ManyToManyField(Category, related_name='movies', blank=True)
	release_year = models.PositiveSmallIntegerField()
	duration = models.PositiveSmallIntegerField(help_text='Duration in minutes')
	rating = models.DecimalField(
		max_digits=3,
		decimal_places=1,
		validators=[MinValueValidator(0), MaxValueValidator(10)],
	)
	language = models.CharField(max_length=80, default='English')
	cast = models.JSONField(default=list, blank=True)
	director = models.CharField(max_length=255, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at', 'title']

	def __str__(self):
		return self.title
