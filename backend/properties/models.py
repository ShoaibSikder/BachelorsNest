from django.db import models
from accounts.models import User


class Property(models.Model):
    PROPERTY_TYPE = (
        ('flat', 'Flat'),
        ('seat', 'Seat'),
    )

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    title = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    rent = models.DecimalField(max_digits=10, decimal_places=2)
    property_type = models.CharField(max_length=10, choices=PROPERTY_TYPE)
    description = models.TextField()
    available_from = models.DateField(blank=True, null=True)
    is_available = models.BooleanField(default=True)
    total_seats = models.PositiveIntegerField(default=1)
    occupied_seats = models.PositiveIntegerField(default=0)
    is_approved = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def vacancy_count(self):
        return max(self.total_seats - self.occupied_seats, 0)

    def save(self, *args, **kwargs):
        if self.property_type == 'flat':
            self.total_seats = 1
            self.occupied_seats = 1 if self.occupied_seats else 0
        else:
            self.total_seats = max(self.total_seats or 1, 1)
            self.occupied_seats = min(self.occupied_seats or 0, self.total_seats)
        if self.vacancy_count == 0:
            self.is_available = False
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='property_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.property.title}"


class Wishlist(models.Model):
    bachelor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='wishlists'
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='wishlists'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['bachelor', 'property'],
                name='unique_bachelor_property_wishlist'
            )
        ]

    def __str__(self):
        return f"{self.bachelor.username} saved {self.property.title}"
