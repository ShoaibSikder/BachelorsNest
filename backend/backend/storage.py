from io import BytesIO
import mimetypes

from django.conf import settings
from django.core.files.storage import Storage
from supabase import create_client


class SupabaseRootMediaStorage(Storage):
    """Store uploaded media at the root of the configured Supabase bucket."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.supabase_url = settings.SUPABASE_URL
        self.supabase_key = settings.SUPABASE_KEY
        self.bucket_name = settings.SUPABASE_MEDIA_BUCKET
        self.client = create_client(self.supabase_url, self.supabase_key)

    def _clean_name(self, name):
        return str(name).replace("\\", "/").lstrip("/")

    def _save(self, name, content):
        name = self._clean_name(name)
        content.seek(0)
        self.client.storage.from_(self.bucket_name).upload(
            path=name,
            file=content.read(),
            file_options={
                "content-type": (
                    getattr(content, "content_type", None)
                    or mimetypes.guess_type(name)[0]
                    or "application/octet-stream"
                ),
                "upsert": "true",
            },
        )
        return name

    def _open(self, name, mode="rb"):
        data = self.client.storage.from_(self.bucket_name).download(
            self._clean_name(name)
        )
        return BytesIO(data)

    def delete(self, name):
        if name:
            self.client.storage.from_(self.bucket_name).remove([self._clean_name(name)])

    def exists(self, name):
        return False

    def url(self, name):
        name = self._clean_name(name)
        return f"{self.supabase_url.rstrip('/')}/storage/v1/object/public/{self.bucket_name}/{name}"
