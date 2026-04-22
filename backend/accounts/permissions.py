from rest_framework.permissions import BasePermission

class IsBachelor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'bachelor'


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'owner'


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
    
class IsOwnerOrAdmin(BasePermission):
    """
    Custom permission: allow owners or admins to edit/delete a property.
    """
    def has_object_permission(self, request, view, obj):
        return request.user.role == "admin" or obj.owner == request.user
