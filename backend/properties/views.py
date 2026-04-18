from django.core.exceptions import PermissionDenied
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdmin, IsOwner, IsOwnerOrAdmin
from notifications.models import Notification

from .models import Property, PropertyImage, Wishlist
from .serializers import PropertyCreateUpdateSerializer, PropertySerializer


def property_queryset():
    return Property.objects.select_related('owner').prefetch_related(
        'wishlists',
        Prefetch('images', queryset=PropertyImage.objects.order_by('uploaded_at'))
    )


class PropertyCreateView(generics.CreateAPIView):
    serializer_class = PropertyCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    parser_classes = [MultiPartParser, FormParser]


class OwnerPropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return property_queryset().filter(owner=self.request.user)


class PropertyUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = property_queryset()
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PropertyCreateUpdateSerializer
        return PropertySerializer

    def perform_update(self, serializer):
        serializer.save()


class AdminPropertyListView(generics.ListAPIView):
    queryset = property_queryset()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class PropertyApproveView(generics.UpdateAPIView):
    queryset = property_queryset()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_update(self, serializer):
        property_obj = serializer.save(is_approved=True, is_rejected=False)
        Notification.objects.create(
            user=property_obj.owner,
            message="Your property has been approved by admin."
        )


class PropertyRejectView(generics.UpdateAPIView):
    queryset = property_queryset()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_update(self, serializer):
        property_obj = serializer.save(is_rejected=True, is_approved=False)
        Notification.objects.create(
            user=property_obj.owner,
            message="Your property has been rejected by admin."
        )


class PropertyRevertPendingView(generics.UpdateAPIView):
    queryset = property_queryset()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_update(self, serializer):
        property_obj = serializer.save(is_approved=False, is_rejected=False)
        Notification.objects.create(
            user=property_obj.owner,
            message="Your property has been reverted to pending by admin."
        )


class PropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = []

    def get_queryset(self):
        queryset = property_queryset().filter(is_approved=True, is_rejected=False)
        availability = self.request.query_params.get('available')
        if availability == 'true':
            queryset = queryset.filter(is_available=True)
        return queryset


class WishlistToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'bachelor':
            raise PermissionDenied("Only bachelors can save properties.")

        property_obj = get_object_or_404(
            Property.objects.filter(is_approved=True, is_rejected=False),
            pk=pk
        )
        wishlist, created = Wishlist.objects.get_or_create(
            bachelor=request.user,
            property=property_obj
        )

        if created:
            Notification.objects.create(
                user=property_obj.owner,
                message=f"{request.user.username} saved your property to their wishlist."
            )
            return Response(
                {"saved": True, "detail": "Property saved to wishlist."},
                status=status.HTTP_201_CREATED
            )

        wishlist.delete()
        return Response({"saved": False, "detail": "Property removed from wishlist."})


class SavedPropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'bachelor':
            raise PermissionDenied("Only bachelors can access saved properties.")

        return property_queryset().filter(
            wishlists__bachelor=self.request.user
        ).distinct()
