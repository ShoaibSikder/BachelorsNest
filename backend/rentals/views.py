from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import RentRequest
from .serializers import RentRequestSerializer
from properties.models import Property
from rest_framework.response import Response
from rest_framework import status
from notifications.models import Notification
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework.generics import DestroyAPIView



class CreateRentRequestView(generics.CreateAPIView):
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        if user.role.lower() != "bachelor":
            raise PermissionDenied("Only bachelors can send rent requests")

        property_id = self.request.data.get("property")
        property = get_object_or_404(Property, id=property_id)

        # ✅ Prevent duplicate requests
        if RentRequest.objects.filter(bachelor=user, property=property).exists():
            raise PermissionDenied("You already sent a request for this property.")

        serializer.save(
            bachelor=user,
            owner=property.owner,
            property=property,
            status="pending"
        )
        
class UpdateRentRequestStatusView(generics.UpdateAPIView):
    queryset = RentRequest.objects.all()
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

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

        if new_status not in ["accepted", "rejected"]:
            return Response(
                {"detail": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        rent_request.status = new_status
        rent_request.save()

        # ✅ If accepted, reject all other pending requests
        if new_status == "accepted":
            RentRequest.objects.filter(
                property=rent_request.property,
                status="pending"
            ).exclude(id=rent_request.id).update(status="rejected")

        # ✅ Send notification
        Notification.objects.create(
            user=rent_request.bachelor,
            message=f"Your rent request has been {new_status}."
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
        ).select_related('property', 'bachelor', 'owner')
    
class OwnerRequestListView(generics.ListAPIView):
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RentRequest.objects.filter(
            owner=self.request.user
        ).select_related('property', 'bachelor', 'owner')


class AdminRentRequestListView(generics.ListAPIView):
    """Admin view to see all rent requests"""
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only staff/admin users can access this
        if not (self.request.user.is_staff or self.request.user.role == "admin"):
            raise PermissionDenied("Only admins can access this resource")
        return RentRequest.objects.all().select_related('property', 'bachelor', 'owner').order_by('-created_at')

    def list(self, request, *args, **kwargs):
        if not (request.user.is_staff or request.user.role == "admin"):
            return Response(
                {"detail": "Only admins can access this resource"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)


class DeleteRentRequestView(DestroyAPIView):
    queryset = RentRequest.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if self.request.user != instance.bachelor and not (
            self.request.user.is_staff or self.request.user.role == "admin"
        ):
            raise PermissionDenied("You can only delete your own request")
        instance.delete()