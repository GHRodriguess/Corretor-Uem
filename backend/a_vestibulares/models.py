from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Vestibular(models.Model):
    TIPO_CHOICES = [
        ('vestibular', 'VESTIBULAR'),
        ('pas', 'PAS'),        
    ]
    
    nome = models.CharField(max_length=100, null=False, blank=False)
    ano = models.IntegerField(validators=[MinValueValidator(2000), MaxValueValidator(2030)])
    tipo = models.CharField(max_length=50 ,choices=TIPO_CHOICES, default='VESTIBULAR')
    serie = models.IntegerField(null=True, blank=True) 
    
    com_gabarito = models.BooleanField(default=False)
    imagem = models.ImageField(upload_to='vestibulares/', null=True, blank=True)

    
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
