from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        validators=[validate_password],
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    watchlist_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined', 'watchlist_count')
        read_only_fields = fields

    def get_watchlist_count(self, user):
        return user.watchlist_entries.count()