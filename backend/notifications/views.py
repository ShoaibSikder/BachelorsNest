from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Notification, SystemLog
from .serializers import NotificationSerializer, SystemLogSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model

User = get_user_model()


class UserNotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")


class MarkNotificationReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(is_read=True)


class BroadcastNotificationView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        message = request.data.get('message', '').strip()
        if not message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        users = User.objects.filter(is_active=True).exclude(is_staff=True)
        notifications = [Notification(user=user, message=message) for user in users]
        Notification.objects.bulk_create(notifications)

        SystemLog.objects.create(
            level='info',
            title='Broadcast Notification Sent',
            message=f'Broadcast to {len(notifications)} users',
            user=request.user
        )

        return Response(
            {'success': f'Broadcast sent to {len(notifications)} users'},
            status=status.HTTP_201_CREATED
        )


class RoleNotificationView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        role = request.data.get('role', '').strip()
        message = request.data.get('message', '').strip()

        if not role or not message:
            return Response(
                {'error': 'Role and message are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        users = User.objects.filter(role=role, is_active=True)
        notifications = [Notification(user=user, message=message) for user in users]
        Notification.objects.bulk_create(notifications)

        SystemLog.objects.create(
            level='info',
            title=f'Role Notification Sent ({role})',
            message=f'Notification sent to {len(notifications)} {role}s',
            user=request.user
        )

        return Response(
            {'success': f'Notification sent to {len(notifications)} {role}s'},
            status=status.HTTP_201_CREATED
        )


class IndividualMessageView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        user_id = request.data.get('user_id')
        message = request.data.get('message', '').strip()

        if not user_id or not message:
            return Response(
                {'error': 'User ID and message are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        notification = Notification.objects.create(user=user, message=message)

        SystemLog.objects.create(
            level='info',
            title='Individual Message Sent',
            message=f'Message sent to {user.username}',
            user=request.user
        )

        return Response(
            {'success': f'Message sent to {user.username}'},
            status=status.HTTP_201_CREATED
        )


class SystemLogListView(generics.ListAPIView):
    serializer_class = SystemLogSerializer
    permission_classes = [IsAdminUser]
    queryset = SystemLog.objects.all()
    ordering = ['-timestamp']
    filterset_fields = ['level']


class AdminUsersListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.filter(is_active=True).values('id', 'username', 'email', 'role')
        return Response(users)
