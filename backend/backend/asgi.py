import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from messaging.middleware import TokenAuthMiddleware
from messaging.routing import websocket_urlpatterns as chat_ws
from notifications.routing import websocket_urlpatterns as notif_ws

# ✅ Merge routes inside URLRouter
websocket_routes = chat_ws + notif_ws

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddleware(
        URLRouter(websocket_routes)   # ✅ FIXED
    ),
})