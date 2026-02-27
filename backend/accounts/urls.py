from django.urls import path
from .views import AdminUserListView, RegisterView
from .views import ProfileView
from .views import LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
]
