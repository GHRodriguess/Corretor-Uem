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

    def define_gabarito(self, lingua, serie=None, curso=None):
        self.gabarito = []
        linguas = {
            "en": "Inglês",
            "es": "Espanhol",
            "fr": "Francês"
        }
        cursos_especificas = {
            "administracao": "História, Matemática",
            "agronomia": "Biologia, Química",
            "arquitetura e urbanismo": "Arte, Matemática",
            "artes cenicas": "Arte, História",
            "artes visuais": "Arte, História",
            "biomedicina": "Biologia, Química",
            "bioquimica": "Biologia, Química",
            "biotecnologia": "Biologia, Química",
            "ciencia da computacao": "Física, Matemática",
            "ciencias biologicas": "Biologia, Química",
            "ciencias contabeis": "História, Matemática",
            "ciencias economicas": "História, Matemática",
            "ciencias sociais": "História, Sociologia",
            "comunicacao e multimeios": "Arte, Sociologia",
            "design": "Arte, Matemática",
            "direito": "Arte, Sociologia",
            "educacao fisica": "Educação Física, História",
            "enfermagem": "Biologia, Sociologia",
            "engenharia agricola": "Física, Matemática",
            "engenharia ambiental": "Física, Matemática",
            "engenharia civil": "Física, Matemática",
            "engenharia de alimentos": "Física, Química",
            "engenharia de producao": "Física, Matemática",
            "engenharia eletrica": "Física, Matemática",
            "engenharia mecanica": "Física, Matemática",
            "engenharia quimica": "Matemática, Química",
            "engenharia textil": "Matemática, Química",
            "estatistica": "Física, Matemática",
            "farmacia": "Biologia, Química",
            "filosofia": "Filosofia, História",
            "fisica": "Física, Matemática",
            "fisica bach em fisica medica": "Física, Matemática",
            "geografia": "Geografia, Matemática",
            "historia": "Geografia, História",
            "informatica": "Física, Matemática",
            "letras": "Filosofia, História",
            "matematica": "Física, Matemática",
            "medicina": "Biologia, Química",
            "medicina veterinaria": "Biologia, Química",
            "moda": "História, Matemática",
            "musica": "Arte, História",
            "odontologia": "Biologia, Química",
            "pedagogia": "Geografia, História",
            "psicologia": "Biologia, História",
            "quimica": "Matemática, Química",
            "secretariado executivo trilingue": "História, Sociologia",
            "servico social": "História, Sociologia",
            "tecnologia em alimentos": "Física, Química",
            "tecnologia em construcao civil": "Física, Matemática",
            "tecnologia em meio ambiente": "Matemática, Química",
            "zootecnia": "Biologia, Matemática"
        }      
        lingua = linguas[lingua] 
        if "PAS" in self.vestibular:
            if serie == "3":
                with open(os.path.join(self.base_dir, self.vestibular, "GABARITOS", serie, f"Gabarito {serie}º Ano.txt"), "r") as arquivo:
                    conteudo = arquivo.read()
                    conteudo = conteudo.split("\n")
                    self.gabarito.extend(conteudo)
                with open(os.path.join(self.base_dir, self.vestibular, "GABARITOS", serie, "LINGUAS", f"{lingua}.txt"), "r") as arquivo:
                    conteudo = arquivo.read()
                    conteudo = conteudo.split("\n")
                    self.gabarito.extend(conteudo)
                especificas = cursos_especificas[curso].split(",")
                for materia_especifica in especificas:
                    materia_especifica = materia_especifica.strip()
                    print(materia_especifica)
                    with open(os.path.join(self.base_dir, self.vestibular, "GABARITOS", serie, "ESPECÍFICAS", f"{materia_especifica}.txt"), "r") as arquivo:
                        conteudo = arquivo.read()
                        conteudo = conteudo.split("\n")
                        self.gabarito.extend(conteudo)
            else:  
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

def define_classes_alternativas(gabarito, mostra_respostas=False):
    classes = []
    for soma_correta in gabarito:
        if soma_correta == "ANULADA":
            alternativas_corretas = [1,2,4,8,16]
        else:
            alternativas_corretas = soma_to_list(soma_correta)                  
        classe = {}
        for alternativa in [1,2,4,8,16]:   
            classe[alternativa] = f"alternativa {'certa' if alternativa in alternativas_corretas else 'errada'} {'mostra-resposta' if mostra_respostas else ''}"     
        classes.append(classe)
            
    return classes