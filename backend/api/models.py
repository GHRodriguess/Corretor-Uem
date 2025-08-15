from django.db import models

# Create your models here.
class Vestibular(models.Model):
    nome = models.CharField(max_length=100)
    ano = models.IntegerField()
    
    def __str__(self):
        return f"{self.nome} {self.ano}"

    class Meta:
        verbose_name = "Vestibular"
        verbose_name_plural = "Vestibulares"
        unique_together = ('nome', 'ano') 

class Questao(models.Model):
    vestibular = models.ForeignKey(
        Vestibular, 
        on_delete=models.CASCADE, 
        related_name='questoes'
    )
    
    numero = models.IntegerField()   
    resposta_geral = models.IntegerField(null=True)
    eh_idioma = models.BooleanField(default=False)
    
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
