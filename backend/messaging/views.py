from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rentals.models import RentRequest
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from django.db.models import OuterRef, Q, Subquery

User = get_user_model()

class ChatUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Users you can chat with (accepted rent requests)
        bachelors = RentRequest.objects.filter(owner=request.user, status="accepted").values_list('bachelor', flat=True)
        owners = RentRequest.objects.filter(bachelor=request.user, status="accepted").values_list('owner', flat=True)

        user_ids = list(set(list(bachelors) + list(owners)))
        latest_messages = Message.objects.filter(
            Q(sender=request.user, receiver_id=OuterRef('pk')) |
            Q(sender_id=OuterRef('pk'), receiver=request.user)
        ).order_by('-timestamp')

        users = User.objects.filter(id__in=user_ids).annotate(
            last_message=Subquery(latest_messages.values('content')[:1]),
            last_timestamp=Subquery(latest_messages.values('timestamp')[:1]),
        )

        payload = []
        for user in users:
            profile_image = (
                request.build_absolute_uri(user.profile_image.url)
                if user.profile_image
                else None
            )
            payload.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone_number": user.phone_number,
                "bio": user.bio,
                "address": user.address,
                "profile_image": profile_image,
                "last_message": user.last_message,
                "last_timestamp": user.last_timestamp,
            })

        return Response(payload)

class SendMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        receiver = serializer.validated_data['receiver']

        exists = RentRequest.objects.filter(
            bachelor=self.request.user,
            owner=receiver,
            status="accepted"
        ).exists() or RentRequest.objects.filter(
            bachelor=receiver,
            owner=self.request.user,
            status="accepted"
        ).exists()

        if not exists:
            raise PermissionDenied("You can only chat after sending a rent request.")

        serializer.save(sender=self.request.user)


class ConversationView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        other_user_id = self.kwargs['user_id']
        return Message.objects.filter(
            Q(sender=self.request.user, receiver_id=other_user_id) |
            Q(sender_id=other_user_id, receiver=self.request.user)
        ).order_by('timestamp')


class UnreadMessageCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Message.objects.filter(
            receiver=request.user,
            is_read=False
        ).count()

        return Response({"unread_count": count})
