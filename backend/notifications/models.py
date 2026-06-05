
# Create your models here.
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at'], name='notification_user_created_idx'),
            models.Index(fields=['user', 'is_read', '-created_at'], name='notification_user_read_idx'),
        ]

    def __str__(self):
        return f"Notification for {self.user.email}"


class SystemLog(models.Model):
    LOG_LEVELS = (
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('critical', 'Critical'),
    )

    level = models.CharField(max_length=20, choices=LOG_LEVELS, default='info')
    title = models.CharField(max_length=255)
    message = models.TextField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='system_logs')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp'], name='systemlog_timestamp_idx'),
            models.Index(fields=['level', '-timestamp'], name='systemlog_level_time_idx'),
            models.Index(fields=['user', '-timestamp'], name='systemlog_user_time_idx'),
        ]

    def __str__(self):
        return f"[{self.level.upper()}] {self.title} at {self.timestamp}"
