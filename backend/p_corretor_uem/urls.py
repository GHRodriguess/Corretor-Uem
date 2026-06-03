from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from a_api.views import ObterTokenPersonalizadoView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('a_api.urls')),
    path('', include('a_vestibulares.urls')),
    path('', include('a_questoes.urls')),
    path('api/auth/login/', ObterTokenPersonalizadoView.as_view(), name='token_obtain_pair'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


