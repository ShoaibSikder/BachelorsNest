from django.contrib.auth import get_user_model
from rest_framework import serializers

from properties.models import Property

from .models import RentRequest

User = get_user_model()


class UserMiniSerializer(serializers.ModelSerializer):
    phone = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'username',
            'email',
            'phone',
            'profile_image',
        ]

    def get_phone(self, obj):
        return getattr(obj, 'phone', 'N/A')


class PropertyMiniSerializer(serializers.ModelSerializer):
    owner = UserMiniSerializer(read_only=True)
    vacancy_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'location',
            'rent',
            'description',
            'property_type',
            'available_from',
            'is_available',
            'total_seats',
            'occupied_seats',
            'vacancy_count',
            'owner',
        ]


class RentRequestSerializer(serializers.ModelSerializer):
    property = PropertyMiniSerializer(read_only=True)
    bachelor = UserMiniSerializer(read_only=True)
    owner = UserMiniSerializer(read_only=True)

    class Meta:
        model = RentRequest
        fields = '__all__'
        read_only_fields = ['bachelor', 'owner', 'status', 'created_at']
