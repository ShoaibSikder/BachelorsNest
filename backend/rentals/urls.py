from django.urls import path
from .views import (
    AdminRentRequestListView,
    BachelorRequestListView,
    CreateRentRequestView,
    DeleteRentRequestView,
    OwnerRequestListView,
    UpdateRentRequestStatusView,
)


urlpatterns = [
    path('request/', CreateRentRequestView.as_view()),
    path('update/<int:pk>/', UpdateRentRequestStatusView.as_view()),
    path('bachelor/', BachelorRequestListView.as_view(), name='bachelor-requests'),
    path('owner/', OwnerRequestListView.as_view(), name='owner-requests'),
    path('admin/', AdminRentRequestListView.as_view(), name='admin-requests'),
    path('delete/<int:pk>/', DeleteRentRequestView.as_view()),
]
