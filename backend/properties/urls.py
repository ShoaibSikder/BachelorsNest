from django.urls import path
from .views import PropertyCreateView, PropertyListView, PropertyApproveView
from .views import PropertyImageUploadView
from .views import ApprovedPropertyListView
from .views import OwnerPropertyListView

urlpatterns = [
    path('add/', PropertyCreateView.as_view()),
    path('list/', PropertyListView.as_view()),
    path('approve/<int:pk>/', PropertyApproveView.as_view()),
    path('upload-images/<int:pk>/', PropertyImageUploadView.as_view()),
    path('approved/', ApprovedPropertyListView.as_view(), name='approved-properties'),
    path('owner/', OwnerPropertyListView.as_view(), name='owner-properties'),
]
