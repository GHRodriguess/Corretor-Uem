from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import json
from .models import Vestibular, Questao, GabaritoIdioma

# Create your views here.
#GET

def vestibulares(request, limit=None):
    #vestibulares = Vestibular.objects.all()[:limit] if limit else Vestibular.objects.all()
    vestibulares = ['vestibular de inverno 2025', 'vestibular de verao 2024', 'vestibular de inverno 2024']    
    if limit:
        vestibulares = vestibulares[:limit]
        
    
    return JsonResponse({'vestibulares': vestibulares}, safe=False)

def pas(request, limit=None):
    #pas = Pas.objects.all()[:limit] if limit else Pas.objects.all()
    pas = ['pas 2025', 'pas 2024', 'pas 2023']
    if limit:
        pas = pas[:limit]
    
    return JsonResponse({'pas': pas}, safe=False)

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
                tipo=vestibular_data['tipo']
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
