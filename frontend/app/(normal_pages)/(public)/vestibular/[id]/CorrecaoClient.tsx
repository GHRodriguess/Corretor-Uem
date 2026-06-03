"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Questao } from "@/types/questao";
import { QuestaoCard } from "@/components/correcao/QuestaoCard";
import { ScorePanel } from "@/components/correcao/ScorePanel";
import { ModoToggle } from "@/components/correcao/ModoToggle";
import { calcularPontuacao } from "@/lib/scoring";

type Modo = "padrao" | "simplificada";

export function CorrecaoClient({ questoes }: { questoes: Questao[] }) {
    const [modo, setModo] = useState<Modo>("padrao");
    const [marcacoes, setMarcacoes] = useState<Record<number, number>>({});
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const saved = sessionStorage.getItem("modoCorrecao") as Modo | null;
        if (saved === "padrao" || saved === "simplificada") {
            setTimeout(() => {
                setModo(saved);
            }, 0);
        }
    }, []);

    const handleMarcacao = useCallback((numero: number, value: number) => {
        setMarcacoes((prev) => ({ ...prev, [numero]: value }));
    }, []);

    const handleReset = useCallback(() => {
        setMarcacoes({});
        setRevealed(false);
    }, []);

    const handleModoChange = (novoModo: Modo) => {
        setModo(novoModo);
        sessionStorage.setItem("modoCorrecao", novoModo);
    };


    return (
        <div className="relative min-h-screen py-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-indigo-600/5 dark:bg-indigo-600/8 blur-[120px]" />
            </div>

            <div className="relative container mx-auto px-4 max-w-5xl z-10">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        Voltar
                    </Link>

                    <ModoToggle modo={modo} onChange={handleModoChange} />
                </div>

                <div className="flex gap-6 items-start">
                    <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[...questoes]
                                .sort((a, b) => a.numero - b.numero)
                                .map((q) => (
                                    <QuestaoCard
                                        key={q.numero}
                                        questao={q}
                                        marcado={marcacoes[q.numero] ?? 0}
                                        modo={modo}
                                        onMarcacaoChange={handleMarcacao}
                                        revealed={revealed}
                                    />
                                ))}
                        </div>
                    </div>

                    <div className="hidden lg:block w-56 shrink-0">
                        <ScorePanel
                            questoes={questoes}
                            marcacoes={marcacoes}
                            revealed={revealed}
                            onReveal={() => setRevealed(!revealed)}
                            onReset={handleReset}
                        />
                    </div>
                </div>

                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 bg-linear-to-t from-background via-background/90 to-transparent">
                    <div className="rounded-2xl bg-card/95 border border-border px-4 py-3 backdrop-blur-md shadow-2xl shadow-indigo-950/10">
                        <MobileSummary
                            questoes={questoes}
                            marcacoes={marcacoes}
                            revealed={revealed}
                            onReveal={() => setRevealed(!revealed)}
                            onReset={handleReset}
                        />
                    </div>
                </div>

                <div className="lg:hidden h-28" />
            </div>
        </div>
    );
}

function MobileSummary({
    questoes,
    marcacoes,
    revealed,
    onReveal,
    onReset,
}: {
    questoes: Questao[];
    marcacoes: Record<number, number>;
    revealed: boolean;
    onReveal: () => void;
    onReset: () => void;
}) {
    const total = questoes.reduce(
        (acc, q) =>
            acc +
            calcularPontuacao(q.resposta, marcacoes[q.numero] ?? 0, q.anulada),
        0,
    );

    const resumo = questoes.reduce(
        (acc, q) => {
            const pontos = calcularPontuacao(
                q.resposta,
                marcacoes[q.numero] ?? 0,
                q.anulada,
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
        },
    );
    const max = questoes.length * 6;

    return (
        <div>
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                        Pontuação
                    </p>
                    <p
                        className="text-xl font-black tabular-nums leading-tight text-indigo-500 dark:text-indigo-400"
                    >
                        {total.toFixed(total % 1 === 0 ? 0 : 2)}
                        <span className="text-muted-foreground/60 text-xs font-normal">
                            {" "}
                            / {max}
                        </span>
                    </p>
                </div>
                <div className="flex gap-2">
                    {!revealed ? (
                        <button
                            onClick={onReveal}
                            className="px-3 py-2 cursor-pointer rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10 transition-all"
                        >
                            Ver Gabarito
                        </button>
                    ) : (
                        <button
                            onClick={onReveal}
                            className="px-3 py-2 cursor-pointer rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 transition-all"
                        >
                            Esconder Gabarito
                        </button>
                    )}
                    <button
                        onClick={onReset}
                        className="px-3 py-2 cursor-pointer rounded-xl text-xs font-bold text-muted-foreground border border-border/85 hover:text-foreground hover:bg-muted/50 transition-all"
                    >
                        Limpar
                    </button>
                </div>
            </div>
            <div className="mt-2">
                <div className="flex flex-col gap-2 text-xs mt-1">
                    <span className="text-emerald-400 font-semibold">                        
                        Você gabaritou: {resumo.acertos} {resumo.acertos == 1 ? "questão" : "questões"}
                        
                    </span>
                    <span className="text-red-400 font-semibold">
                        Você zerou: {resumo.erros} {resumo.erros == 1 ? "questão" : "questões"}

                    </span>
                </div>
            </div>
        </div>
    );
}
