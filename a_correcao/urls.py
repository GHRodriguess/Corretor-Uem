from django.urls import path
from . import views, htmxviews

urlpatterns = [
    path("<str:vestibular>", views.correcao, name="correcao"),
    path('<str:vestibular>/questions', htmxviews.questions, name="questions")
    
]