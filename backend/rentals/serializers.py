from rest_framework import serializers
from .models import RentRequest
from properties.models import Property


class PropertyMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['id', 'title', 'location', 'rent']   # 👈 only needed fields


class RentRequestSerializer(serializers.ModelSerializer):
    property = PropertyMiniSerializer(read_only=True)  # 👈 THIS LINE FIXES EVERYTHING

    class Meta:
        model = RentRequest
        fields = '__all__'
        read_only_fields = ['bachelor', 'owner', 'status']