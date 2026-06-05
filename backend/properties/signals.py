from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import PropertyImage


@receiver(pre_save, sender=PropertyImage)
def delete_replaced_property_image(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_image = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist:
        return

    if old_image and old_image != instance.image:
        old_image.delete(save=False)


@receiver(post_delete, sender=PropertyImage)
def delete_property_image_on_delete(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(save=False)
