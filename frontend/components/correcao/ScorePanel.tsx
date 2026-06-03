"use client";

import { Questao } from "../../types/questao";
import { calcularPontuacao } from "../../lib/scoring";

interface ScorePanelProps {
    questoes: Questao[];
    marcacoes: Record<number, number>;
    revealed: boolean;
    onReveal: () => void;
    onReset: () => void;
}

export function ScorePanel({ questoes, marcacoes, revealed, onReveal, onReset }: ScorePanelProps) {
    const total = questoes.reduce((acc, q) => {
        return acc + calcularPontuacao(q.resposta, marcacoes[q.numero] ?? 0, q.anulada);
    }, 0);

    const resumo = questoes.reduce(
    (acc, q) => {
        const pontos = calcularPontuacao(
            q.resposta,
            marcacoes[q.numero] ?? 0,
            q.anulada
        );

        acc.total += pontos;

        if (pontos === 6) acc.acertos++;
        else if (pontos === 0) acc.erros++;

        return acc;
    },
    {
        total: 0,
        acertos: 0,
        erros: 0,
    }
);

    const maxPossivel = questoes.length * 6;
    const respondidas = questoes.filter((q) => (marcacoes[q.numero] ?? 0) > 0 || q.anulada).length;
    const pct = maxPossivel > 0 ? (total / maxPossivel) * 100 : 0;

    return (
        <div className="sticky top-18 rounded-3xl bg-card/45 border border-border/40 p-6 space-y-4 backdrop-blur-xs shadow-xs hover:bg-card/75 transition-all duration-300">
            <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-semibold">
                    Pontuação
                </p>
                <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-black tabular-nums leading-none text-indigo-600 dark:text-indigo-400">
                        {total.toFixed(total % 1 === 0 ? 0 : 2)}
                    </span>
                    <span className="text-muted-foreground/60 text-sm mb-0.5">/ {maxPossivel}</span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500 bg-indigo-600"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground/50">
                    <span>{respondidas}/{questoes.length} respondidas</span>
                    <span>{pct.toFixed(1)}%</span>
                </div>
            </div>

            <div className="space-y-2 pt-1">
                <div className="flex flex-col gap-1 text-xs pb-2 text-muted-foreground/80">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Você gabaritou: {resumo.acertos} {resumo.acertos == 1 ? "questão" : "questões"}
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                        Você zerou: {resumo.erros} {resumo.erros == 1 ? "questão" : "questões"}
                    </span>
                </div>
                {!revealed ? (
                    <button
                        onClick={onReveal}
                        className="w-full cursor-pointer py-2.5 rounded-xl text-xs font-bold bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20"
                    >
                        Ver Gabarito
                    </button>
                ) : (
                    <button 
                        onClick={onReveal}
                        className="flex cursor-pointer items-center gap-1.5 text-xs font-bold justify-center py-2.5 w-full rounded-xl transition-all text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                        Esconder Gabarito
                    </button>
                )}
                <button
                    onClick={onReset}
                    className="w-full cursor-pointer py-2.5 rounded-xl text-xs font-bold text-muted-foreground border border-border/80 hover:text-foreground hover:bg-muted/50 transition-all"
                >
                    Limpar Respostas
                </button>
            </div>
        </div>
    );
}