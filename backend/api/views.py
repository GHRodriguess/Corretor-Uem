from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import json
from .models import Vestibular, Questao, GabaritoIdioma
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
#GET

def vestibulares(request, limit=None):
    limit = request.GET.get('limit')    
    vestibulares_queryset = Vestibular.objects.filter(tipo='vestibular').order_by('-ano', '-nome')
    if limit:
        try:
            limit = int(limit)
            vestibulares_queryset = vestibulares_queryset[:limit]
        except (ValueError, TypeError):            
            pass
    vestibulares = list(vestibulares_queryset.values())
    
    return JsonResponse(vestibulares, safe=False)

def pas(request, limit=None, all_pas=False):
    pas_serializados = []
    
    if all_pas == 'true':
        vestibulares = Vestibular.objects.filter(tipo='pas').order_by('-ano', '-nome') 
        if vestibulares:
            for vestibular in vestibulares:
                pas_serializados.append({
                    'id': vestibular.id,
                    'nome': vestibular.nome,
                    'ano': vestibular.ano,
                    'tipo': vestibular.tipo,
                    'serie': vestibular.serie
                })
            
    else:        
        anos_unicos = Vestibular.objects.filter(tipo='pas').order_by('-ano').values_list('ano', flat=True).distinct()
        
        for ano in anos_unicos:
            vestibular = Vestibular.objects.filter(tipo='pas', ano=ano).first()
            if vestibular:
                pas_serializados.append({
                    'id': vestibular.id,
                    'nome': vestibular.nome,
                    'ano': vestibular.ano,
                    'tipo': vestibular.tipo,
                    'serie': vestibular.serie
                })

    if limit:
        try:
            limit = int(limit)
            pas_serializados = pas_serializados[:limit]
        except (ValueError, TypeError):
            pass

    # Retorna uma JsonResponse com a lista de PAS
    return JsonResponse(pas_serializados, safe=False)

def get_id_pas(request, year, serie):
    try:
        vestibular = Vestibular.objects.get(tipo='pas', ano=year, serie=serie)
        return JsonResponse({'id': vestibular.id}, status=200)
    except Vestibular.DoesNotExist:
        return JsonResponse({'error': 'Vestibular não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def get_vestibular_by_id(request, vestibular_id):
    try:
        vestibular = Vestibular.objects.get(pk=vestibular_id)
        return JsonResponse({
            'id': vestibular.id,
            'nome': vestibular.nome,
            'ano': vestibular.ano,
            'tipo': vestibular.tipo,
            'serie': vestibular.serie
        }, status=200)
    except Vestibular.DoesNotExist:
        return JsonResponse({'error': 'Vestibular não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def questoes(request, vestibular_id, idioma=None, serie=None):
    try:
        vestibular = Vestibular.objects.get(pk=vestibular_id)
        questoes_queryset = Questao.objects.filter(vestibular=vestibular).order_by('numero')
        
        questoes_serializadas = []
        for questao in questoes_queryset:
            respostas_idioma_data = None

            if questao.eh_idioma:     
                if idioma:
                    respostas_idioma_data = []
                    gabarito = GabaritoIdioma.objects.filter(questao=questao, idioma=idioma).first()
                    if gabarito:
                        respostas_idioma_data = gabarito.resposta_idioma 
                else:
                    respostas_idioma_data = {}
                    gabaritos = GabaritoIdioma.objects.filter(questao=questao)
                    for gabarito in gabaritos:                    
                        respostas_idioma_data[gabarito.idioma] = gabarito.resposta_idioma
            
            questoes_serializadas.append({
                'numero': questao.numero,
                'eh_idioma': questao.eh_idioma,
                'resposta_geral': questao.resposta_geral,
                'respostas_idioma': respostas_idioma_data,
                'anulada': questao.anulada
            })

        return JsonResponse(questoes_serializadas, safe=False)

    except Vestibular.DoesNotExist:
        return JsonResponse({'error': 'Vestibular não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


#POST

@csrf_exempt
def adiciona_vestibular(request):
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido.'}, status=405)

    try:
        data = json.loads(request.body)  
        with transaction.atomic():
            vestibular_data = data.get('vestibular')
            questoes_data = data.get('questoes')

            vestibular = Vestibular.objects.create(
                nome=vestibular_data['nome'],
                ano=vestibular_data['ano'],
                tipo=vestibular_data['tipo'],
                serie=vestibular_data.get('serie', None)
            )

            for questao_data in questoes_data:
                eh_idioma = questao_data.get('eh_idioma', False)
                resposta_geral_valor = questao_data.get('resposta_geral', None)
                if resposta_geral_valor is not None and resposta_geral_valor != '':
                    resposta_geral_valor = int(resposta_geral_valor)
                else:
                    resposta_geral_valor = None                
                questao = Questao.objects.create(
                    vestibular=vestibular,
                    numero=questao_data['numero'],
                    resposta_geral= resposta_geral_valor,
                    eh_idioma=eh_idioma,
                    anulada= questao_data.get("anulada", False)
                )

                if questao.eh_idioma:
                    respostas_idioma_data = questao_data.get('respostas_idioma', {})
                    for idioma, resposta_idioma in respostas_idioma_data.items():
                        if resposta_idioma: 
                            GabaritoIdioma.objects.create(
                                questao=questao,
                                idioma=idioma,
                                resposta_idioma=int(resposta_idioma) 
                            )
        
        return JsonResponse({'mensagem': 'Dados salvos com sucesso!', 'vestibular_id': vestibular.id}, status=201)
    
    except json.JSONDecodeError:
        return JsonResponse({'erro': 'Formato JSON inválido.'}, status=400)
    except KeyError as e:
        return JsonResponse({'erro': f'Campo ausente no JSON: {e}'}, status=400)
    except Exception as e:
        return JsonResponse({'erro': f'Ocorreu um erro: {e}'}, status=500)

@csrf_exempt
def salva_gabarito(request, vestibular_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            vestibular_id = data.get('vestibularId')
            questoes_data = data.get('questoes')

            vestibular = Vestibular.objects.get(pk=vestibular_id)
            Questao.objects.filter(vestibular=vestibular).delete()
            
            for questao_data in questoes_data:   
                questao = Questao.objects.create(
                    vestibular=vestibular,
                    numero=questao_data['numero'],
                    resposta_geral = questao_data['resposta_geral'],
                    eh_idioma=questao_data['eh_idioma'],
                    anulada=questao_data.get('anulada', False) 
                )

                if questao.eh_idioma:
                    respostas_idioma_data = questao_data.get('respostas_idioma', {})
                    for idioma, resposta_idioma in respostas_idioma_data.items():
                        if resposta_idioma: 
                            GabaritoIdioma.objects.create(
                                questao=questao,
                                idioma=idioma,
                                resposta_idioma=int(resposta_idioma) 
                            )
            
            return JsonResponse({'message': 'Gabarito salvo com sucesso!'}, status=200)

        except Vestibular.DoesNotExist:
            return JsonResponse({'error': 'Vestibular não encontrado.'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato de dados JSON inválido.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Método não permitido.'}, status=405)

# DELETE 
@api_view(['DELETE'])
def delete_vestibular(request, vestibular_id):

    try:
        vestibular = Vestibular.objects.get(pk=vestibular_id)
    except Vestibular.DoesNotExist:
        return Response({'error': 'Vestibular não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    vestibular.delete()
    return Response({'success': 'Vestibular deletado com sucesso.'}, status=status.HTTP_204_NO_CONTENT)
