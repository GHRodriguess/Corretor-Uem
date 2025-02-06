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
        curso = request.POST.get("curso", None)        
        gabarito = o_vestibular.define_gabarito(lingua, serie, curso)
        context["vestibular"] = vestibular
        context["vestibular_url"] = vestibular_url
        context["gabarito"] = gabarito
        request.session["gabarito"] = gabarito
        classes = define_classes_alternativas(gabarito)
        request.session["classes"] = classes
        request.session["alternativas_marcadas"] = [[] for _ in gabarito]
        request.session["somas"] = [0 for _ in gabarito]
    return render(request, "partials/questoes.html", context)


def cursos(request):
    if request.method == "POST":
        serie = request.POST.get("serie", None)   
        if serie == "3":
            cursos = True            
        else:
            cursos = False
        return render(request, "partials/cursos.html", {"cursos": cursos})


def mostra_respostas(request):
    context = {}
    if request.method == "POST":
        gabarito = request.session.get("gabarito", [])
        context["gabarito"] = gabarito
        mostra_resposta = True if request.POST.get("mostra-resposta") == "on" else False
        request.session["mostra-resposta"] = mostra_resposta
        if mostra_resposta:
            context["ativa"] = True

        classes = request.session["classes"]
        for i, classe in enumerate(classes):
            for j, alternativa in classe.items():
                if mostra_resposta:
                    if "mostra-resposta" not in alternativa:
                        classes[i][j] += "mostra-resposta"
                else:
                    if "mostra-resposta" in alternativa:
                        classes[i][j] = alternativa.replace("mostra-resposta", "")
        request.session["classes"] = classes
    return render(request, "partials/questoes.html", context)


def question(request, numero_questao):
    context = {}
    context["numero_questao"] = numero_questao
    numero_questao = int(numero_questao)
    alternativas_marcadas = request.POST.get("alternativas_marcadas", "[]")
    alternativas_marcadas = eval(alternativas_marcadas)
    request.session["alternativas_marcadas"][numero_questao - 1] = alternativas_marcadas
    alternativa_clicada = request.POST.get("value", "[]")
    alternativa_clicada = int(alternativa_clicada)
    if alternativa_clicada not in alternativas_marcadas:
        alternativas_marcadas.append(alternativa_clicada)
    else:
        alternativas_marcadas.remove(alternativa_clicada)
    alternativas_marcadas.sort()
    context["alternativas_marcadas"] = alternativas_marcadas
    context["soma"] = sum(alternativas_marcadas)
    request.session["somas"][numero_questao - 1] = sum(alternativas_marcadas)
    soma_correta = request.session.get("gabarito", [])[numero_questao - 1]
    alternativas_corretas = soma_to_list(soma_correta)

    if soma_correta == "ANULADA":
        nota = 6
        zerou = False
    else:
        nota, zerou = calcular_nota(alternativas_corretas, alternativas_marcadas)

    if soma_correta == "ANULADA":
        alternativas_corretas = [1, 2, 4, 8, 16]

    notas = request.session.get("notas", {})
    notas[str(numero_questao)] = nota
    request.session["notas"] = notas

    mostra_resposta = request.session.get("mostra-resposta", False)
    request.session["classes"][numero_questao - 1] = {}
    context["class"] = {}
    for alternativa in [1, 2, 4, 8, 16]:
        classe = f"alternativa {'certa' if alternativa in alternativas_corretas else 'errada'} {'marcado' if alternativa in alternativas_marcadas else ''} {'mostra-resposta' if mostra_resposta else ''}"
        context["class"][alternativa] = classe
        request.session["classes"][numero_questao - 1][alternativa] = classe

    return render(request, "partials/questao.html", context)


def atualiza_nota(request):
    context = {}
    notas = request.session.get("notas", {}) 
    contagem = dict(Counter(notas.values()))
    soma_total = sum(notas.values())
    context["contagem"] = contagem
    context["soma_total"] = round(soma_total, 1)
    return render(request, "partials/resumo.html", context)
