from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    delivered = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
        indexes = [
            models.Index(fields=['sender', 'receiver', 'timestamp'], name='message_sender_receiver_idx'),
            models.Index(fields=['receiver', 'sender', 'timestamp'], name='message_receiver_sender_idx'),
            models.Index(fields=['receiver', 'is_read'], name='message_receiver_read_idx'),
            models.Index(fields=['receiver', 'delivered'], name='message_receiver_delivered_idx'),
        ]

    def __str__(self):
        return f"{self.sender} -> {self.receiver}"
