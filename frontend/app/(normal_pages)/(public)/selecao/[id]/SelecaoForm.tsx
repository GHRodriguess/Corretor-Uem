"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, Globe, Layers, ChevronRight,
    SlidersHorizontal, HelpCircle, X,
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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />

            <div
                className="relative bg-card border border-border/80 rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-indigo-950/10 animate-in fade-in-50 zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    <X className="h-4 w-4" />
                </button>

                <h3 className="text-foreground font-extrabold text-lg mb-4">
                    Modos de Correção
                </h3>

                <div className="space-y-4">
                    {MODOS.map((m) => (
                        <div key={m.value} className="space-y-1">
                            <p className="text-indigo-500 dark:text-indigo-400 text-sm font-bold">
                                {m.label}
                            </p>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                {m.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-5 p-3 rounded-2xl bg-muted/50 border border-border/50">
                    <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                        O sistema de pontuação PAS usa bitmask — cada item vale uma
                        potência de 2 (1, 2, 4, 8, 16), e a soma indica quais itens
                        foram marcados.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function SelecaoForm({
    vestibular,
    series,
}: {
    vestibular: Vestibular;
    series: Vestibular[];
}) {
    const router = useRouter();

    const [serieSelecionada, setSerieSelecionada] = useState<Vestibular | null>(null);
    const [idioma, setIdioma] = useState<Idioma | null>(null);
    const [modo, setModo] = useState<ModoCorrecao | null>("padrao");
    const [tooltipAberto, setTooltipAberto] = useState(false);

    function handleConfirmar() {
        if (!idioma || !modo) return;

        const destino =
            vestibular.tipo === "pas" ? serieSelecionada?.id : vestibular.id;

        sessionStorage.setItem("modoCorrecao", modo);
        router.push(`/vestibular/${destino}?idioma=${idioma}`);
    }

    const isPas = vestibular.tipo === "pas";
    const podeConfirmar =
        idioma !== null && modo !== null && (!isPas || serieSelecionada !== null);

    return (
        <div className="relative min-h-screen py-10 overflow-hidden">
            {tooltipAberto && (
                <TooltipModal onClose={() => setTooltipAberto(false)} />
            )}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-indigo-600/5 dark:bg-indigo-600/8 blur-[120px]" />
            </div>

            <div className="relative container mx-auto px-4 max-w-lg z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    Voltar
                </Link>

                <div className="mb-10">
                    <h1 className="text-foreground text-3xl font-extrabold tracking-tight">
                        {vestibular.nome}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2 capitalize font-medium">
                        {vestibular.tipo} · {vestibular.ano}
                    </p>
                </div>

                <div className="space-y-8 bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
                    {isPas && (
                        <div className="space-y-3">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                <Layers className="h-4 w-4 text-indigo-500/80 dark:text-indigo-400/80" />
                                Série
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {series.map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setSerieSelecionada(s)}
                                        className={`py-3 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                                            serieSelecionada?.id === s.id
                                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/15 scale-[1.02]"
                                                : "bg-background border-border text-muted-foreground hover:border-indigo-500/20 hover:bg-muted/40 hover:text-foreground"
                                        }`}
                                    >
                                        {s.serie}ª Série
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <Globe className="h-4 w-4 text-indigo-500/80 dark:text-indigo-400/80" />
                            Idioma
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {IDIOMAS.map((i) => (
                                <button
                                    key={i.value}
                                    type="button"
                                    onClick={() => setIdioma(i.value)}
                                    className={`py-3 px-2 cursor-pointer rounded-2xl text-sm font-bold border transition-all flex flex-col items-center gap-1.5 ${
                                        idioma === i.value
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/15 scale-[1.02]"
                                            : "bg-background border-border text-muted-foreground hover:border-indigo-500/20 hover:bg-muted/40 hover:text-foreground"
                                    }`}
                                >
                                    <span className="text-xl">{i.flag}</span>
                                    <span>{i.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <SlidersHorizontal className="h-4 w-4 text-indigo-500/80 dark:text-indigo-400/80" />
                            Modo de Correção
                            <button
                                type="button"
                                onClick={() => setTooltipAberto(true)}
                                className="ml-1 text-muted-foreground cursor-pointer hover:text-indigo-500 transition-colors"
                                aria-label="Saiba mais sobre os modos de correção"
                            >
                                <HelpCircle className="h-4.5 w-4.5 hover:scale-110 transition-transform" />
                            </button>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {MODOS.map((m) => (
                                <button
                                    key={m.value}
                                    type="button"
                                    onClick={() => setModo(m.value)}
                                    className={`py-3 px-4 cursor-pointer rounded-2xl text-sm font-bold border transition-all text-center ${
                                        modo === m.value
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/15 scale-[1.02]"
                                            : "bg-background border-border text-muted-foreground hover:border-indigo-500/20 hover:bg-muted/40 hover:text-foreground"
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
                        className="w-full cursor-pointer flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white disabled:opacity-45 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20"
                    >
                        Iniciar Correção
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}