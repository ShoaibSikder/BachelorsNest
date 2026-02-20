from rest_framework import serializers
from .models import RentRequest

class RentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentRequest
        fields = '__all__'
        read_only_fields = ['bachelor', 'owner', 'status']