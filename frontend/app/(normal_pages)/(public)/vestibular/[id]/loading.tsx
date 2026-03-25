import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="h-full bg-[#0a0c14] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                <p className="text-slate-500 text-sm">Carregando questões…</p>
            </div>
        </div>
    );
}