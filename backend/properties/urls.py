from django.urls import path
from .views import PropertyCreateView, PropertyListView, PropertyApproveView

urlpatterns = [
    path('add/', PropertyCreateView.as_view()),
    path('list/', PropertyListView.as_view()),
    path('approve/<int:pk>/', PropertyApproveView.as_view()),
]
