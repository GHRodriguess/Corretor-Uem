export interface QuestaoForm {
    numero: number;
    anulada: boolean;       
    is_idioma: boolean;
    resposta_geral: number | "";
    ingles: number | "";
    espanhol: number | "";
    frances: number | "";
    anulada_ingles: boolean;
    anulada_espanhol: boolean;
    anulada_frances: boolean;
}