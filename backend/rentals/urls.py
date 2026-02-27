from django.urls import path
from .views import CreateRentRequestView
from .views import UpdateRentRequestStatusView
from .views import BachelorRequestListView
from .views import OwnerRequestListView


urlpatterns = [
    path('request/', CreateRentRequestView.as_view()),
    path('request/', CreateRentRequestView.as_view()),
    path('update/<int:pk>/', UpdateRentRequestStatusView.as_view()),
    path('bachelor/', BachelorRequestListView.as_view(), name='bachelor-requests'),
    path('owner/', OwnerRequestListView.as_view(), name='owner-requests'),
]