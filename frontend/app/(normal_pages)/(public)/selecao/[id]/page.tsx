"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Loader2,
    Globe,
    Layers,
    ChevronRight,
    SlidersHorizontal,
    HelpCircle,
    X,
} from "lucide-react";
import Link from "next/link";
import { Vestibular } from "@/types/vestibular";



type Idioma = "ingles" | "espanhol" | "frances";
type ModoCorrecao = "padrao" | "simplificada";

const IDIOMAS: { value: Idioma; label: string; flag: string }[] = [
    { value: "ingles", label: "Inglês", flag: "🇬🇧" },
    { value: "espanhol", label: "Espanhol", flag: "🇪🇸" },
    { value: "frances", label: "Francês", flag: "🇫🇷" },
];

const MODOS: {
    value: ModoCorrecao;
    label: string;
    desc: string;
}[] = [
    {
        value: "padrao",
        label: "Padrão",
        desc: "Você seleciona os itens marcados clicando nos botões de valor (1, 2, 4, 8, 16). A soma dos botões selecionados forma a resposta. Ex: marcar 1 + 2 + 4 + 8 = 15.",
    },
    {
        value: "simplificada",
        label: "Simplificada",
        desc: "Você digita diretamente o valor numérico da soma (de 0 a 31). Ex: se marcou os itens que somam 15, basta escrever 15.",
    },
];

function TooltipModal({
    onClose,
}: {
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div
                className="relative bg-[#111827] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-black/60"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <h3 className="text-white font-bold text-base mb-4">
                    Modos de Correção
                </h3>

                <div className="space-y-4">
                    {MODOS.map((m) => (
                        <div key={m.value} className="space-y-1">
                            <p className="text-indigo-400 text-sm font-semibold">
                                {m.label}
                            </p>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {m.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-5 p-3 rounded-xl bg-slate-900/80 border border-white/5">
                    <p className="text-xs text-slate-500 leading-relaxed">
                        O sistema de pontuação PAS usa bitmask — cada item vale uma
                        potência de 2 (1, 2, 4, 8, 16), e a soma indica quais itens
                        foram marcados.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SelecaoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();

    const [vestibular, setVestibular] = useState<Vestibular | null>(null);
    const [series, setSeries] = useState<Vestibular[]>([]);
    const [loading, setLoading] = useState(true);

    const [serieSelecionada, setSerieSelecionada] = useState<Vestibular | null>(null);
    const [idioma, setIdioma] = useState<Idioma | null>(null);
    const [modo, setModo] = useState<ModoCorrecao | null>("padrao");
    const [tooltipAberto, setTooltipAberto] = useState(false);

    useEffect(() => {
        async function load() {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/${id}/`, {
                    next: { revalidate: 60 },
                }
            );

            if (!res.ok) {
                router.replace("/")
                return;
            }
            
            const v: Vestibular = await res.json();
            if (!v.com_gabarito) {
                router.replace("/");
                return;
            }           

            setVestibular(v);

            if (v.tipo === "pas") {
                const rSeries = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/?nome=${encodeURIComponent(v.nome)}&ano=${v.ano}&tipo=pas`,
                );
                const data = await rSeries.json();
                const lista: Vestibular[] = Array.isArray(data)
                    ? data
                    : data.results ?? [];
                const sorted = lista.sort((a, b) => Number(a.serie ?? 0) - Number(b.serie ?? 0));
                setSeries(sorted);
            }

            setLoading(false);
        }
        load();
    }, [id]);

    function handleConfirmar() {
        if (!idioma || !modo) return;

        const destino =
            vestibular?.tipo === "pas" ? serieSelecionada?.id : vestibular?.id;

        // Salva o modo no sessionStorage para não expor na URL
        sessionStorage.setItem("modoCorrecao", modo);

        router.push(`/vestibular/${destino}?idioma=${idioma}`);
    }

    const isPas = vestibular?.tipo === "pas";
    const podeConfirmar =
        idioma !== null && modo !== null && (!isPas || serieSelecionada !== null);

    if (loading || !vestibular) {
        return (
            <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full bg-[#0a0c14]">
            {tooltipAberto && (
                <TooltipModal onClose={() => setTooltipAberto(false)} />
            )}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-indigo-600/10 blur-[100px]" />
            </div>

            <div className="relative container mx-auto px-4 py-10 max-w-lg">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8 group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    Voltar
                </Link>

                <div className="mb-10">
                    <h1 className="text-white text-3xl font-bold tracking-tight">
                        {vestibular.nome}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 capitalize">
                        {vestibular.tipo} · {vestibular.ano}
                    </p>
                </div>

                <div className="space-y-8">
                    {isPas && (
                        <div className="space-y-3">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <Layers className="h-4 w-4 text-slate-600" />
                                Série
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {series.map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setSerieSelecionada(s)}
                                        className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                                            serieSelecionada?.id === s.id
                                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                                : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                                        }`}
                                    >
                                        {s.serie}ª Série
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            <Globe className="h-4 w-4 text-slate-600" />
                            Idioma
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {IDIOMAS.map((i) => (
                                <button
                                    key={i.value}
                                    type="button"
                                    onClick={() => setIdioma(i.value)}
                                    className={`py-3 px-2 rounded-xl text-sm font-semibold border transition-all flex flex-col items-center gap-1.5 ${
                                        idioma === i.value
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                            : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                                    }`}
                                >
                                    <span className="text-xl">{i.flag}</span>
                                    <span>{i.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            <SlidersHorizontal className="h-4 w-4 text-slate-600" />
                            Modo de Correção
                            <button
                                type="button"
                                onClick={() => setTooltipAberto(true)}
                                className="ml-0.5 text-slate-600 hover:text-indigo-400 transition-colors"
                                aria-label="Saiba mais sobre os modos de correção"
                            >
                                <HelpCircle className="h-3.5 w-3.5" />
                            </button>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {MODOS.map((m) => (
                                <button
                                    key={m.value}
                                    type="button"
                                    onClick={() => setModo(m.value)}
                                    className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all text-left ${
                                        modo === m.value
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                            : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleConfirmar}
                        disabled={!podeConfirmar}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
                    >
                        Iniciar Correção
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}