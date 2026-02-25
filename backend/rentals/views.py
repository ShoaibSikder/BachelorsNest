from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import RentRequest
from .serializers import RentRequestSerializer
from properties.models import Property
from rest_framework.response import Response
from rest_framework import status


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
class UpdateRentRequestStatusView(generics.UpdateAPIView):
    queryset = RentRequest.objects.all()
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        rent_request = self.get_object()

        # Only property owner can update
        if request.user != rent_request.owner:
            return Response(
                {"detail": "Only owner can update this request"},
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

        return Response(
            {"detail": f"Request {new_status} successfully"},
            status=status.HTTP_200_OK
        )


class BachelorRequestListView(generics.ListAPIView):
    serializer_class = RentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RentRequest.objects.filter(bachelor=self.request.user)