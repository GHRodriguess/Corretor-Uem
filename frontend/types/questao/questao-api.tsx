export interface QuestaoAPI {
    id?: number;
    vestibular: number;
    numero: number;
    anulada: boolean;
    resposta_geral: number | null;
    gabaritos_idioma?: { idioma: string; resposta: number }[];
}