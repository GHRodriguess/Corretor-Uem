from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import ObterTokenPersonalizadoSerializer

def scalar_docs(request):
    return render(request, "scalar.html", {
        "schema_url": "schema" 
    })

class ObterTokenPersonalizadoView(TokenObtainPairView):
    serializer_class = ObterTokenPersonalizadoSerializer
