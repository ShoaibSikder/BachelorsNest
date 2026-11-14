import logging

from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import User

logger = logging.getLogger(__name__)

@receiver(post_delete, sender=User)
def delete_profile_image_on_user_delete(sender, instance, **kwargs):
    if instance.profile_image:
        try:
            instance.profile_image.delete(save=False)
        except Exception:
            logger.exception("Failed to delete profile image for deleted user %s", instance.pk)
