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
        pass

def define_gabarito(vestibular):
    pass