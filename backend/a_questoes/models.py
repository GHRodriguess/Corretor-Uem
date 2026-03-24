from django.db import models
from a_vestibulares.models import Vestibular
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError


# Create your models here.
class Questao(models.Model):
    vestibular = models.ForeignKey(
        Vestibular, on_delete=models.CASCADE, related_name="questoes"
    )
    numero = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(50)]
    )
    anulada = models.BooleanField(default=False)

    # None = questão de idioma (sem resposta geral)
    resposta_geral = models.IntegerField(
        null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(31)]
    )

    @property
    def is_idioma(self):
        return self.resposta_geral is None

    def get_resposta(self, idioma=None):
        if self.is_idioma:
            if idioma is None:
                raise ValueError("Questão de idioma requer o parâmetro 'idioma'")
            gabarito = self.gabaritos_idioma.filter(idioma=idioma).first()
            return gabarito.resposta if gabarito else None
        return self.resposta_geral
    
    def get_anulada(self, idioma=None):
        if self.is_idioma:
            if idioma is None:
                raise ValueError("Questão de idioma requer o parâmetro 'idioma'")
            gabarito = self.gabaritos_idioma.filter(idioma=idioma).first()
            return gabarito.anulada if gabarito else None
        return self.anulada
    
    def clean(self):
        if self.eh_idioma and self.resposta_geral is not None:
            raise ValidationError("Questão de idioma não deve ter resposta geral.")

    def __str__(self):
        return f"Questão {self.numero} - {self.vestibular}"

    class Meta:
        verbose_name = "Questão"
        verbose_name_plural = "Questões"
        unique_together = ("vestibular", "numero")


class QuestaoIdioma(models.Model):
    class Idioma(models.TextChoices):
        INGLES = "ingles", "Inglês"
        ESPANHOL = "espanhol", "Espanhol"
        FRANCES = "frances", "Francês"

    questao = models.ForeignKey(
        Questao, on_delete=models.CASCADE, related_name="gabaritos_idioma"
    )
    anulada = models.BooleanField(default=False)
    idioma = models.CharField(max_length=20, choices=Idioma.choices)
    resposta = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(31)]
    )

    def __str__(self):
        return f"Gabarito {self.get_idioma_display()} — Questão {self.questao.numero}"

    class Meta:
        verbose_name = "Gabarito de Idioma"
        verbose_name_plural = "Gabaritos de Idiomas"
        unique_together = ("questao", "idioma")
