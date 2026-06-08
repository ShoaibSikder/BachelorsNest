from django.core.exceptions import PermissionDenied
from django.db.models import BooleanField, Count, Exists, OuterRef, Prefetch, Value
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdmin, IsOwner, IsOwnerOrAdmin
from notifications.models import Notification

from .models import Property, PropertyImage, Wishlist
from .serializers import PropertyCreateUpdateSerializer, PropertySerializer


class PropertyPageNumberPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 24


def property_queryset(user=None):
    queryset = Property.objects.select_related('owner').prefetch_related(
        Prefetch('images', queryset=PropertyImage.objects.order_by('uploaded_at'))
    ).annotate(saved_count_value=Count('wishlists', distinct=True))

    if user and user.is_authenticated and getattr(user, 'role', None) == 'bachelor':
        queryset = queryset.annotate(
            is_saved_value=Exists(
                Wishlist.objects.filter(
                    bachelor=user,
                    property=OuterRef('pk'),
                )
            )
        )
    else:
        queryset = queryset.annotate(
            is_saved_value=Value(False, output_field=BooleanField())
        )

    return queryset


class PropertyCreateView(generics.CreateAPIView):
    serializer_class = PropertyCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    parser_classes = [MultiPartParser, FormParser]


class OwnerPropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return property_queryset(self.request.user).filter(owner=self.request.user)


class PropertyUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return property_queryset(self.request.user)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PropertyCreateUpdateSerializer
        return PropertySerializer

    def perform_update(self, serializer):
        serializer.save()


class AdminPropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return property_queryset(self.request.user)


class PropertyApproveView(generics.UpdateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return property_queryset(self.request.user)

    def perform_update(self, serializer):
        property_obj = serializer.save(is_approved=True, is_rejected=False)
        Notification.objects.create(
            user=property_obj.owner,
            message="Your property has been approved by admin."
        )


class PropertyRejectView(generics.UpdateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return property_queryset(self.request.user)

    def perform_update(self, serializer):
        property_obj = serializer.save(is_rejected=True, is_approved=False)
        Notification.objects.create(
            user=property_obj.owner,
            message="Your property has been rejected by admin."
        )


class PropertyRevertPendingView(generics.UpdateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return property_queryset(self.request.user)

    def perform_update(self, serializer):
        property_obj = serializer.save(is_approved=False, is_rejected=False)
        Notification.objects.create(
            user=property_obj.owner,
            message="Your property has been reverted to pending by admin."
        )


class PropertyListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = []
    pagination_class = PropertyPageNumberPagination

    def get_queryset(self):
        queryset = property_queryset(self.request.user).filter(is_approved=True, is_rejected=False)
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

        return property_queryset(self.request.user).filter(
            wishlists__bachelor=self.request.user
        ).distinct()
