from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import UserLog, User, PasswordResetToken, SecuritySettings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Q
from notifications.models import SystemLog

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

    def validate_password(self, value):
        validate_password_against_policy(value)
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email'),
            role=validated_data['role'],
            password_changed_at=timezone.now(),
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
        validate_password_against_policy(password)
        user = super().create(validated_data)
        user.set_password(password)
        user.password_changed_at = timezone.now()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            validate_password_against_policy(password)
            user.set_password(password)
            user.password_changed_at = timezone.now()
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

        settings = SecuritySettings.get_solo()
        request = self.context.get("request")
        client_ip = get_client_ip(request)

        if settings.ip_blacklist and client_ip in settings.ip_blacklist:
            log_security_event(
                level="warning",
                title="Blocked Login Attempt",
                message=f"Blocked login from blacklisted IP {client_ip}",
                user=None,
                alert_enabled=settings.alert_on_suspicious_activity,
            )
            raise serializers.ValidationError("Login from this IP address is blocked.")

        if settings.ip_whitelist and client_ip not in settings.ip_whitelist:
            log_security_event(
                level="warning",
                title="Non-whitelisted Login Attempt",
                message=f"Blocked login from non-whitelisted IP {client_ip}",
                user=None,
                alert_enabled=settings.alert_on_suspicious_activity,
            )
            raise serializers.ValidationError("Login from this IP address is not allowed.")

        # Find user by username or email
        user = User.objects.filter(
            Q(username=username_or_email) | Q(email=username_or_email)
        ).first()

        if not user:
            log_security_event(
                level="warning",
                title="Failed Login Attempt",
                message=f"Unknown user login attempt from IP {client_ip} using {username_or_email}",
                user=None,
                alert_enabled=settings.alert_on_failed_login,
            )
            raise serializers.ValidationError("Invalid email/username or password.")

        if user.locked_until and user.locked_until > timezone.now():
            raise serializers.ValidationError("Account is temporarily locked. Please try again later.")

        # Verify password
        if not user.check_password(password):
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.max_login_attempts:
                user.locked_until = timezone.now() + timedelta(minutes=settings.lockout_duration)
                log_security_event(
                    level="critical",
                    title="Account Locked",
                    message=f"User {user.username} was locked after repeated failed logins from IP {client_ip}",
                    user=user,
                    alert_enabled=settings.alert_on_suspicious_activity,
                )
            else:
                log_security_event(
                    level="warning",
                    title="Failed Login Attempt",
                    message=f"Failed login for {user.username} from IP {client_ip}",
                    user=user,
                    alert_enabled=settings.alert_on_failed_login,
                )
            user.save(update_fields=["failed_login_attempts", "locked_until"])
            raise serializers.ValidationError("Invalid email/username or password.")

        # Check if user is active
        if not user.is_active:
            raise serializers.ValidationError("User account is inactive.")

        # Check if user is banned
        if hasattr(user, 'is_banned') and user.is_banned:
            raise serializers.ValidationError("User account is banned.")

        if settings.password_expiry_days:
            if user.password_changed_at and user.password_changed_at < timezone.now() - timedelta(days=settings.password_expiry_days):
                raise serializers.ValidationError("Password has expired. Please reset your password.")

        user.failed_login_attempts = 0
        user.locked_until = None
        user.save(update_fields=["failed_login_attempts", "locked_until"])

        if settings.audit_enabled:
            SystemLog.objects.create(
                level="info",
                title="Admin Login" if user.role == "admin" else "User Login",
                message=f"{user.username} logged in successfully",
                user=user,
            )

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

    def validate_new_password(self, value):
        validate_password_against_policy(value)
        return value


class SecuritySettingsSerializer(serializers.ModelSerializer):
    recent_audit_events = serializers.SerializerMethodField()

    class Meta:
        model = SecuritySettings
        fields = [
            "password_min_length",
            "password_require_uppercase",
            "password_require_lowercase",
            "password_require_numbers",
            "password_require_special",
            "password_expiry_days",
            "max_login_attempts",
            "lockout_duration",
            "ip_whitelist",
            "ip_blacklist",
            "alert_on_failed_login",
            "alert_on_suspicious_activity",
            "alert_on_password_change",
            "alert_email",
            "audit_enabled",
            "audit_retention_days",
            "log_sensitive_actions",
            "recent_audit_events",
        ]

    def get_recent_audit_events(self, obj):
        events = SystemLog.objects.all()[:5]
        return [
            {
                "id": event.id,
                "title": event.title,
                "message": event.message,
                "level": event.level,
                "timestamp": event.timestamp,
            }
            for event in events
        ]


def validate_password_against_policy(password):
    settings = SecuritySettings.get_solo()
    errors = []

    if len(password) < settings.password_min_length:
        errors.append(f"Password must be at least {settings.password_min_length} characters long.")
    if settings.password_require_uppercase and not any(char.isupper() for char in password):
        errors.append("Password must include at least one uppercase letter.")
    if settings.password_require_lowercase and not any(char.islower() for char in password):
        errors.append("Password must include at least one lowercase letter.")
    if settings.password_require_numbers and not any(char.isdigit() for char in password):
        errors.append("Password must include at least one number.")
    if settings.password_require_special and password.isalnum():
        errors.append("Password must include at least one special character.")

    if errors:
        raise serializers.ValidationError(errors)

    return password


def get_client_ip(request):
    if not request:
        return "unknown"
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "unknown")


def log_security_event(level, title, message, user=None, alert_enabled=False):
    settings = SecuritySettings.get_solo()
    event = None

    if settings.audit_enabled:
        event = SystemLog.objects.create(
            level=level,
            title=title,
            message=message,
            user=user,
        )

    if alert_enabled:
        if settings.alert_email:
            from django.core.mail import send_mail
            from django.conf import settings as django_settings

            send_mail(
                subject=f"[BachelorsNest Security] {title}",
                message=message,
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.alert_email],
                fail_silently=True,
            )
    return event
