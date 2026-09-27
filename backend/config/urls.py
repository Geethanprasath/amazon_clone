"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import LogoutView, ProfileView, RegisterView
from movies.views import CategoryViewSet, MovieViewSet
from watchlist.views import WatchlistMovieDeleteView, WatchlistView

router = DefaultRouter()
router.register('movies', MovieViewSet, basename='movie')
router.register('categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/register/', RegisterView.as_view(), name='auth-register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('api/auth/profile/', ProfileView.as_view(), name='auth-profile'),
    path('api/watchlist/', WatchlistView.as_view(), name='watchlist-list'),
    path(
        'api/watchlist/<int:movie_id>/',
        WatchlistMovieDeleteView.as_view(),
        name='watchlist-delete',
    ),
    path('api/', include(router.urls)),
]
