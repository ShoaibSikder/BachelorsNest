from django.urls import path
from .views import (
    AdminPropertyListView,
    OwnerPropertyListView,
    PropertyApproveView,
    PropertyCreateView,
    PropertyListView,
    PropertyRejectView,
    PropertyRevertPendingView,
    PropertyUpdateDeleteView,
    SavedPropertyListView,
    WishlistToggleView,
)

urlpatterns = [
    path('add/', PropertyCreateView.as_view(), name='add-property'),
    path('owner/', OwnerPropertyListView.as_view(), name='owner-properties'),
    path('update-delete/<int:pk>/', PropertyUpdateDeleteView.as_view(), name='property-update-delete'),
    path('approve/<int:pk>/', PropertyApproveView.as_view(), name='property-approve'),
    path('approved/', PropertyListView.as_view(), name='approved-properties'),
    path('admin/all/', AdminPropertyListView.as_view(), name='admin-all-properties'),
    path('reject/<int:pk>/', PropertyRejectView.as_view(), name='property-reject'),
    path('revert-pending/<int:pk>/', PropertyRevertPendingView.as_view(), name='property-revert-pending'),
    path('saved/', SavedPropertyListView.as_view(), name='saved-properties'),
    path('<int:pk>/wishlist/', WishlistToggleView.as_view(), name='property-wishlist-toggle'),
]
