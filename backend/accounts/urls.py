from django.urls import path
from .views import RegisterView
from .views import ProfileView
from .views import LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
