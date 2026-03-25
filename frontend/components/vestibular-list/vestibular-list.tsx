"use client";

// components/vestibular-list.tsx
import { useState } from "react";
import { Search, Filter, BookOpen, FileX } from "lucide-react";
import { VestibularCard } from "@/components/vestibular-card";
import { Vestibular } from "@/types/vestibular";

interface VestibularListProps {
    vestibulares: Vestibular[];
}

export function VestibularList({ vestibulares }: VestibularListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAtivo, setFilterAtivo] = useState<
        "todos" | "gabarito disponível" | "aguardando gabarito"
    >("todos");

    const filtered = vestibulares.filter((v) => {
        const matchSearch = v.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchFilter =
            filterAtivo === "todos" ||
            (filterAtivo === "gabarito disponível" && v.com_gabarito) ||
            (filterAtivo === "aguardando gabarito" && !v.com_gabarito);
        return matchSearch && matchFilter;
    });

    return (
        <>
            <section className="relative mb-16 overflow-hidden rounded-3xl bg-slate-950 border border-white/5 p-8 lg:p-12">
                <div className="absolute -top-24 -right-24 h-64 w-64 bg-indigo-600/20 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-purple-600/10 blur-[100px] rounded-full" />

                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Corrija aqui seu{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                            Vestibular
                        </span>
                        .
                    </h1>
                    <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
                        Corrija suas provas e acompanhe seu desempenho nos
                        vestibulares da UEM.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar vestibular..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                            />
                            
                        </div>

                        <div className="relative">
                            <select
                                value={filterAtivo }
                                onChange={(e) =>
                                    setFilterAtivo(
                                        e.target.value as
                                            | "todos"
                                            | "gabarito disponível"
                                            | "aguardando gabarito",
                                    )
                                }
                                
                                className="appearance-none bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-2xl font-bold border border-white/5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pr-10"
                            > 
                                <option value="todos">Todos</option>
                                <option value="ativo">
                                    Gabarito disponível
                                </option>
                                <option value="encerrado">
                                    Aguardando gabarito
                                </option>
                            </select>
                            <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-indigo-500" />
                        Provas Disponíveis
                    </h2>
                    <p className="text-sm text-slate-500">
                        {filtered.length === vestibulares.length
                            ? `${vestibulares.length} vestibular${vestibulares.length !== 1 ? "es" : ""} encontrado${vestibulares.length !== 1 ? "s" : ""}`
                            : `${filtered.length} de ${vestibulares.length} vestibulares`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                    <div className="h-1 w-4 bg-slate-800 rounded-full" />
                </div>
            </div>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((v) => (
                        <VestibularCard key={v.id} vestibular={v} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-slate-900 p-6 rounded-full mb-4 border border-white/5">
                        <FileX className="h-12 w-12 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                        Nenhum resultado encontrado
                    </h3>
                    <p className="text-slate-500 mt-2">
                        Tente ajustar seus termos de busca.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setFilterAtivo("todos");
                        }}
                        className="mt-6 text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}
        </>
    );
}
