from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Vestibular
from .serializers import VestibularSerializer

class VestibularViewset(viewsets.ModelViewSet):
    
    serializer_class = VestibularSerializer
    
    def get_queryset(self):
        queryset = Vestibular.objects.all().order_by('-ano', '-id')
        name = self.request.query_params.get("nome")
        year = self.request.query_params.get("ano")
        type_param = self.request.query_params.get("tipo")

        if name:
            queryset = queryset.filter(nome=name)
        if year:
            queryset = queryset.filter(ano=year)
        if type_param:
            queryset = queryset.filter(tipo=type_param)

        return queryset
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'vestibulares_compactados']:
            return [AllowAny()]
        return [IsAdminUser()]
    
    @action(detail=False, methods=["get"], url_path="compactados", permission_classes=[], authentication_classes=[])
    def vestibulares_compactados(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by('-ano', '-id')

        seen = set()
        result = []

        for vestibular in queryset:
            key = (vestibular.nome, vestibular.ano) if vestibular.tipo == 'pas' else vestibular.id

            if key not in seen:
                seen.add(key)
                result.append(vestibular)

        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)
