"use client";

interface SimpleSelectorProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export function SimpleSelector({ value, onChange, disabled }: SimpleSelectorProps) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const v = Math.min(31, Math.max(0, Number(e.target.value)));
        onChange(isNaN(v) ? 0 : v);
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
                    Valor
                </span>
                <span className="text-[10px] text-muted-foreground/50">0 – 31</span>
            </div>
            <input
                type="number"
                min={0}
                max={31}
                value={value === 0 ? "" : value}
                placeholder="0"
                disabled={disabled}
                onChange={handleChange}
                className="
                    w-full h-9 rounded-lg bg-background border border-border
                    text-center text-sm font-bold text-foreground tabular-nums
                    focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all placeholder:text-muted-foreground/30
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                "
            />
        </div>
    );
}