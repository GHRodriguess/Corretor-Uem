from django.http import JsonResponse

# Create your views here.
def vestibulares(request, limit=None):
    #vestibulares = Vestibular.objects.all()[:limit] if limit else Vestibular.objects.all()
    vestibulares = ['vestibular de inverno 2025', 'vestibular de verao 2024', 'vestibular de inverno 2024']    
    if limit:
        vestibulares = vestibulares[:limit]
        
    
    return JsonResponse({'vestibulares': vestibulares}, safe=False)

def pas(request, limit=None):
    #pas = Pas.objects.all()[:limit] if limit else Pas.objects.all()
    pas = ['pas 2025', 'pas 2024', 'pas 2023']
    if limit:
        pas = pas[:limit]
    
    return JsonResponse({'pas': pas}, safe=False)