from django.conf import settings
from django.db import models
from django.db.models import Q

from properties.models import Property

User = settings.AUTH_USER_MODEL


class RentRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='rent_requests'
    )
    bachelor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_requests'
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_requests'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['bachelor', 'status', '-created_at'], name='rent_req_bachelor_status_idx'),
            models.Index(fields=['owner', 'status', '-created_at'], name='rent_req_owner_status_idx'),
            models.Index(fields=['property', 'status'], name='rent_req_property_status_idx'),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['bachelor', 'property'],
                condition=Q(status__in=['pending', 'accepted']),
                name='unique_active_rent_request',
            ),
        ]

    def __str__(self):
        return f"{self.bachelor} -> {self.property}"
