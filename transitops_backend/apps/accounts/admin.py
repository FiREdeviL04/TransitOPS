from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

User = get_user_model()

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'role', 'is_staff', 'driver_id_ref')
    list_filter = ('role', 'is_staff', 'is_superuser')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Profile Options', {'fields': ('role', 'name', 'phone', 'driver_id_ref')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Profile Options', {'fields': ('role', 'name', 'phone', 'driver_id_ref')}),
    )
    search_fields = ('email', 'name', 'driver_id_ref')
    ordering = ('email',)
