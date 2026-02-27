from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Property, PropertyImage
from .serializers import PropertySerializer
from accounts.permissions import IsOwner, IsAdmin
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from notifications.models import Notification

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

# owner: Upload property images
class PropertyImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, property_id):
        if request.user.role != 'OWNER':
            return Response(
                {"detail": "Only owners can upload images"},
                status=status.HTTP_403_FORBIDDEN
            )

        images = request.FILES.getlist('images')

        for img in images:
            PropertyImage.objects.create(
                property_id=property_id,
                image=img
            )

        return Response(
            {"detail": "Images uploaded successfully"},
            status=status.HTTP_201_CREATED
        )

class ApprovedPropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(is_approved=True)


class OwnerPropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)

class PendingPropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return Property.objects.filter(is_approved=False)

class AdminPropertyListView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class ApprovedPropertyListView(generics.ListAPIView):
    queryset = Property.objects.filter(is_approved=True)
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['price', 'location', 'rooms']
    search_fields = ['location', 'title']
    

def perform_update(self, serializer):
    property_obj = serializer.save(is_approved=True)

    Notification.objects.create(
        user=property_obj.owner,
        message="Your property has been approved by admin."
    )