export interface GabaritoIdioma {
    id?: number;
    idioma: string;
    resposta: number;
    anulada: boolean;
}

export interface QuestaoAPI {
    id?: number;
    vestibular: number;
    numero: number;
    anulada: boolean;
    resposta_geral: number | null;
    gabaritos_idioma?: GabaritoIdioma[];
}