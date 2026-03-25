from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Questao, QuestaoIdioma
from .serializers import QuestaoSerializer, QuestaoIdiomaSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes



class QuestaoViewSet(viewsets.ModelViewSet):
    serializer_class = QuestaoSerializer
    
    def get_queryset(self):
        queryset = Questao.objects.all()
        vestibular = self.request.query_params.get("vestibular")
        
        if vestibular:
            queryset = queryset.filter(vestibular=vestibular)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().prefetch_related("gabaritos_idioma")
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        questoes_com_idioma = queryset.filter(resposta_geral__isnull=True)
        idiomas_map = {}
        for q in questoes_com_idioma:
            idiomas_map[q.id] = list(
                q.gabaritos_idioma.values("idioma", "resposta", "anulada")
            )

        for item in data:
            item["gabaritos_idioma"] = idiomas_map.get(item["id"], [])
            
        return Response(data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='vestibular_id',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
                examples=[
                    OpenApiExample(
                        name='exemplo',
                        value='1'
                    )
                ]
            ),
            OpenApiParameter(
                name='idioma',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
                examples=[
                    OpenApiExample(
                        name='exemplo',
                        value='ingles'
                    )
                ]
            )
        ]
    )
    @action(detail=False, methods=["get"], url_path="gabarito", permission_classes=[], authentication_classes=[])
    def gabarito(self, request):
        vestibular_id = request.query_params.get("vestibular_id")
        idioma = request.query_params.get("idioma")

        if not vestibular_id or not idioma:
            return Response(
                {"erro": "Parâmetros 'vestibular_id' e 'idioma' são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        questoes = (
            Questao.objects.filter(vestibular_id=vestibular_id)
            .prefetch_related("gabaritos_idioma")
            .order_by("numero")
        )

        data = [
            {
                "numero": q.numero,
                "anulada": q.get_anulada(idioma=idioma),
                "idioma": q.is_idioma,
                "resposta": q.get_resposta(idioma=idioma),
            }
            for q in questoes
        ]

        return Response(data)


class QuestaoIdiomaViewSet(viewsets.ModelViewSet):
    queryset = QuestaoIdioma.objects.all()
    serializer_class = QuestaoIdiomaSerializer
