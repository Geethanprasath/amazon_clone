from rest_framework import serializers

from movies.serializers import MovieSerializer
from .models import Watchlist


class WatchlistSerializer(serializers.ModelSerializer):
    movie_details = MovieSerializer(source='movie', read_only=True)

    class Meta:
        model = Watchlist
        fields = ('id', 'movie', 'movie_details', 'created_at')
        read_only_fields = ('id', 'movie_details', 'created_at')

    def create(self, validated_data):
        entry, _ = Watchlist.objects.get_or_create(**validated_data)
        return entry