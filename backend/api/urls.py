from django.urls import path
from .views import *

urlpatterns = [
    # GET
    path('vestibulares', vestibulares, name='vestibulares'),    
    path('vestibulares/<int:limit>', vestibulares, name='vestibulares'),
    path('pas', pas, name='pas'),
    path('pas/<int:limit>', pas, name='pas'),
    path('questoes/<int:vestibular_id>', questoes, name='questoes'),
    path('questoes/<int:vestibular_id>/<str:idioma>', questoes, name='questoes'),
    
    # POST 
    path('adiciona_vestibular', adiciona_vestibular, name='adiciona_vestibular'),
    path('salva_gabarito/<int:vestibular_id>', salva_gabarito, name='salva_gabarito'),
]

