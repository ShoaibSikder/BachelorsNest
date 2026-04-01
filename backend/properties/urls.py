from django.urls import path
from .views import (
    AdminPropertyListView, PropertyCreateView, OwnerPropertyListView, PropertyRejectView, PropertyUpdateDeleteView,
    PropertyApproveView, PropertyListView
)

urlpatterns = [
    path('add/', PropertyCreateView.as_view(), name='add-property'),
    path('owner/', OwnerPropertyListView.as_view(), name='owner-properties'),
    path('update-delete/<int:pk>/', PropertyUpdateDeleteView.as_view(), name='property-update-delete'),
    path('approve/<int:pk>/', PropertyApproveView.as_view(), name='property-approve'),
    path('approved/', PropertyListView.as_view(), name='approved-properties'),
    path('admin/all/', AdminPropertyListView.as_view(), name='admin-all-properties'),
    path('reject/<int:pk>/', PropertyRejectView.as_view(), name='property-reject'),
]