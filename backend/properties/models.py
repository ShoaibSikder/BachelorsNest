from django.db import models

# Create your models here.
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
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
