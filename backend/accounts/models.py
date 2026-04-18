from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    ROLE_CHOICES = (
        ('bachelor', 'Bachelor'),
        ('owner', 'Owner'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    address = models.CharField(max_length=255, blank=True, default="")
    is_banned = models.BooleanField(default=False)
    failed_login_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(blank=True, null=True)
    password_changed_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.username} ({self.role})"


class UserLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="logs")
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action}"


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=1)  # Token expires in 1 hour
        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.expires_at


class SecuritySettings(models.Model):
    password_min_length = models.PositiveSmallIntegerField(default=8)
    password_require_uppercase = models.BooleanField(default=True)
    password_require_lowercase = models.BooleanField(default=True)
    password_require_numbers = models.BooleanField(default=True)
    password_require_special = models.BooleanField(default=False)
    password_expiry_days = models.PositiveIntegerField(default=90)

    max_login_attempts = models.PositiveSmallIntegerField(default=5)
    lockout_duration = models.PositiveIntegerField(default=15)
    ip_whitelist = models.JSONField(default=list, blank=True)
    ip_blacklist = models.JSONField(default=list, blank=True)

    alert_on_failed_login = models.BooleanField(default=True)
    alert_on_suspicious_activity = models.BooleanField(default=True)
    alert_on_password_change = models.BooleanField(default=False)
    alert_email = models.EmailField(blank=True, default="")

    audit_enabled = models.BooleanField(default=True)
    audit_retention_days = models.PositiveIntegerField(default=365)
    log_sensitive_actions = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        defaults = {
            "pk": 1,
        }
        obj, _ = cls.objects.get_or_create(**defaults)
        return obj
