export const BITS = [1, 2, 4, 8, 16] as const;
export type Bit = (typeof BITS)[number];

/** Decodifica um valor bitmask nas alternativas marcadas */
export function decodeBitmask(value: number): Bit[] {
    return BITS.filter((b) => (value & b) !== 0);
}

/** Alternativas corretas a partir da resposta */
export function alternativasCorretas(resposta: number): Bit[] {
    return decodeBitmask(resposta);
}


export function calcularPontuacao(
    resposta: number,
    marcado: number,
    anulada: boolean,
): number {
    if (anulada) return 6;
    if (resposta === 0) return marcado === 0 ? 6 : 0;
    if (marcado === 0) return 0;

    const corretas = alternativasCorretas(resposta);
    const marcados = decodeBitmask(marcado);

    const errou = marcados.some((b) => !corretas.includes(b));
    if (errou) return 0;

    const valorPorAlternativa = 6 / corretas.length;
    const acertos = marcados.filter((b) => corretas.includes(b)).length;
    return parseFloat((valorPorAlternativa * acertos).toFixed(2));
}
