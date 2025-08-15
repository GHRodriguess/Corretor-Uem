from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import json
from .models import Vestibular, Questao, GabaritoIdioma

# Create your views here.
#GET

def vestibulares(request, limit=None):
    limit = request.GET.get('limit')    
    vestibulares_queryset = Vestibular.objects.all()
    if limit:
        try:
            limit = int(limit)
            vestibulares_queryset = vestibulares_queryset[:limit]
        except (ValueError, TypeError):            
            pass
    vestibulares = list(vestibulares_queryset.values())

    return JsonResponse(vestibulares, safe=False)

def pas(request, limit=None):
    #pas = Pas.objects.all()[:limit] if limit else Pas.objects.all()
    pas = ['pas 2025', 'pas 2024', 'pas 2023']
    if limit:
        pas = pas[:limit]
    
    return JsonResponse({'pas': pas}, safe=False)

def questoes(request, vestibular_id, idioma=None):
    try:
        vestibular = Vestibular.objects.get(pk=vestibular_id)
        questoes_queryset = Questao.objects.filter(vestibular=vestibular).order_by('numero')

        questoes_serializadas = []
        for questao in questoes_queryset:
            respostas_idioma_data = None

            if questao.eh_idioma:                
                respostas_idioma_data = {}
                gabaritos = GabaritoIdioma.objects.filter(questao=questao)
                for gabarito in gabaritos:
                    respostas_idioma_data[gabarito.idioma] = gabarito.resposta_idioma
            
            questoes_serializadas.append({
                'numero': questao.numero,
                'eh_idioma': questao.eh_idioma,
                'resposta_geral': questao.resposta_geral,
                'respostas_idioma': respostas_idioma_data,
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
                    eh_idioma=eh_idioma
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
                    eh_idioma=questao_data['eh_idioma']
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

