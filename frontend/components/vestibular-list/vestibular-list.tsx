"use client";

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
            <section className="relative mb-16 overflow-hidden rounded-3xl bg-muted/30 border border-border p-8 lg:p-12">
                <div className="absolute -top-24 -right-24 h-64 w-64 bg-indigo-600/20 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-purple-600/10 blur-[100px] rounded-full" />

                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6">
                        Corrija aqui seu{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
                            Vestibular
                        </span>
                        .
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                        Corrija suas provas e acompanhe seu desempenho nos
                        vestibulares da UEM.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar vestibular..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl py-3.5 pl-12 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-muted-foreground"
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
                                
                                className="appearance-none bg-background hover:bg-muted text-foreground px-6 py-3.5 rounded-2xl font-bold border border-border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pr-10"
                            > 
                                <option value="todos" className="bg-background text-foreground">Todos</option>
                                <option value="ativo" className="bg-background text-foreground">
                                    Gabarito disponível
                                </option>
                                <option value="encerrado" className="bg-background text-foreground">
                                    Aguardando gabarito
                                </option>
                            </select>
                            <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-indigo-500" />
                        Provas Disponíveis
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {filtered.length === vestibulares.length
                             ? `${vestibulares.length} vestibular${vestibulares.length !== 1 ? "es" : ""} encontrado${vestibulares.length !== 1 ? "s" : ""}`
                             : `${filtered.length} de ${vestibulares.length} vestibulares`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                    <div className="h-1 w-4 bg-muted rounded-full" />
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
                    <div className="bg-muted p-6 rounded-full mb-4 border border-border">
                        <FileX className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                        Nenhum resultado encontrado
                    </h3>
                    <p className="text-muted-foreground mt-2">
                        Tente ajustar seus termos de busca.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setFilterAtivo("todos");
                        }}
                        className="mt-6 text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold underline underline-offset-4"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}
        </>
    );
}
