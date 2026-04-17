from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from notifications.models import SystemLog
from .models import SecuritySettings


User = get_user_model()


class SecuritySettingsApiTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="adminuser",
            email="admin@example.com",
            password="AdminPass123!",
            role="admin",
        )
        self.client.force_authenticate(self.admin)

    def test_admin_can_update_security_settings(self):
        response = self.client.put(
            "/api/accounts/admin/security-settings/",
            {
                "password_min_length": 10,
                "password_require_uppercase": True,
                "password_require_lowercase": True,
                "password_require_numbers": True,
                "password_require_special": True,
                "password_expiry_days": 30,
                "max_login_attempts": 3,
                "lockout_duration": 20,
                "ip_whitelist": ["127.0.0.1"],
                "ip_blacklist": ["10.10.10.10"],
                "alert_on_failed_login": True,
                "alert_on_suspicious_activity": True,
                "alert_on_password_change": True,
                "alert_email": "security@example.com",
                "audit_enabled": True,
                "audit_retention_days": 90,
                "log_sensitive_actions": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        settings_obj = SecuritySettings.get_solo()
        self.assertEqual(settings_obj.password_min_length, 10)
        self.assertEqual(settings_obj.max_login_attempts, 3)
        self.assertEqual(settings_obj.ip_whitelist, ["127.0.0.1"])
        self.assertTrue(
            SystemLog.objects.filter(title="Security Settings Updated").exists()
        )


class PasswordPolicyTests(APITestCase):
    def setUp(self):
        settings_obj = SecuritySettings.get_solo()
        settings_obj.password_min_length = 8
        settings_obj.password_require_uppercase = True
        settings_obj.password_require_lowercase = True
        settings_obj.password_require_numbers = True
        settings_obj.password_require_special = True
        settings_obj.save()

    def test_register_respects_password_policy(self):
        response = self.client.post(
            "/api/accounts/register/",
            {
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "weakpass",
                "role": "bachelor",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)


class LoginSecurityTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="lockeduser",
            email="locked@example.com",
            password="StrongPass123!",
            role="bachelor",
        )
        settings_obj = SecuritySettings.get_solo()
        settings_obj.max_login_attempts = 2
        settings_obj.lockout_duration = 10
        settings_obj.audit_enabled = True
        settings_obj.alert_on_failed_login = False
        settings_obj.alert_on_suspicious_activity = False
        settings_obj.save()

    def test_failed_login_attempts_lock_the_account(self):
        payload = {
            "username_or_email": "lockeduser",
            "password": "WrongPass123!",
        }

        first = self.client.post("/api/token/", payload, format="json")
        second = self.client.post("/api/token/", payload, format="json")
        third = self.client.post("/api/token/", payload, format="json")

        self.assertEqual(first.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(third.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 2)
        self.assertIsNotNone(self.user.locked_until)
        self.assertIn("temporarily locked", str(third.data).lower())
        self.assertTrue(SystemLog.objects.filter(title="Account Locked").exists())
