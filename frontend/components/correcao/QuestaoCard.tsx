"use client";

import { Questao } from "../../types/questao";
import { BitmaskSelector } from "./BitmaskSelector";
import { SimpleSelector } from "./Simpleselector";
import { calcularPontuacao, alternativasCorretas, decodeBitmask } from "../../lib/scoring";

type Modo = "padrao" | "simplificada";

interface QuestaoCardProps {
    questao: Questao;
    marcado: number;
    modo: Modo;
    onMarcacaoChange: (numero: number, value: number) => void;
    revealed: boolean;
}

export function QuestaoCard({
    questao,
    marcado,
    modo,
    onMarcacaoChange,
    revealed,
}: QuestaoCardProps) {
    const pontos = calcularPontuacao(questao.resposta, marcado, questao.anulada);    
    const maxPontos = 6;
    const ratio = pontos / maxPontos;

    const pontoColor =
        questao.anulada
            ? "text-amber-400"
            : ratio === 1
            ? "text-emerald-400"
            : ratio > 0
            ? "text-indigo-400"
            : marcado === 0
            ? "text-slate-600"
            : "text-red-400";

    const cardBorder =
        !revealed || marcado === 0
            ? "border-white/6"
            : questao.anulada
            ? "border-amber-500/30"
            : ratio === 1
            ? "border-emerald-500/20"
            : ratio > 0
            ? "border-indigo-500/20"
            : "border-red-500/20";

    const cardGlow =
        !revealed || marcado === 0
            ? ""
            : questao.anulada
            ? "shadow-amber-500/5"
            : ratio === 1
            ? "shadow-emerald-500/5"
            : ratio > 0
            ? "shadow-indigo-500/5"
            : "shadow-red-500/5";

    return (
        <div
            className={`
                relative rounded-2xl bg-slate-900/60 border p-4 space-y-3
                shadow-lg transition-all duration-300
                ${cardBorder} ${cardGlow}
            `}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Questão {questao.numero}
                    </span>
                    {questao.anulada && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold uppercase tracking-wide">
                            Anulada
                        </span>
                    )}
                    {questao.idioma && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold uppercase tracking-wide">
                            Idioma
                        </span>
                    )}
                </div>

                {/* Pontuação */}
                <div className="text-right">
                    <span className={`text-base font-bold tabular-nums transition-colors ${pontoColor}`}>
                        {revealed || questao.anulada ? pontos.toFixed(pontos % 1 === 0 ? 0 : 2) : "—"}
                    </span>
                    <span className="text-slate-600 text-xs"> / 6</span>
                </div>
            </div>

            {/* Selector */}
            {questao.anulada ? (
                <div className="flex items-center justify-center h-9 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <span className="text-xs text-amber-500/70">Pontuação automática</span>
                </div>
            ) : modo === "padrao" ? (
                <BitmaskSelector
                    value={marcado}
                    onChange={(v) => onMarcacaoChange(questao.numero, v)}
                />
            ) : (
                <SimpleSelector
                    value={marcado}
                    onChange={(v) => onMarcacaoChange(questao.numero, v)}
                />
            )}

            {/* Gabarito revelado */}
            {revealed && !questao.anulada && (
                <div className="pt-1 border-t border-white/5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-600 uppercase tracking-widest">
                            Gabarito
                        </span>
                        <div className="flex gap-1">
                            {alternativasCorretas(questao.resposta).length === 0 ? (
                                <span className="text-xs text-slate-500">Nenhuma (resposta 0)</span>
                            ) : (
                                alternativasCorretas(questao.resposta).map((b) => {
                                    const marcouEste = (marcado & b) !== 0;
                                    return (
                                        <span
                                            key={b}
                                            className={`text-xs px-1.5 py-0.5 rounded font-bold border ${
                                                marcouEste
                                                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                                    : "bg-slate-800 border-white/8 text-slate-500"
                                            }`}
                                        >
                                            {b}
                                        </span>
                                    );
                                })
                            )}
                        </div>
                        <span className="text-md  text-slate-600 ml-auto tabular-nums">
                            = {questao.resposta}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}