import { Plus } from "lucide-react";
import { Vestibular } from "@/types/vestibular";
import Link from "next/link";
import { EditarVestibularLink } from "@/components/editar-vestibular-link";
import { DeletarVestibular } from "@/components/deletar-vestibular";

export const dynamic = "force-dynamic";

async function getVestibulares(): Promise<Vestibular[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/`,
        { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Falha ao buscar vestibulares");
    const data = await res.json();
    return data;
}

export default async function Configuracoes() {
    const vestibulares = await getVestibulares();

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-foreground text-2xl font-bold">
                        Vestibulares
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        {vestibulares.length} vestibular
                        {vestibulares.length !== 1 ? "es" : ""} cadastrado
                        {vestibulares.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    href="/configuracoes/novo"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-xs"
                >
                    <Plus className="h-4 w-4" />
                    Novo Vestibular
                </Link>
            </div>

            <div className="rounded-2xl border border-border overflow-hidden">
                {vestibulares.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground">
                        Nenhum vestibular cadastrado.
                    </div>
                ) : (
                    <ul className="divide-y divide-border">
                        {vestibulares.map((v) => (
                            <li
                                key={v.id}
                                className="flex items-center justify-between gap-4 px-6 py-4 bg-card hover:bg-accent/20 transition-colors"
                            >
                                <div className="flex flex-col items-center gap-4 min-w-0">
                                    <div className="min-w-0 max-w-full">
                                        <p className="text-foreground font-medium text-nowrap truncate">
                                            {v.nome}
                                        </p>
                                        <div className="flex flex-col items-start gap-2 mt-0.5">
                                            <span className="text-xs text-muted-foreground capitalize">
                                                    {v.tipo} · {v.ano} {v.serie ? ` · ${v.serie}ª` : ""}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold text-center text-nowrap max-w-full truncate uppercase px-2 py-0.5 rounded-full ${
                                                    v.com_gabarito
                                                        ? "bg-emerald-500/10 text-emerald-500"
                                                        : "bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                {v.com_gabarito
                                                    ? "Com Gabarito"
                                                    : "Aguardando Gabarito"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <EditarVestibularLink v={v} />
                                    <DeletarVestibular v={v} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
