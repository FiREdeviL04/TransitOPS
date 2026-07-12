from rest_framework import viewsets
from apps.accounts.permissions import IsAdminRole
from .models import Expense
from .serializers import ExpenseSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAdminRole]
    filterset_fields = ['category']
    search_fields = ['description', 'reference']
    ordering_fields = ['id', 'date', 'amount']

    def perform_create(self, serializer):
        """
        Supports auto ID generation if not provided.
        """
        id_val = self.request.data.get('id', f"e-{Expense.objects.count() + 10}")
        serializer.save(id=id_val)
