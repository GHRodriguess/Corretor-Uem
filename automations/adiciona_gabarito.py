import tabula
import pandas as pd 
import os 

class Adiciona_gabarito():
    def __init__(self): 
        self.link_gabarito = input("Insira o link da tabela do gabarito: ")
        self.caminho_vestibular = self.define_vestibular()
        self.linguas = ["Espanhol", "Francês", "Inglês"]
    
    def define_vestibular(self):
        base_dir_vestibulares = os.path.join("VESTIBULARES")
        vestibulares = os.listdir(base_dir_vestibulares)
        while True:
            for vestibular in vestibulares:
                print(vestibular)
            numero_vesitular = str(input("Insira o número do vestibular no projeto: "))    
            
            if any(numero_vesitular in vestibular for vestibular in vestibulares):
                break 
            else:
                print("Número não está nos vestibulares")

        for vestibular in vestibulares:    
            if vestibular.startswith(numero_vesitular):
                return os.path.join(base_dir_vestibulares, vestibular)
            
    def le_edita_tabela(self):
        tabelas = tabula.read_pdf(self.link_gabarito, pages="all")
        gabaritos = pd.concat([tabela[["Questão", "Resposta"]] for tabela in tabelas], ignore_index=True)
        g_questoes = gabaritos[~gabaritos["Questão"].duplicated(keep=False)]["Resposta"].to_list()
        g_linguas = gabaritos[gabaritos["Questão"].duplicated(keep=False)]["Resposta"].to_list()
        g_questoes = [str(resposta).replace("*", "").strip() for resposta in g_questoes]
        g_linguas = [str(resposta).replace("*", "").strip() for resposta in g_linguas]
        return g_questoes, g_linguas
    
    def salva_gabarito(self, g_questoes, g_linguas):
        os.makedirs(os.path.join(self.caminho_vestibular, "GABARITOS"), exist_ok=True)
        os.makedirs(os.path.join(self.caminho_vestibular, "GABARITOS", "LINGUAS"), exist_ok=True)

        with open(os.path.join(self.caminho_vestibular, "GABARITOS", "Gabarito.txt"), "w") as arquivo:
            for g_questao in g_questoes:
                arquivo.write(f"{g_questao}\n") 
                
        for i, lingua in enumerate(self.linguas):
            with open(os.path.join(self.caminho_vestibular, "GABARITOS", "LINGUAS", f"{lingua}.txt"), "w") as arquivo:
                g_lingua = g_linguas[i*4:i*4+4]
                for g_l in g_lingua:
                    arquivo.write(f"{g_l}\n")
                    
if __name__ == "__main__":
    adiciona_gabarito = Adiciona_gabarito()
    gabarito_questoes, gabarito_linguas = adiciona_gabarito.le_edita_tabela() 
    adiciona_gabarito.salva_gabarito(gabarito_questoes, gabarito_linguas)