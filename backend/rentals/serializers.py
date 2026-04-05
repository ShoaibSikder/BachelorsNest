from rest_framework import serializers
from .models import RentRequest
from properties.models import Property
from django.contrib.auth import get_user_model

User = get_user_model()


class PropertyMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['id', 'title', 'location', 'rent']


class UserMiniSerializer(serializers.ModelSerializer):
    phone = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'phone']
    
    def get_phone(self, obj):
        # Try to get phone field if it exists, otherwise return N/A
        return getattr(obj, 'phone', 'N/A')


class RentRequestSerializer(serializers.ModelSerializer):
    property = PropertyMiniSerializer(read_only=True)
    bachelor = UserMiniSerializer(read_only=True)
    owner = UserMiniSerializer(read_only=True)

    class Meta:
        model = RentRequest
        fields = '__all__'
        read_only_fields = ['bachelor', 'owner', 'status', 'created_at']