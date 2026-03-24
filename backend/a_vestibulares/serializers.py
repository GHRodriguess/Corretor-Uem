from rest_framework import serializers
from .models import Vestibular

class VestibularSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vestibular
        fields = "__all__"
        