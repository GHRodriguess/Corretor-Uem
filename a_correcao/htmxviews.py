from django.http import HttpResponse
from django.shortcuts import render

def questions(request, vestibular):
    print(request.method)
    print("só aqui")
    if request.method == "POST":
        linguagem = request.POST.get("linguagem", None)
        serie = request.POST.get("serie", None)
        print(linguagem, serie)
        
    return render(request, "partials/questoes.html")