from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Vestibular
from .serializers import VestibularSerializer

# Create your views here.
class VestibularViewset(viewsets.ModelViewSet):
    
    serializer_class = VestibularSerializer
    
    def get_queryset(self):
        queryset = Vestibular.objects.all().order_by('-ano', '-id')
        nome = self.request.query_params.get("nome")
        ano = self.request.query_params.get("ano")
        tipo = self.request.query_params.get("tipo")

        if nome:
            queryset = queryset.filter(nome=nome)
        if ano:
            queryset = queryset.filter(ano=ano)
        if tipo:
            queryset = queryset.filter(tipo=tipo)

        return queryset
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'vestibulares_compactados']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    
    @action(detail=False, methods=["get"], url_path="compactados", permission_classes=[], authentication_classes=[])
    def vestibulares_compactados(self, request, *args, **kwargs):
        qs = self.get_queryset().order_by('-ano', '-id')

        vistos = set()
        resultado = []

        for v in qs:
            chave = (v.nome, v.ano) if v.tipo == 'pas' else v.id

            if chave not in vistos:
                vistos.add(chave)
                resultado.append(v)

        serializer = self.get_serializer(resultado, many=True)
        return Response(serializer.data)

