export default function Loading() {
    const MOCK_COUNT = 40;

    return (
        <div className="min-h-screen bg-background">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="relative container mx-auto px-4 py-10 max-w-5xl">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                    <div className="h-4 w-16 rounded-md bg-muted animate-pulse" />
                    <div className="h-8 w-44 rounded-xl bg-muted animate-pulse" />
                </div>

                <div className="flex gap-6 items-start">
                    <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Array.from({ length: MOCK_COUNT }).map((_, i) => (
                                <QuestaoCardSkeleton key={i} index={i} />
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:block w-56 shrink-0">
                        <ScorePanelSkeleton />
                    </div>
                </div>

                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 bg-linear-to-t from-background to-transparent">
                    <div className="rounded-2xl bg-card border border-border px-4 py-3 backdrop-blur-sm shadow-2xl">
                        <MobileSummarySkeleton />
                    </div>
                </div>

                <div className="lg:hidden h-28" />
            </div>
        </div>
    );
}

function QuestaoCardSkeleton({ index }: { index: number }) {
    const delay = `${(index % 5) * 80}ms`;

    return (
        <div
            className="rounded-2xl border border-border bg-card/60 p-4 space-y-3"
            style={{ animationDelay: delay }}
        >
            <div className="flex items-center justify-between">
                <div
                    className="h-3.5 w-20 rounded-md bg-muted animate-pulse"
                    style={{ animationDelay: delay }}
                />
                {index % 7 === 0 && (
                    <div
                        className="h-4 w-12 rounded-full bg-muted animate-pulse"
                        style={{ animationDelay: delay }}
                    />
                )}
            </div>

            <div className="flex gap-1.5">
                {["A", "B", "C", "D", "E"].map((_, j) => (
                    <div
                        key={j}
                        className="h-8 flex-1 rounded-lg bg-muted animate-pulse"
                        style={{ animationDelay: `${(index % 5) * 80 + j * 30}ms` }}
                    />
                ))}
            </div>
        </div>
    );
}

function ScorePanelSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-4 sticky top-6">
            <div className="h-3 w-20 rounded-md bg-muted animate-pulse" />

            <div className="space-y-1">
                <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
                <div className="h-2.5 w-16 rounded-md bg-muted animate-pulse" />
            </div>

            <div className="h-1.5 w-full rounded-full bg-muted animate-pulse overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-muted/80 animate-pulse" />
            </div>

            <div className="space-y-2">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="h-3 w-16 rounded-md bg-muted animate-pulse" />
                        <div className="h-3 w-6 rounded-md bg-muted animate-pulse" />
                    </div>
                ))}
            </div>

            <div className="space-y-2 pt-1">
                <div className="h-9 w-full rounded-xl bg-primary/20 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-muted animate-pulse" />
            </div>
        </div>
    );
}

function MobileSummarySkeleton() {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="flex-1 space-y-1">
                    <div className="h-2.5 w-14 rounded bg-muted animate-pulse" />
                    <div className="h-6 w-20 rounded bg-muted animate-pulse" />
                </div>
                <div className="flex gap-2">
                    <div className="h-8 w-24 rounded-xl bg-primary/20 animate-pulse" />
                    <div className="h-8 w-14 rounded-xl bg-muted animate-pulse" />
                </div>
            </div>
            <div className="flex gap-3 mt-1">
                <div className="h-3 w-28 rounded bg-muted animate-pulse" />
                <div className="h-3 w-24 rounded bg-muted animate-pulse" />
            </div>
        </div>
    );
}