from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import User


@receiver(pre_save, sender=User)
def delete_replaced_profile_image(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_image = sender.objects.get(pk=instance.pk).profile_image
    except sender.DoesNotExist:
        return

    if old_image and old_image != instance.profile_image:
        old_image.delete(save=False)


@receiver(post_delete, sender=User)
def delete_profile_image_on_user_delete(sender, instance, **kwargs):
    if instance.profile_image:
        instance.profile_image.delete(save=False)
