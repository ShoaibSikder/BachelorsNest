from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import RentRequest
from .serializers import RentRequestSerializer
from properties.models import Property


class CreateRentRequestView(generics.CreateAPIView):
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != 'BACHELOR':
            raise PermissionError("Only bachelors can send rent requests")

        property_id = self.request.data.get('property')
        property = Property.objects.get(id=property_id)

        serializer.save(
            bachelor=user,
            owner=property.owner,
            property=property
        )