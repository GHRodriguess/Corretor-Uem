import os
from utils.global_utils import *

class Vestibular():
    def __init__(self, vestibular):        
        self.base_dir = base_dir()
        self.vestibular = self.define_vestibular(vestibular)       
        
    
    def define_vestibular(self, vestibular):
        vestibulares = os.listdir(self.base_dir)
        for v in vestibulares : 
            if vestibular in v:
                return v

    def verifica_gabarito(self):
        return True if os.path.exists(os.path.join(self.base_dir, self.vestibular, "GABARITOS")) and len(os.listdir(os.path.join(self.base_dir, self.vestibular, "GABARITOS"))) >= 1 else False

    def define_serie_necessaria(self):
        return True if "PAS" in self.vestibular else False

    def define_gabarito(self, lingua, serie=None):
        self.gabarito = []
        linguas = {
            "en": "Inglês",
            "es": "Espanhol",
            "fr": "Francês"
        }
        lingua = linguas[lingua]
        if "PAS" in self.vestibular:
            with open(os.path.join(self.base_dir, self.vestibular, "GABARITOS", serie, f"Gabarito {serie}º Ano.txt"), "r") as arquivo:
                conteudo = arquivo.read()
                conteudo = conteudo.split("\n")
                self.gabarito.extend(conteudo)
            with open(os.path.join(self.base_dir, self.vestibular, "GABARITOS", serie, "LINGUAS", f"{lingua}.txt"), "r") as arquivo:
                conteudo = arquivo.read()
                conteudo = conteudo.split("\n")
                self.gabarito.extend(conteudo)
        else:
            with open(os.path.join(self.base_dir, self.vestibular, "GABARITOS", f"Gabarito.txt"), "r") as arquivo:
                conteudo = arquivo.read()
                conteudo = conteudo.split("\n")
                self.gabarito.extend(conteudo)
            with open(os.path.join(self.base_dir, self.vestibular, "GABARITOS", "LINGUAS", f"{lingua}.txt"), "r") as arquivo:
                conteudo = arquivo.read()
                conteudo = conteudo.split("\n")
                self.gabarito = self.gabarito[:10] + conteudo + self.gabarito[10:] 
        self.gabarito = [linha for linha in self.gabarito if linha.strip()]   
        return self.gabarito

def soma_to_list(soma):  
    try:
        return [2**i for i, bit in enumerate(bin(int(soma))[:1:-1]) if bit == "1"]
    except:
        return "ANULADA"

def calcular_nota(alternativas_corretas, alternativas_marcadas):
    nota = 0
    zerou = False
    if not all(alternativas_marcada in alternativas_corretas for alternativas_marcada in alternativas_marcadas):
        nota = 0
        zerou = True
    else:
        num_alternativas_corretas = len(alternativas_corretas)
        num_alternativas_marcadas = len(alternativas_marcadas)
        nota = 6 / num_alternativas_corretas * num_alternativas_marcadas
        nota = round(nota, 1)

    return nota, zerou