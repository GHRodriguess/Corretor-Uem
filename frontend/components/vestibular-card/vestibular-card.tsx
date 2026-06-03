import Image from "next/image";
import Link from "next/link";
import { CalendarDays, FileText, ChevronRight } from "lucide-react";
import { Vestibular } from "@/types/vestibular";
import { Spinner } from "../ui/spinner";

interface VestibularCardProps {
    vestibular: Vestibular;
}

export function VestibularCard({ vestibular }: VestibularCardProps) {
    const href = vestibular.com_gabarito ? `/selecao/${vestibular.id}` : "/"

    return (
        <div className="group relative cursor-pointer rounded-3xl border border-border/40 bg-card/45 backdrop-blur-xs overflow-hidden flex flex-col transition-all duration-300 hover:bg-card/85 hover:border-indigo-500/30 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1.5">
            <Link href={href} >
                <div className="relative w-full overflow-hidden">
                    <Image
                        priority 
                        src={vestibular.imagem}
                        alt={vestibular.nome}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-card/90 via-card/10 to-transparent opacity-90" />
                </div>
            </Link>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                        {vestibular.ano}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                        <span className="capitalize">{vestibular.tipo}</span>
                    </span>
                </div>

                <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-4 line-clamp-2">
                    {vestibular.nome}
                </h3>

                <div className="mb-4">
                    <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            vestibular.com_gabarito
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                    >
                        {vestibular.com_gabarito ? "Correção disponível" : "Aguardando gabarito" }
                    </span>
                </div>

                <div className="mt-auto">
                    {vestibular.com_gabarito ? (
                        <Link
                            href={href}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all active:scale-[0.98] bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 cursor-pointer"
                        >
                            Corrigir Prova <ChevronRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-muted text-muted-foreground cursor-not-allowed border border-border/40"
                        >
                            Aguardando Gabarito <Spinner />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}