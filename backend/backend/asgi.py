import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django
django.setup()  # 🔥 MUST come BEFORE importing any models or consumers

from channels.routing import ProtocolTypeRouter, URLRouter
from messaging.routing import websocket_urlpatterns
from messaging.middleware import TokenAuthMiddleware
from django.core.asgi import get_asgi_application

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddleware(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})