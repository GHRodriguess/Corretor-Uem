from django.urls import path
from .views import *

urlpatterns = [
    # GET
    path('vestibulares', vestibulares, name='vestibulares'),   
    path('vestibulares/update/<int:vestibular_id>/', update_vestibular_status, name='update_vestibular_status'),
    path('vestibulares/<int:limit>', vestibulares, name='vestibulares'),
    path('get_vestibular_by_id/<int:vestibular_id>', get_vestibular_by_id, name='get_vestibular_by_id'),
    path('pas', pas, name='pas'),
    path('pas/<int:limit>', pas, name='pas'),
    path('pas/<str:all_pas>', pas, name='pas'),
    path('pas/<int:year>/<str:serie>', get_id_pas, name='get_id_pas'),
    path('questoes/<int:vestibular_id>', questoes, name='questoes'),
    path('questoes/<int:vestibular_id>/<str:idioma>', questoes, name='questoes'),
    path('questoes/<int:vestibular_id>/<str:idioma>/<int:serie>', questoes, name='questoes'),
    path('questoes/<int:vestibular_id>/<str:idioma>/<str:serie>', questoes, name='questoes'),
    
    # POST 
    path('adiciona_vestibular', adiciona_vestibular, name='adiciona_vestibular'),
    path('salva_gabarito/<int:vestibular_id>', salva_gabarito, name='salva_gabarito'),
    
    #DELETE 
    path('delete/vestibulares/<int:vestibular_id>', delete_vestibular, name='delete_vestibular'),
]