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
        <div className="sticky top-4 rounded-2xl bg-slate-900/80 border border-white/8 p-5 space-y-4 backdrop-blur-sm shadow-xl shadow-black/40">
            <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                    Pontuação
                </p>
                <div className="flex items-end gap-1.5">
                    <span className={`text-4xl font-black tabular-nums leading-none text-indigo-400`}>
                        {total.toFixed(total % 1 === 0 ? 0 : 2)}
                    </span>
                    <span className="text-slate-600 text-sm mb-0.5">/ {maxPossivel}</span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 bg-indigo-500`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-slate-600">
                    <span>{respondidas}/{questoes.length} respondidas</span>
                    <span>{pct.toFixed(1)}%</span>
                </div>
            </div>

            <div className="space-y-2 pt-1">
                <div className="flex flex-col justify-between text-xs pb-2 text-slate-500">
                    <span className="text-emerald-400">
                        Você gabaritou: {resumo.acertos} {resumo.acertos == 1 ? "questão" : "questões"}
                    </span>
                    <span className="text-red-400">
                        Você zerou: {resumo.erros} {resumo.erros == 1 ? "questão" : "questões"}
                    </span>
                </div>
                {!revealed ? (
                    <button
                        onClick={onReveal}
                        className="w-full cursor-pointer py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20"
                    >
                        Ver Gabarito
                    </button>
                ) : (
                    <button 
                        onClick={onReveal}
                        className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold justify-center py-2 w-full rounded-xl transition-all  text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                        Esconder Gabarito
                    </button>
                )}
                <button
                    onClick={onReset}
                    className="w-full cursor-pointer py-2.5 rounded-xl text-xs font-semibold text-slate-500 border border-white/6 hover:text-slate-300 hover:border-white/12 transition-all"
                >
                    Limpar Respostas
                </button>
            </div>
        </div>
    );
}