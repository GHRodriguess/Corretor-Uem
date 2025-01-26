from django.urls import path
from . import views, htmxviews

urlpatterns = [
    path("atualiza_nota", htmxviews.atualiza_nota, name="nota"),
    path("mostra_respostas", htmxviews.mostra_respostas, name="mostra_respostas"),
    path("<str:vestibular>", views.correcao, name="correcao"),
    path('<str:vestibular>/questions', htmxviews.questions, name="questions"),
    path("<str:numero_questao>/question", htmxviews.question, name="question"),
    
]