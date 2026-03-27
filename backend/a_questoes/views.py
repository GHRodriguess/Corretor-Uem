from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Questao, QuestaoIdioma
from .serializers import QuestaoSerializer, QuestaoIdiomaSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
import requests
import tempfile
from pdf2image import convert_from_path
import pytesseract
from collections import defaultdict


class QuestaoViewSet(viewsets.ModelViewSet):
    serializer_class = QuestaoSerializer
    
    def get_queryset(self):
        queryset = Questao.objects.all()
        vestibular = self.request.query_params.get("vestibular")
        
        if vestibular:
            queryset = queryset.filter(vestibular=vestibular)
        
        return queryset.order_by("numero")
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().prefetch_related("gabaritos_idioma")
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        questoes_com_idioma = queryset.filter(resposta_geral__isnull=True)
        idiomas_map = {}
        for q in questoes_com_idioma:
            idiomas_map[q.id] = list(
                q.gabaritos_idioma.values("id", "idioma", "resposta", "anulada")
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

    @extend_schema(
        # summary="Preview de importação de gabarito via PDF",
        description=(
            "Recebe um link de PDF de gabarito (ex: UEM) e retorna um preview das questões extraídas.\n\n"
            "⚠️ NÃO salva no banco.\n\n"
            "Detecta automaticamente:\n"
            "- Questões normais\n"
            "- Questões de idioma (quando número se repete)\n"
            "- Estrutura pronta para confirmação posterior"
        ),
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "link": {
                        "type": "string",
                        "example": "https://www.vestibular.uem.br/provas/ve25/gabdef.pdf"
                    }
                },
                "required": ["link"]
            }
        },
        responses={
            200: OpenApiResponse(
                description="Preview gerado com sucesso",
                response={
                    "type": "object",
                    "properties": {
                        "questoes": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "numero": {"type": "integer"},
                                    "resposta_geral": {"type": "integer", "nullable": True},
                                    "anulada": {"type": "boolean"}
                                }
                            }
                        },
                        "gabarito_idiomas": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "numero": {"type": "integer"},
                                    "idioma": {
                                        "type": "string",
                                        "enum": ["espanhol", "frances", "ingles"]
                                    },
                                    "resposta": {"type": "integer"},
                                    "anulada": {"type": "boolean"}
                                }
                            }
                        }
                    }
                },
                examples=[
                    OpenApiExample(
                        name="Exemplo de resposta",
                        value={
                            "questoes": [
                                {"numero": 1, "resposta_geral": 27, "anulada": False},
                                {"numero": 11, "resposta_geral": None, "anulada": False}
                            ],
                            "gabarito_idiomas": [
                                {"numero": 11, "idioma": "espanhol", "resposta": 25, "anulada": False},
                                {"numero": 11, "idioma": "frances", "resposta": 23, "anulada": False},
                                {"numero": 11, "idioma": "ingles", "resposta": 29, "anulada": False}
                            ]
                        }
                    )
                ]
            ),
            400: OpenApiResponse(
                description="Erro de validação ou processamento",
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        name="Erro sem link",
                        value={"erro": "link é obrigatório"}
                    ),
                    OpenApiExample(
                        name="Erro OCR",
                        value={"erro": "Formato inválido"}
                    )
                ]
            )
        }
    )
    @action(detail=False, methods=["post"], url_path="preview-gabarito")
    def preview_gabarito(self, request):

        link = request.data.get("link")

        if not link:
            return Response({"erro": "link é obrigatório"}, status=400)

        try:
            response = requests.get(
                link,
                headers={
                    "User-Agent": "Mozilla/5.0"
                },
                timeout=10,
                proxies={"http": None, "https": None}  
            )
            response.raise_for_status()
        except Exception as e:
            return Response({"erro": str(e)}, status=400)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(response.content)
            pdf_path = tmp.name

        imagens = convert_from_path(pdf_path, dpi=300)
        texto = ""
        for img in imagens:
            texto += pytesseract.image_to_string(img, config="--psm 11") + "\n"

        try:
            index = texto.index("Alternativa(s) Correta(s)")
            texto = texto[index + 1:]
        except:
            return Response({"erro": "Formato inválido"}, status=400)

        linhas = [l.strip() for l in texto.split("\n") if l.strip()]

        numero_resposta = []
        i = 0

        while i < len(linhas) - 2:
            try:
                numero = int(linhas[i].replace("*", "").replace("°", ""))                
                resposta = linhas[i+1].replace("*", "").replace("°", "")
                resposta = "ANULADA" if resposta == "ANULADA" else int(resposta)
                numero_resposta.append((numero, resposta))
                i += 3
            except:
                i += 1

        mapa = defaultdict(list)
        for numero, resposta in numero_resposta:
            mapa[numero].append(resposta)
        
        idiomas_ordem = ["espanhol", "frances", "ingles"]

        questoes = []
        gabarito_idiomas = []

        for numero, respostas in mapa.items():
            if len(respostas) == 1:
                resp = respostas[0]
                anulada = True if resp == "ANULADA" else False
                resp = resp if not anulada else 0
                questoes.append({
                    "numero": numero,
                    "resposta_geral": resp,
                    "anulada": anulada
                })
            else:
                questoes.append({
                    "numero": numero,
                    "resposta_geral": None,
                    "anulada": False
                })

                for i, resp in enumerate(respostas):
                    anulada = True if resp == "ANULADA" else False
                    resp = resp if not anulada else 0
                    gabarito_idiomas.append({
                        "numero": numero,
                        "idioma": idiomas_ordem[i],
                        "resposta": resp,
                        "anulada": anulada
                    })

        return Response({
            "questoes": sorted(questoes, key=lambda x: x["numero"]),
            "gabarito_idiomas": gabarito_idiomas
        })            
                
    @extend_schema(
        description=(
            "Recebe os dados previamente gerados no preview e salva no banco.\n\n"
            "• Cria ou atualiza questões (Questao)\n"
            "• Cria ou atualiza gabaritos por idioma (QuestaoIdioma)\n\n"
            "⚠️ Deve ser chamado após validar o preview no frontend."
        ),
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "vestibular_id": {
                        "type": "integer",
                        "example": 1,
                        "description": "ID do vestibular"
                    },
                    "questoes": {
                        "type": "array",
                        "description": "Lista de questões",
                        "items": {
                            "type": "object",
                            "properties": {
                                "numero": {"type": "integer", "example": 1},
                                "resposta_geral": {"type": "integer", "nullable": True, "example": 27},
                                "anulada": {"type": "boolean", "example": False}
                            }
                        }
                    },
                    "gabarito_idiomas": {
                        "type": "array",
                        "description": "Lista de respostas por idioma",
                        "items": {
                            "type": "object",
                            "properties": {
                                "numero": {"type": "integer", "example": 11},
                                "idioma": {
                                    "type": "string",
                                    "example": "ingles",
                                    "enum": ["ingles", "espanhol", "frances"]
                                },
                                "resposta": {"type": "integer", "example": 25},
                                "anulada": {"type": "boolean", "example": False}
                            }
                        }
                    }
                },
                "required": ["vestibular_id", "questoes"]
            }
        },
        responses={
            200: OpenApiExample(
                name="Sucesso",
                value={"msg": "Importação concluída"}
            ),
            400: OpenApiExample(
                name="Erro",
                value={"erro": "vestibular_id obrigatório"}
            )
        }
    )   
    @action(detail=False, methods=["post"], url_path="confirmar-importacao")
    def confirmar_importacao(self, request):
        vestibular_id = request.data.get("vestibular_id")
        questoes = request.data.get("questoes", [])
        idiomas = request.data.get("gabarito_idiomas", [])

        if not vestibular_id:
            return Response({"erro": "vestibular_id obrigatório"}, status=400)

        mapa_questoes = {}

        for q in questoes:
            obj, _ = Questao.objects.update_or_create(
                vestibular_id=vestibular_id,
                numero=q["numero"],
                defaults={
                    "resposta_geral": q["resposta_geral"],
                    "anulada": q["anulada"]
                }
            )
            mapa_questoes[q["numero"]] = obj

        for g in idiomas:
            questao = mapa_questoes.get(g["numero"])

            if not questao:
                continue

            QuestaoIdioma.objects.update_or_create(
                questao=questao,
                idioma=g["idioma"],
                defaults={
                    "resposta": g["resposta"],
                    "anulada": g["anulada"]
                }
            )

        return Response({"msg": "Importação concluída"})

class QuestaoIdiomaViewSet(viewsets.ModelViewSet):
    queryset = QuestaoIdioma.objects.all()
    serializer_class = QuestaoIdiomaSerializer
