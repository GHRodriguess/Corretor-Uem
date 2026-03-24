export interface Vestibular {
    id: number;
    nome: string;
    ano: number;
    tipo: "vestibular" | "pss" | string;
    serie: string | null;
    com_gabarito: boolean;
    imagem: string;
}
