from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Property
from .serializers import PropertySerializer
from accounts.permissions import IsOwner, IsAdmin
from rest_framework.permissions import IsAuthenticated

# Owner: Add property
class PropertyCreateView(generics.CreateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# Public: View approved properties
class PropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = []

    def get_queryset(self):
        return Property.objects.filter(is_approved=True)


# Admin: Approve property
class PropertyApproveView(generics.UpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_update(self, serializer):
        serializer.save(is_approved=True)
