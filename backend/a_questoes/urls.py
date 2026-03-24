from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestaoViewSet, QuestaoIdiomaViewSet

router = DefaultRouter()
router.register(r'questoes', QuestaoViewSet, basename='questoes')
router.register(r'questoes-idioma', QuestaoIdiomaViewSet, basename='questoes-idioma')

urlpatterns = [
    path('', include(router.urls)),
]