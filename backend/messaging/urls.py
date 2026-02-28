from django.urls import path
from .views import SendMessageView, ConversationView, UnreadMessageCountView

urlpatterns = [
    path('send/', SendMessageView.as_view(), name='send-message'),
    path('conversation/<int:user_id>/', ConversationView.as_view(), name='conversation'),
    path('unread-count/', UnreadMessageCountView.as_view()),
]