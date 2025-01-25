from django.shortcuts import render
from .utils import *
from collections import Counter

def questions(request, vestibular):  
    context = {}    
    if request.method == "POST":
        vestibular_url = vestibular
        vestibular = vestibular.replace("-", " ").upper()
        o_vestibular = Vestibular(vestibular)
        lingua = request.POST.get("linguagem", None)
        serie = request.POST.get("serie", None)        
        gabarito = o_vestibular.define_gabarito(lingua, serie)
        context['vestibular'] = vestibular
        context['vestibular_url'] = vestibular_url
        context["gabarito"] = gabarito        
        request.session["gabarito"] = gabarito
        
    return render(request, "partials/questoes.html", context)

def question(request, numero_questao):
    context = {}  
    context["numero_questao"] = numero_questao
    numero_questao = int(numero_questao)
    alternativas_marcadas = request.POST.get("alternativas_marcadas", "[]")    
    alternativas_marcadas = eval(alternativas_marcadas)    
    alternativa_clicada = request.POST.get("value", "[]")
    alternativa_clicada = int(alternativa_clicada)
    if alternativa_clicada not in alternativas_marcadas:
        alternativas_marcadas.append(alternativa_clicada)
    else:
        alternativas_marcadas.remove(alternativa_clicada)
    alternativas_marcadas.sort()
    context["alternativas_marcadas"] = alternativas_marcadas   
    context["soma"] = sum(alternativas_marcadas)
    soma_correta =  request.session.get("gabarito", [])[numero_questao - 1]
    alternativas_corretas = soma_to_list(soma_correta)  
    
    if soma_correta == "ANULADA":
        nota = 6
        zerou = False
    else:          
        nota, zerou = calcular_nota(alternativas_corretas, alternativas_marcadas)       
    
    if zerou:
        alternativas_corretas = []
        alternativas_marcadas = [1,2,4,8,16]
    if soma_correta == "ANULADA":
        alternativas_corretas = [1,2,4,8,16]
        
    notas = request.session.get("notas", {})
    notas[str(numero_questao)] = nota  
    request.session["notas"] = notas

    context["class"] = {}
    for alternativa in [1,2,4,8,16]:   
        context["class"][alternativa] = f"alternativa {'certa' if alternativa in alternativas_corretas else 'errada'} {'marcado' if alternativa in alternativas_marcadas else ''}"     
    
    
        
    return render(request, "partials/questao.html", context)

def atualiza_nota(request):
    context = {}
    notas = request.session.get("notas", {})
    contagem = dict(Counter(notas.values()))
    soma_total = sum(notas.values())
    context["contagem"] = contagem 
    context["soma_total"] = soma_total
    return render(request, "partials/resumo.html", context)