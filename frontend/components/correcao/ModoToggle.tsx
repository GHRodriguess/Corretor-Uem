"use client";

import { SlidersHorizontal, Hash } from "lucide-react";

type Modo = "padrao" | "simplificada";

interface ModoToggleProps {
    modo: Modo;
    onChange: (modo: Modo) => void;
}

export function ModoToggle({ modo, onChange }: ModoToggleProps) {
    return (
        <div className="inline-flex  items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-white/8">
            <button
                type="button"
                onClick={() => onChange("padrao")}
                className={`flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    modo === "padrao"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-500 hover:text-slate-300"
                }`}
            >
                <SlidersHorizontal className="h-3 w-3" />
                Padrão
            </button>
            <button
                type="button"
                onClick={() => onChange("simplificada")}
                className={`flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    modo === "simplificada"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-500 hover:text-slate-300"
                }`}
            >
                <Hash className="h-3 w-3" />
                Simplificada
            </button>
        </div>
    );
}