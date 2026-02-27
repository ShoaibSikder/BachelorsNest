from django.urls import path
from .views import AdminPropertyListView, PropertyCreateView, PropertyListView, PropertyApproveView
from .views import PropertyImageUploadView
from .views import ApprovedPropertyListView
from .views import OwnerPropertyListView
from .views import PendingPropertyListView

urlpatterns = [
    path('add/', PropertyCreateView.as_view()),
    path('list/', PropertyListView.as_view()),
    path('approve/<int:pk>/', PropertyApproveView.as_view()),
    path('upload-images/<int:pk>/', PropertyImageUploadView.as_view()),
    path('approved/', ApprovedPropertyListView.as_view(), name='approved-properties'),
    path('owner/', OwnerPropertyListView.as_view(), name='owner-properties'),
    path('admin/pending/', PendingPropertyListView.as_view(), name='pending-properties'),
    path('admin/all/', AdminPropertyListView.as_view(), name='admin-all-properties'),
]
