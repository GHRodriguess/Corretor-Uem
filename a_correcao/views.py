from django.shortcuts import render
from .utils import *

# Create your views here.
def correcao(request, vestibular: str):  
    print(1)      
    context = {}    
    vestibular_url = vestibular
    vestibular = vestibular.replace("-", " ").upper()
    o_vestibular = Vestibular(vestibular)
    context['status'] = o_vestibular.verifica_gabarito()      
    if not context['status']:
        return render(request, 'correcao.html', context)
    context['vestibular'] = vestibular
    context['vestibular_url'] = vestibular_url
    context['serie'] = o_vestibular.define_serie_necessaria()    
    
    return render(request, 'correcao.html', context)

