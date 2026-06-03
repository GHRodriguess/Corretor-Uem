"use client";

import { BITS, Bit } from "../../lib/scoring";

interface BitmaskSelectorProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export function BitmaskSelector({ value, onChange, disabled }: BitmaskSelectorProps) {
    function toggle(bit: Bit) {
        if (disabled) return;
        onChange(value ^ bit);
    }

    const sum = value;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
                    Soma
                </span>
                <span
                    className={`text-lg font-bold tabular-nums transition-colors ${
                        sum === 0 ? "text-muted-foreground/40" : "text-foreground"
                    }`}
                >
                    {sum}
                </span>
            </div>

            <div className="flex gap-1.5">
                {BITS.map((bit) => {
                    const active = (value & bit) !== 0;
                    return (
                        <button
                            key={bit}
                            type="button"
                            disabled={disabled}
                            onClick={() => toggle(bit)}
                            className={`
                                flex-1 h-9 rounded-lg text-xs font-bold border cursor-pointer transition-all
                                disabled:cursor-not-allowed disabled:opacity-50
                                ${
                                    active
                                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                                        : "bg-background border-border text-muted-foreground hover:border-indigo-500/30 hover:text-foreground hover:bg-muted/40"
                                }
                            `}
                        >
                            {bit}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}