from rest_framework import serializers
from .models import Notification, SystemLog


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"


class SystemLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = SystemLog
        fields = ['id', 'level', 'title', 'message', 'username', 'timestamp']