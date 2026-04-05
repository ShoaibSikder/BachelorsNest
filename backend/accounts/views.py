from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

from .models import UserLog, PasswordResetToken
from .serializers import RegisterSerializer, ProfileSerializer, UserSerializer, UserLogSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from .permissions import IsAdmin

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from properties.models import Property  # your property model
from rentals.models import RentRequest   # your rent request model

User = get_user_model()


# --------------------- Auth ---------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = []


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = ProfileSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


# --------------------- Admin User Management ---------------------
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_object(self, pk):
        return get_object_or_404(User, pk=pk)

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def patch(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            UserLog.objects.create(user=user, action="Edited by admin")
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        # Optional: log deletion
        return Response({"detail": "User deleted successfully"}, status=204)


class AdminUserAddView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        user = serializer.save()
        UserLog.objects.create(user=user, action="Added by admin")


# --------------------- Password Reset ---------------------
class PasswordResetRequestView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                # Use .filter().first() instead of .get() to handle potential duplicates
                user = User.objects.filter(email=email).first()
                
                if not user:
                    return Response({"detail": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
                
                # Delete any existing tokens for this user
                PasswordResetToken.objects.filter(user=user).delete()
                # Create new reset token
                token = PasswordResetToken.objects.create(user=user)

                # Send email
                reset_url = f"{settings.FRONTEND_URL}/reset-password/{token.token}"
                try:
                    send_mail(
                        'Password Reset Request',
                        f'Click the link to reset your password: {reset_url}',
                        settings.DEFAULT_FROM_EMAIL,
                        [email],
                        fail_silently=False,
                    )
                except Exception as e:
                    # Log the error but still return success to avoid leaking info
                    print(f"Email sending failed: {e}")
                    import traceback
                    traceback.print_exc()
                    # For development, print the reset URL to console
                    print(f"Password reset URL: {reset_url}")
                
                return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)
            except Exception as e:
                print(f"Unexpected error in password reset: {e}")
                import traceback
                traceback.print_exc()
                return Response({"detail": "An error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token_value = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            try:
                token = PasswordResetToken.objects.get(token=token_value)
                if token.is_expired():
                    token.delete()
                    return Response({"detail": "Token has expired."}, status=status.HTTP_400_BAD_REQUEST)
                user = token.user
                user.set_password(new_password)
                user.save()
                token.delete()  # Delete token after use
                return Response({"detail": "Password reset successfully."}, status=status.HTTP_200_OK)
            except PasswordResetToken.DoesNotExist:
                return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(f"Unexpected error in password reset confirm: {e}")
                import traceback
                traceback.print_exc()
                return Response({"detail": "An error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserBanToggleView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.is_banned = not user.is_banned
        user.save()
        action_text = "Banned by admin" if user.is_banned else "Unbanned by admin"
        UserLog.objects.create(user=user, action=action_text)
        return Response({"is_banned": user.is_banned})


class AdminUserRoleChangeView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        role = request.data.get("role")
        if role in ['admin', 'owner', 'bachelor']:
            user.role = role
            user.save()
            UserLog.objects.create(user=user, action=f"Role changed to {role} by admin")
            return Response({"role": user.role})
        return Response({"error": "Invalid role"}, status=400)


class UserLogsView(generics.ListAPIView):
    serializer_class = UserLogSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return UserLog.objects.filter(user__id=user_id).order_by('-timestamp')

class OwnerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            # Count total properties
            total_properties = Property.objects.filter(owner=user).count()
            # Use is_approved boolean field instead of status
            approved_properties = Property.objects.filter(owner=user, is_approved=True).count()
            pending_properties = Property.objects.filter(owner=user, is_approved=False).count()

            # Rent requests counts
            total_rent_requests = RentRequest.objects.filter(property__owner=user).count()
            approved_rent_requests = RentRequest.objects.filter(property__owner=user, status='approved').count()
        except Exception as e:
            print("Dashboard error:", e)
            return Response({"error": "Failed to fetch dashboard"}, status=500)

        data = {
            "total_properties": total_properties,
            "approved_properties": approved_properties,
            "pending_properties": pending_properties,
            "total_rent_requests": total_rent_requests,
            "approved_rent_requests": approved_rent_requests,
        }
        return Response(data)