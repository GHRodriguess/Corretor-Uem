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
                <span className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">
                    Valor
                </span>
                <span className="text-[10px] text-slate-600">0 – 31</span>
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
                    w-full h-9 rounded-lg bg-slate-900 border border-white/8
                    text-center text-sm font-bold text-white tabular-nums
                    focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all placeholder:text-slate-700
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                "
            />
        </div>
    );
}