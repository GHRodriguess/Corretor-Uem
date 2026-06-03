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
        <div className="group relative cursor-pointer rounded-2xl border border-border bg-card overflow-hidden flex flex-col transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_30px_-10px_rgba(79,70,229,0.3)] shadow-md hover:scale-105 hover:-translate-y-1">
            <Link href={href} >
                <div className="relative w-full overflow-hidden">
                    <Image
                        priority 
                        src={vestibular.imagem}
                        alt={vestibular.nome}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto transition-transform duration-500 "
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-80" />

                    
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5 text-indigo-400" />
                        {vestibular.ano}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/35" />
                    <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="capitalize">{vestibular.tipo}</span>
                    </span>
                </div>

                <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-indigo-500 transition-colors mb-1 line-clamp-2">
                    {vestibular.nome}
                </h3>

                <div className="mb-3">
                    <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                            vestibular.com_gabarito
                                ? "bg-green-500/20 text-green-500 border-green-500/30"
                                : "bg-muted text-muted-foreground border-border"
                        }`}
                    >
                        {vestibular.com_gabarito ? "Correção disponível" : "Aguardando gabarito" }
                    </span>
                </div>

                <div className="mt-auto">
                    {vestibular.com_gabarito ? (
                        
                        <Link
                            href={href}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all active:scale-[0.98] bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                        
                        >
                            Corrigir Prova <ChevronRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-muted text-muted-foreground cursor-not-allowed border border-border"
                        >
                            Aguardando Gabarito <Spinner />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}