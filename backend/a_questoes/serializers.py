from rest_framework import serializers
from .models import Questao, QuestaoIdioma


class QuestaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questao
        fields = "__all__"
        
    def validate(self, data):
        resposta_geral = data.get('resposta_geral')
        is_idioma = data.get("is_idioma")
        if resposta_geral and is_idioma:
            raise serializers.ValidationError(
                "Não é possível criar gabarito de idioma para uma questão comum."
            )
        return data


class QuestaoIdiomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestaoIdioma
        fields = "__all__"
        
    
    def validate(self, data):
        questao = data.get('questao')
        if questao and not questao.is_idioma:
            raise serializers.ValidationError(
                "Não é possível criar gabarito de idioma para uma questão comum."
            )
        return data

