from django.core.exceptions import PermissionDenied
from django.db import transaction
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notifications.models import Notification
from properties.models import Property

from .models import RentRequest
from .serializers import RentRequestSerializer


def sync_property_capacity(property_obj):
    property_obj.occupied_seats = min(property_obj.occupied_seats, property_obj.total_seats)
    if property_obj.vacancy_count == 0:
        property_obj.is_available = False
    elif property_obj.occupied_seats < property_obj.total_seats:
        property_obj.is_available = True
    property_obj.save(update_fields=['occupied_seats', 'is_available'])


class CreateRentRequestView(generics.CreateAPIView):
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        if user.role.lower() != "bachelor":
            raise PermissionDenied("Only bachelors can send rent requests")

        property_id = self.request.data.get("property")
        property_obj = get_object_or_404(Property, id=property_id)

        if not property_obj.is_approved or property_obj.is_rejected:
            raise PermissionDenied("This property is not available for requests.")

        if not property_obj.is_available or property_obj.vacancy_count <= 0:
            raise PermissionDenied("This property is currently full or unavailable.")

        if RentRequest.objects.filter(
            bachelor=user,
            property=property_obj,
            status__in=["pending", "accepted"]
        ).exists():
            raise PermissionDenied("You already have an active request for this property.")

        serializer.save(
            bachelor=user,
            owner=property_obj.owner,
            property=property_obj,
            status="pending"
        )

        Notification.objects.create(
            user=property_obj.owner,
            message=f"{user.username} sent a rent request for {property_obj.title}."
        )


class UpdateRentRequestStatusView(generics.UpdateAPIView):
    queryset = RentRequest.objects.select_related('property', 'bachelor', 'owner')
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        rent_request = self.get_object()

        if request.user != rent_request.owner and not (
            request.user.is_staff or request.user.role == "admin"
        ):
            return Response(
                {"detail": "Only owner or admin can update this request"},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get("status")
        old_status = rent_request.status

        if new_status not in ["accepted", "rejected", "cancelled"]:
            return Response(
                {"detail": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        property_obj = rent_request.property

        if new_status == "accepted" and old_status != "accepted":
            if not property_obj.is_available or property_obj.vacancy_count <= 0:
                return Response(
                    {"detail": "No vacancy left for this property."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            property_obj.occupied_seats += 1
            sync_property_capacity(property_obj)

        if old_status == "accepted" and new_status != "accepted":
            property_obj.occupied_seats = max(property_obj.occupied_seats - 1, 0)
            sync_property_capacity(property_obj)

        rent_request.status = new_status
        rent_request.save(update_fields=['status'])

        if property_obj.vacancy_count == 0:
            pending_requests = RentRequest.objects.filter(
                property=property_obj,
                status="pending"
            ).exclude(id=rent_request.id)
            pending_bachelors = [req.bachelor for req in pending_requests.select_related('bachelor')]
            pending_requests.update(status="rejected")
            for bachelor in pending_bachelors:
                Notification.objects.create(
                    user=bachelor,
                    message=f"{property_obj.title} is now full, so your pending request was rejected."
                )

        Notification.objects.create(
            user=rent_request.bachelor,
            message=f"Your rent request for {property_obj.title} has been {new_status}."
        )

        return Response(
            {"detail": f"Request {new_status} successfully"},
            status=status.HTTP_200_OK
        )


class BachelorRequestListView(generics.ListAPIView):
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RentRequest.objects.filter(
            bachelor=self.request.user
        ).select_related('property', 'property__owner', 'bachelor', 'owner')


class OwnerRequestListView(generics.ListAPIView):
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RentRequest.objects.filter(
            owner=self.request.user
        ).select_related('property', 'property__owner', 'bachelor', 'owner')


class AdminRentRequestListView(generics.ListAPIView):
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not (self.request.user.is_staff or self.request.user.role == "admin"):
            raise PermissionDenied("Only admins can access this resource")
        return RentRequest.objects.all().select_related(
            'property',
            'property__owner',
            'bachelor',
            'owner',
        )

    def list(self, request, *args, **kwargs):
        if not (request.user.is_staff or request.user.role == "admin"):
            return Response(
                {"detail": "Only admins can access this resource"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)


class DeleteRentRequestView(generics.DestroyAPIView):
    queryset = RentRequest.objects.select_related('property', 'bachelor', 'owner')
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if self.request.user != instance.bachelor and not (
            self.request.user.is_staff or self.request.user.role == "admin"
        ):
            raise PermissionDenied("You can only delete your own request")

        if instance.status == 'accepted':
            property_obj = instance.property
            property_obj.occupied_seats = max(property_obj.occupied_seats - 1, 0)
            sync_property_capacity(property_obj)

        instance.delete()
