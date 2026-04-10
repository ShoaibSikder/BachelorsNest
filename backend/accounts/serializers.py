from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserLog, User, PasswordResetToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email'),
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'profile_image']
        read_only_fields = ['role']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'is_staff', 'is_banned', 'is_active', 'date_joined', 'profile_image']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({'password': 'Password is required when creating a user.'})
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class UserLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLog
        fields = ['id', 'action', 'timestamp']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer that allows login with either username or email
    """
    # Override parent's username field with our custom field
    username_or_email = serializers.CharField()
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove the parent's 'username' field and add our custom field
        self.fields.pop('username', None)
        self.fields['username_or_email'] = serializers.CharField()

    def validate(self, attrs):
        """
        Override parent validate to support username OR email login
        """
        username_or_email = attrs.get('username_or_email')
        password = attrs.get('password')

        if not username_or_email or not password:
            raise serializers.ValidationError("Both email/username and password are required.")

        # Find user by username or email
        user = User.objects.filter(
            Q(username=username_or_email) | Q(email=username_or_email)
        ).first()

        if not user:
            raise serializers.ValidationError("Invalid email/username or password.")

        # Verify password
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email/username or password.")

        # Check if user is active
        if not user.is_active:
            raise serializers.ValidationError("User account is inactive.")

        # Check if user is banned
        if hasattr(user, 'is_banned') and user.is_banned:
            raise serializers.ValidationError("User account is banned.")

        # Generate tokens directly
        try:
            refresh = self.get_token(user)
            
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'email': user.email,
                'role': user.role,
            }
        except Exception as e:
            raise serializers.ValidationError(f"Failed to generate tokens: {str(e)}")


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(min_length=8)