import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import Message
from notifications.models import Notification

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.other_user_id = self.scope['url_route']['kwargs']['user_id']
        self.user = self.scope['user']

        if not self.user.is_authenticated:
            await self.close()
            return

        user1 = int(self.user.id)
        user2 = int(self.other_user_id)

        self.room_group_name = f"chat_{min(user1,user2)}_{max(user1,user2)}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # ✅ Mark delivered
        await Message.objects.filter(
            sender_id=self.other_user_id,
            receiver=self.user,
            delivered=False
        ).aupdate(delivered=True)

        # ✅ Notify online
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "user_status",
                "status": "online",
                "user_id": self.user.id
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

        # ✅ Notify offline
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "user_status",
                "status": "offline",
                "user_id": self.user.id
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        # ✅ Typing indicator
        if data.get("typing") is not None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_event",
                    "user_id": self.user.id,
                    "typing": data["typing"]
                }
            )
            return

        message = data.get("message")
        if not message:
            return

        receiver = await User.objects.aget(id=self.other_user_id)

        # ✅ Save message
        msg = await Message.objects.acreate(
            sender=self.user,
            receiver=receiver,
            content=message,
            delivered=True
        )

        # ✅ Save notification in DB
        await Notification.objects.acreate(
            user=receiver,
            message=f"{self.user.username} sent you a message"
        )

        # ✅ SEND REAL-TIME NOTIFICATION (IMPORTANT 🔥)
        await self.channel_layer.group_send(
            f"notifications_{receiver.id}",
            {
                "type": "send_notification",
                "message": f"{self.user.username} sent you a message"
            }
        )

        msg_data = {
            "id": msg.id,
            "sender": self.user.id,
            "receiver": receiver.id,
            "content": msg.content,
            "timestamp": msg.timestamp.isoformat(),
            "is_read": msg.is_read,
            "delivered": msg.delivered,
        }

        # ✅ Send chat message
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": msg_data
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    async def typing_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "typing",
            "user_id": event["user_id"],
            "typing": event["typing"]
        }))

    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            "type": "status",
            "user_id": event["user_id"],
            "status": event["status"]
        }))