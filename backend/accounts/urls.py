from django.urls import path
from .views import (
    OwnerDashboardView, RegisterView, ProfileView, LogoutView,
    AdminUserListView, AdminUserAddView, AdminUserDetailView,
    AdminUserBanToggleView, AdminUserRoleChangeView, UserLogsView,
    PasswordResetRequestView, PasswordResetConfirmView
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
     path('owner-dashboard/', OwnerDashboardView.as_view(), name='owner-dashboard'),

    # Password Reset
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

    # Admin Users
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
    path('admin/users/add/', AdminUserAddView.as_view(), name='admin-add-user'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/users/<int:pk>/ban/', AdminUserBanToggleView.as_view(), name='admin-user-ban'),
    path('admin/users/<int:pk>/role/', AdminUserRoleChangeView.as_view(), name='admin-user-role'),
    path('admin/users/<int:user_id>/logs/', UserLogsView.as_view(), name='user-logs'),
]