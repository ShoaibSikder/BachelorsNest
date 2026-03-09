import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.other_user_id = self.scope['url_route']['kwargs']['user_id']
        user1 = int(self.scope['user'].id)
        user2 = int(self.other_user_id)

        # 🔥 Create consistent room name
        self.room_group_name = f"chat_{min(user1, user2)}_{max(user1, user2)}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await Message.objects.filter(
            sender_id=self.other_user_id,
            receiver=self.scope['user'],
            is_read=False
        ).aupdate(is_read=True)
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        sender = self.scope['user']
        receiver = await User.objects.aget(id=self.other_user_id)

        await Message.objects.acreate(
            sender=sender,
            receiver=receiver,
            content=message
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender.id
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))