from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .models import Category, Movie
from .serializers import CategorySerializer, MovieSerializer


class MovieViewSet(ModelViewSet):
    serializer_class = MovieSerializer

    def get_queryset(self):
        return Movie.objects.prefetch_related('categories').all()

    def get_permissions(self):
        if self.action in ('list', 'retrieve', 'search'):
            return [AllowAny()]
        return [IsAdminUser()]

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '').strip()
        genre = request.query_params.get('genre', '').strip()
        movies = self.get_queryset()

        if query:
            movies = movies.filter(
                Q(title__icontains=query)
                | Q(description__icontains=query)
                | Q(genre__icontains=query)
                | Q(categories__name__icontains=query)
            )
        if genre:
            movies = movies.filter(
                Q(genre__iexact=genre) | Q(categories__name__iexact=genre)
            )
        if not query and not genre:
            movies = movies.none()

        serializer = self.get_serializer(movies.distinct(), many=True)
        return Response(serializer.data)


class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['get'])
    def movies(self, request, pk=None):
        category = self.get_object()
        movies = category.movies.prefetch_related('categories').all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)
