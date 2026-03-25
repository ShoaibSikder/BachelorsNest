from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Property
from .serializers import PropertySerializer, PropertyCreateUpdateSerializer
from accounts.permissions import IsOwner, IsAdmin
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from notifications.models import Notification
from .models import PropertyImage
# Owner: Add property with images
class PropertyCreateView(generics.CreateAPIView):
    serializer_class = PropertySerializer

    def perform_create(self, serializer):
        property_instance = serializer.save(owner=self.request.user)

        images = self.request.FILES.getlist('images')

        for img in images:
            PropertyImage.objects.create(property=property_instance, image=img)

# Owner: List own properties
class OwnerPropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)


# Owner/Admin: Update or Delete property
class PropertyUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertyCreateUpdateSerializer  # Use create/update serializer to handle images
    permission_classes = [IsAuthenticated, IsOwner]
    parser_classes = [MultiPartParser, FormParser]  # handle images

    def perform_update(self, serializer):
        serializer.save()


# Admin: Approve property
class PropertyApproveView(generics.UpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_update(self, serializer):
        property_obj = serializer.save(is_approved=True)
        Notification.objects.create(
            user=property_obj.owner,
            message="Your property has been approved by admin."
        )


# Public: View approved properties
class PropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = []

    def get_queryset(self):
        return Property.objects.filter(is_approved=True)