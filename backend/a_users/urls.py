from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import verify_token

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),   
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
    path('verify-token/', verify_token, name='verify_token')
]
