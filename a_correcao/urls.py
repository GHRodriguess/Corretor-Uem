from django.urls import path
from . import views

urlpatterns = [
    path("<str:vestibular>", views.correcao, name="correcao"),
]
