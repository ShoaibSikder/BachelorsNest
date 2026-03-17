from django.urls import path
from .views import (
    PropertyCreateView, OwnerPropertyListView, PropertyUpdateDeleteView,
    PropertyApproveView, PropertyListView
)

urlpatterns = [
    path('add/', PropertyCreateView.as_view(), name='add-property'),
    path('owner/', OwnerPropertyListView.as_view(), name='owner-properties'),
    path('update-delete/<int:pk>/', PropertyUpdateDeleteView.as_view(), name='property-update-delete'),
    path('approve/<int:pk>/', PropertyApproveView.as_view(), name='property-approve'),
    path('approved/', PropertyListView.as_view(), name='approved-properties'),
]