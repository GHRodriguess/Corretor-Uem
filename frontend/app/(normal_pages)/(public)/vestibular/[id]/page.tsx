"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { Questao } from "@/types/questao";
import { QuestaoCard } from "@/components/correcao/QuestaoCard";
import { ScorePanel } from "@/components/correcao/ScorePanel";
import { ModoToggle } from "@/components/correcao/ModoToggle";

type Modo = "padrao" | "simplificada";

export default function CorrecaoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const idioma = searchParams.get("idioma") ?? "ingles";

    const [questoes, setQuestoes] = useState<Questao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modo vem do sessionStorage (definido na página anterior), mas pode ser trocado aqui
    const [modo, setModo] = useState<Modo>("padrao");

    // marcacoes: numero da questão → valor bitmask marcado pelo usuário
    const [marcacoes, setMarcacoes] = useState<Record<number, number>>({});
    const [revealed, setRevealed] = useState(false);

    // Lê o modo salvo no sessionStorage
    useEffect(() => {
        const saved = sessionStorage.getItem("modoCorrecao") as Modo | null;
        if (saved === "padrao" || saved === "simplificada") {
            setModo(saved);
        }
    }, []);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/questoes/gabarito/?idioma=${idioma}&vestibular_id=${id}`,
                );
                if (!res.ok) throw new Error(`Erro ${res.status}`);
                const data: Questao[] = await res.json();
                setQuestoes(data);
            } catch (e: any) {
                setError(e.message ?? "Erro ao carregar questões");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, idioma]);

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

    if (loading) {
        return (
            <div className="h-full bg-[#0a0c14] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                    <p className="text-slate-500 text-sm">
                        Carregando questões…
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full bg-[#0a0c14] flex items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-red-400 text-sm font-semibold">
                        {error}
                    </p>
                    <Link
                        href="/"
                        className="text-slate-500 text-xs hover:text-slate-300 underline underline-offset-4"
                    >
                        Voltar ao início
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0c14]">
            {/* Ambient glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-indigo-600/8 blur-[120px]" />
            </div>

            <div className="relative container mx-auto px-4 py-10 max-w-5xl">
                {/* Topbar */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        Voltar
                    </Link>

                    <ModoToggle modo={modo} onChange={handleModoChange} />
                </div>

                {/* Layout principal */}
                <div className="flex gap-6 items-start">
                    {/* Questões em ordem */}
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

                    {/* Painel lateral sticky */}
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

                {/* Painel mobile (fixado no rodapé) */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 bg-linear-to-t from-[#0a0c14] to-transparent">
                    <div className="rounded-2xl bg-slate-900/95 border border-white/8 px-4 py-3 backdrop-blur-sm shadow-2xl shadow-black/60">
                        <MobileSummary
                            questoes={questoes}
                            marcacoes={marcacoes}
                            revealed={revealed}
                            onReveal={() => setRevealed(!revealed)}
                            onReset={handleReset}
                        />
                    </div>
                </div>

                {/* Espaço no mobile para não cobrir últimas questões */}
                <div className="lg:hidden h-28" />
            </div>
        </div>
    );
}

import { calcularPontuacao } from "@/lib/scoring";

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
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Pontuação
                    </p>
                    <p
                        className={`text-xl font-black tabular-nums leading-tight text-indigo-400`}
                    >
                        {total.toFixed(total % 1 === 0 ? 0 : 2)}
                        <span className="text-slate-600 text-xs font-normal">
                            {" "}
                            / {max}
                        </span>
                    </p>
                </div>
                <div className="flex gap-2">
                    {!revealed ? (
                        <button
                            onClick={onReveal}
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
                        >
                            Ver Gabarito
                        </button>
                    ) : (
                        <button
                            onClick={onReveal}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 transition-all"
                        >
                            Esconder Gabarito
                        </button>
                    )}
                    <button
                        onClick={onReset}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 border border-white/8 hover:text-slate-300 transition-all"
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
