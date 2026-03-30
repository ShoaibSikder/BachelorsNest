import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import Message

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = None  # Initialize to avoid attribute errors
        self.other_user_id = self.scope['url_route']['kwargs']['user_id']
        self.user = self.scope['user']

        if not self.user.is_authenticated:
            await self.close()
            return

        user1 = int(self.user.id)
        user2 = int(self.other_user_id)

        # Consistent room name
        self.room_group_name = f"chat_{min(user1, user2)}_{max(user1, user2)}"

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Mark unread messages as read
        await Message.objects.filter(
            sender_id=self.other_user_id,
            receiver=self.user,
            is_read=False
        ).aupdate(is_read=True)

        await self.accept()

    async def disconnect(self, close_code):
        # Only leave group if room_group_name is set
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')

        if not message:
            return

        # Receiver instance
        receiver = await User.objects.aget(id=self.other_user_id)

        # Save message in DB
        msg = await Message.objects.acreate(
            sender=self.user,
            receiver=receiver,
            content=message
        )

        msg_data = {
            "id": msg.id,
            "sender": self.user.id,
            "receiver": receiver.id,
            "content": msg.content,
            "timestamp": msg.timestamp.isoformat(),
        }

        # Send message to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": msg_data
            }
        )

    async def chat_message(self, event):
        """
        Called when someone sends a message to the room group.
        """
        await self.send(text_data=json.dumps(event["message"]))