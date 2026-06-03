"use client";

import { SlidersHorizontal, Hash } from "lucide-react";

type Modo = "padrao" | "simplificada";

interface ModoToggleProps {
    modo: Modo;
    onChange: (modo: Modo) => void;
}

export function ModoToggle({ modo, onChange }: ModoToggleProps) {
    return (
        <div className="inline-flex  items-center gap-1 p-1 rounded-xl bg-muted/80 border border-border/80 backdrop-blur-xs">
            <button
                type="button"
                onClick={() => onChange("padrao")}
                className={`flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    modo === "padrao"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-muted-foreground hover:text-foreground"
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
                        : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <Hash className="h-3 w-3" />
                Simplificada
            </button>
        </div>
    );
}