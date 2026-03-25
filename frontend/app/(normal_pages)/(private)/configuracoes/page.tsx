import { Pencil, Trash2, Plus } from "lucide-react";
import { Vestibular } from "@/types/vestibular";
import Link from "next/link";
import { EditarVestibularLink } from "@/components/editar-vestibular-link";
import { DeletarVestibular } from "@/components/deletar-vestibular";
import next from "next";



async function getVestibulares(): Promise<Vestibular[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/`,
        {next: { revalidate: 30 }} as RequestInit
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
                    <h2 className="text-white text-2xl font-bold">
                        Vestibulares
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {vestibulares.length} vestibular
                        {vestibulares.length !== 1 ? "es" : ""} cadastrado
                        {vestibulares.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    href="/configuracoes/novo"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
                >
                    <Plus className="h-4 w-4" />
                    Novo Vestibular
                </Link>
            </div>

            <div className="rounded-2xl border border-white/10 overflow-hidden">
                {vestibulares.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        Nenhum vestibular cadastrado.
                    </div>
                ) : (
                    <ul className="divide-y divide-white/5">
                        {vestibulares.map((v) => (
                            <li
                                key={v.id}
                                className="flex items-center justify-between gap-4 px-6 py-4 bg-slate-900/40 hover:bg-slate-900/70 transition-colors"
                            >
                                <div className="flex flex-col items-center gap-4 min-w-0">
                                    <div className="min-w-0 max-w-full">
                                        <p className="text-white font-medium text-nowrap truncate ">
                                            {v.nome}
                                        </p>
                                        <div className="flex flex-col items-start gap-2 mt-0.5">
                                            <span className="text-xs text-slate-500 capitalize">
                                                    {v.tipo} · {v.ano} {v.serie ? ` · ${v.serie}ª` : ""}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold text-center text-nowrap max-w-full truncate uppercase px-2 py-0.5 rounded-full ${
                                                    v.com_gabarito
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-slate-500/20 text-slate-400"
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
