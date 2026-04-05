from django.urls import path
from .views import (
    MarkNotificationReadView,
    UserNotificationListView,
    BroadcastNotificationView,
    RoleNotificationView,
    IndividualMessageView,
    SystemLogListView,
    AdminUsersListView,
)

urlpatterns = [
    path('', UserNotificationListView.as_view(), name='user-notifications'),
    path('read/<int:pk>/', MarkNotificationReadView.as_view(), name='mark-read'),
    path('admin/broadcast/', BroadcastNotificationView.as_view(), name='broadcast-notification'),
    path('admin/role/', RoleNotificationView.as_view(), name='role-notification'),
    path('admin/individual/', IndividualMessageView.as_view(), name='individual-message'),
    path('admin/logs/', SystemLogListView.as_view(), name='system-logs'),
    path('admin/users/', AdminUsersListView.as_view(), name='admin-users'),
]