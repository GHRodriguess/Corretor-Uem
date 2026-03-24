from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VestibularViewset 

router = DefaultRouter()
router.register(r'vestibulares', VestibularViewset, basename='vestibular')

urlpatterns = [
    path('', include(router.urls)),
]