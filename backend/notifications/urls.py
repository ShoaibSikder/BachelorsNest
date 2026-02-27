from django.urls import path
from .views import MarkNotificationReadView, UserNotificationListView

urlpatterns = [
    path('', UserNotificationListView.as_view(), name='user-notifications'),
    path('read/<int:pk>/', MarkNotificationReadView.as_view(), name='mark-read'),
]