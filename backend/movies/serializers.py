from rest_framework import serializers

from .models import Category, Movie


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'description')


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = (
            'id',
            'title',
            'description',
            'poster',
            'backdrop',
            'video_url',
            'genre',
            'categories',
            'release_year',
            'duration',
            'rating',
            'language',
            'cast',
            'director',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')