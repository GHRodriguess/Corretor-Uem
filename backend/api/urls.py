from django.urls import path
from .views import *

urlpatterns = [
    path('vestibulares', vestibulares, name='vestibulares'),    
    path('vestibulares/<int:limit>', vestibulares, name='vestibulares'),
    path('pas', pas, name='pas'),
    path('pas/<int:limit>', pas, name='pas'),
]
