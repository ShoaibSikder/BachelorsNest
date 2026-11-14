import logging

from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import PropertyImage

logger = logging.getLogger(__name__)

@receiver(post_delete, sender=PropertyImage)
def delete_property_image_on_delete(sender, instance, **kwargs):
    if instance.image:
        try:
            instance.image.delete(save=False)
        except Exception:
            logger.exception("Failed to delete property image %s", instance.pk)
