import { ReactNode } from "react";
import { Logo } from "@/components/atoms/Logo";

interface PropriedadesTemplateLogin {
    children: ReactNode;
}

export function TemplateLogin({ children }: PropriedadesTemplateLogin) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative px-4 sm:px-6">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative w-full max-w-md z-10 space-y-8 py-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Logo />
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Corretor UEM
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Entre com suas credenciais para continuar
                        </p>
                    </div>
                </div>

                <div className="bg-card/40 border border-border/80 rounded-2xl p-6 sm:p-8 backdrop-blur-lg shadow-xl shadow-foreground/5">
                    {children}
                </div>

                <p className="text-center text-muted-foreground/30 text-xs">
                    © 2026 Corretor UEM. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}
