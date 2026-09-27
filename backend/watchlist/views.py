from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Watchlist
from .serializers import WatchlistSerializer


class WatchlistView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WatchlistSerializer

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user).select_related('movie')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WatchlistMovieDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, movie_id):
        entry = get_object_or_404(Watchlist, user=request.user, movie_id=movie_id)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
