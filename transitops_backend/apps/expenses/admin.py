from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'amount', 'date', 'description', 'reference')
    list_filter = ('category', 'date')
    search_fields = ('id', 'description', 'reference')
    ordering = ('-date', 'id')
