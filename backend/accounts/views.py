from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegistrationSerializer, UserProfileSerializer


class RegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegistrationSerializer


class ProfileView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not isinstance(refresh_token, str) or not refresh_token:
            return Response(
                {'detail': 'A refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
        except TokenError:
            return Response(
                {'detail': 'The refresh token is invalid or expired.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if str(token.payload.get('user_id')) != str(request.user.pk):
            return Response(
                {'detail': 'The refresh token does not belong to this user.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
