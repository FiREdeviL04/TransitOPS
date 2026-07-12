from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    """
    Allows access only to Admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Admin')

class IsDriverRole(BasePermission):
    """
    Allows access only to Driver users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Driver')

class IsAdminOrDriverReadOnly(BasePermission):
    """
    Allows Admin full access, Drivers read-only access.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == 'Admin':
            return True
        if request.user.role == 'Driver':
            return request.method in ['GET', 'HEAD', 'OPTIONS']
        return False
