from django.shortcuts import render
from .utils import *

# Create your views here.
def home(request):
    context = {}
    context['vestibulares'] = get_vestibulares() 
    return render(request, 'home.html', context=context)