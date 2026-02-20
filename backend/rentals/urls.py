from django.urls import path
from .views import CreateRentRequestView

urlpatterns = [
    path('request/', CreateRentRequestView.as_view()),
]