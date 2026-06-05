import shutil
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand

from accounts.models import User, profile_image_upload_to
from properties.models import PropertyImage, property_image_upload_to


class Command(BaseCommand):
    help = "Upload existing backend/media files to Supabase and update DB paths."

    def add_arguments(self, parser):
        parser.add_argument(
            "--delete-local",
            action="store_true",
            help="Delete backend/media after all referenced files upload successfully.",
        )

    def handle(self, *args, **options):
        media_root = Path(settings.BASE_DIR) / "media"
        if not media_root.exists():
            self.stdout.write(self.style.WARNING("No local media folder found."))
            return

        uploaded = 0
        missing = []

        for user in User.objects.exclude(profile_image=""):
            if not user.profile_image:
                continue

            old_name = user.profile_image.name
            old_path = media_root / old_name
            if not old_path.exists():
                missing.append(old_name)
                continue

            new_name = profile_image_upload_to(user, old_path.name)
            with old_path.open("rb") as source:
                user.profile_image.save(old_path.name, File(source), save=True)
            uploaded += 1
            self.stdout.write(f"Uploaded profile image: {old_name} -> {new_name}")

        for image in PropertyImage.objects.select_related("property__owner"):
            if not image.image:
                continue

            old_name = image.image.name
            old_path = media_root / old_name
            if not old_path.exists():
                missing.append(old_name)
                continue

            new_name = property_image_upload_to(image, old_path.name)
            with old_path.open("rb") as source:
                image.image.save(old_path.name, File(source), save=True)
            uploaded += 1
            self.stdout.write(f"Uploaded property image: {old_name} -> {new_name}")

        if missing:
            self.stdout.write(self.style.WARNING("Missing local files:"))
            for name in missing:
                self.stdout.write(f"  - {name}")

        if options["delete_local"] and not missing:
            shutil.rmtree(media_root)
            self.stdout.write(self.style.SUCCESS(f"Deleted local media folder: {media_root}"))
        elif options["delete_local"]:
            self.stdout.write(
                self.style.WARNING("Local media folder was not deleted because some files were missing.")
            )

        self.stdout.write(self.style.SUCCESS(f"Uploaded {uploaded} referenced media file(s)."))
