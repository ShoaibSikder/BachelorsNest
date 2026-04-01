from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('bachelor', 'Bachelor'),
        ('owner', 'Owner'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_banned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"


class UserLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="logs")
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action}"