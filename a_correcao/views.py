from django.shortcuts import render
from .utils import *

# Create your views here.
def correcao(request, vestibular: str):    
    context = {}
    vestibular = vestibular.replace("-", " ").upper()
    o_vestibular = Vestibular(vestibular)
    context['status'] = o_vestibular.verifica_gabarito()  
    if not context['status']:
        return render(request, 'correcao.html', context)
    return render(request, 'correcao.html', context)