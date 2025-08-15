from django.contrib import admin
from .models import Vestibular, Questao, GabaritoIdioma

@admin.register(Vestibular)
class VestibularAdmin(admin.ModelAdmin):
    list_display = ('nome', 'ano', 'tipo', 'serie')
    search_fields = ('nome', 'ano',)
    list_filter = ('tipo' ,'ano',)
    ordering = ('-ano' , '-nome','-id',)

@admin.register(Questao)
class QuestaoAdmin(admin.ModelAdmin):
    list_display = ('numero', 'vestibular', 'eh_idioma', 'resposta_geral',)
    list_filter = ('vestibular', 'eh_idioma',)
    search_fields = ('numero', 'vestibular__nome',)
    raw_id_fields = ('vestibular',)

@admin.register(GabaritoIdioma)
class GabaritoIdiomaAdmin(admin.ModelAdmin):
    list_display = ('questao', 'idioma', 'resposta_idioma',)
    list_filter = ('idioma',)
    search_fields = ('questao__numero', 'idioma',)
    raw_id_fields = ('questao',)
