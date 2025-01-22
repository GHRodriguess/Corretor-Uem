from django.shortcuts import render

# Create your views here.
def correcao(request, vestibular: str):
    vestibular = vestibular.replace("-", " ").upper()
    print(vestibular)
    return render(request, 'correcao.html')