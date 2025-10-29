from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
class Vestibular(models.Model):
    TIPO_CHOICES = [
        ('vestibular', 'VESTIBULAR'),
        ('pas', 'PAS'),        
    ]
    
    nome = models.CharField(max_length=100)
    ano = models.IntegerField()
    tipo = models.CharField(max_length=50 ,choices=TIPO_CHOICES, default='VESTIBULAR')
    serie = models.IntegerField(null=True, blank=True) 
    ativo = models.BooleanField(default=True) 
    
    def __str__(self):
        if self.tipo == "PAS":
            return f"{self.nome} {self.ano} ({self.get_tipo_display()} {self.serie})"
        return f"{self.nome} {self.ano} ({self.get_tipo_display()})"

    def clean(self):
        if self.tipo == "pas" and self.serie not in [1, 2, 3]:
            raise ValidationError({'serie': "Para o tipo PAS, a série deve ser 1, 2 ou 3."})
        
        if self.tipo == "vestibular" and self.serie is not None:
            raise ValidationError({'serie': "O tipo Vestibular não pode ter uma série associada."})

    class Meta:
        verbose_name = "Vestibular"
        verbose_name_plural = "Vestibulares"
        unique_together = ('nome', 'ano', 'serie') 

class Questao(models.Model):
    vestibular = models.ForeignKey(
        Vestibular, 
        on_delete=models.CASCADE, 
        related_name='questoes'
    )
    
    numero = models.IntegerField()   
    resposta_geral = models.IntegerField(null=True, blank=True)
    eh_idioma = models.BooleanField(default=False)
    anulada = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Questão {self.numero} - {self.vestibular}"

    class Meta:
        verbose_name = "Questão"
        verbose_name_plural = "Questões"
        unique_together = ('vestibular', 'numero') 
        
class GabaritoIdioma(models.Model):
    questao = models.ForeignKey(
        Questao, 
        on_delete=models.CASCADE, 
        related_name='gabaritos_idioma'
    )
    
    idioma = models.CharField(max_length=20)
    resposta_idioma = models.IntegerField(null=True)
    
    def __str__(self):
        return f"Gabarito de {self.idioma} para Questão {self.questao.numero}"

    class Meta:
        verbose_name = "Gabarito de Idioma"
        verbose_name_plural = "Gabaritos de Idiomas"
        unique_together = ('questao', 'idioma')
