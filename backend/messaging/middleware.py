from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.db import close_old_connections
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
import jwt
from django.conf import settings

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token):
    try:
        # Validate token
        UntypedToken(token)
        # Decode to get user_id
        decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = decoded_data.get("user_id")
        return User.objects.get(id=user_id)
    except (InvalidToken, TokenError, User.DoesNotExist, jwt.DecodeError):
        return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):
    """
    Custom JWT authentication middleware for WebSockets.
    """

    async def __call__(self, scope, receive, send):
        close_old_connections()
        query_string = scope.get("query_string", b"").decode()
        token = parse_qs(query_string).get("token", [None])[0]
        scope["user"] = await get_user_from_token(token) if token else AnonymousUser()
        return await super().__call__(scope, receive, send)