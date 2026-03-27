export function VestibularCardSkeleton() {
    return (
        <div className="rounded-2xl border border-white/5 bg-slate-900/50 overflow-hidden flex flex-col animate-pulse">
            <div className="w-full aspect-video bg-white/5" />
            <div className="p-5 space-y-4">
                <div className="flex gap-2">
                    <div className="h-4 w-12 bg-white/5 rounded" />
                    <div className="h-4 w-12 bg-white/5 rounded" />
                </div>
                <div className="space-y-2">
                    <div className="h-6 w-full bg-white/5 rounded" />
                    <div className="h-6 w-2/3 bg-white/5 rounded" />
                </div>
                <div className="h-10 w-full bg-white/5 rounded-xl mt-4" />
            </div>
        </div>
    );
}