"use client";

import { useState } from "react";
import { Search, BookOpen, FileX } from "lucide-react";
import { VestibularCard } from "@/components/vestibular-card";
import { Vestibular } from "@/types/vestibular";

interface VestibularListProps {
    vestibulares: Vestibular[];
}

export function VestibularList({ vestibulares }: VestibularListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAtivo, setFilterAtivo] = useState<"todos" | "disponiveis" | "aguardando">("todos");

    const filtered = vestibulares.filter((v) => {
        const matchSearch = v.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchFilter =
            filterAtivo === "todos" ||
            (filterAtivo === "disponiveis" && v.com_gabarito) ||
            (filterAtivo === "aguardando" && !v.com_gabarito);
        return matchSearch && matchFilter;
    });

    return (
        <>
            <section className="relative mb-16 overflow-hidden rounded-3xl bg-card border border-border p-8 lg:p-12 shadow-sm">
                <div className="absolute -top-24 -right-24 h-72 w-72 bg-indigo-600/15 blur-[120px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 bg-purple-600/10 blur-[120px] rounded-full" />

                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6">
                        Corrija aqui seu{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-pulse-slow">
                            Vestibular
                        </span>
                        .
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                        Corrija suas provas e acompanhe seu desempenho nos
                        vestibulares da UEM de forma simples e instantânea.
                    </p>

                    <div className="flex flex-col gap-5">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar vestibular..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl py-3.5 pl-12 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-muted-foreground shadow-xs"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {(
                                [
                                    { id: "todos", label: "Todos" },
                                    { id: "disponiveis", label: "Gabarito Disponível" },
                                    { id: "aguardando", label: "Aguardando Gabarito" },
                                ] as const
                            ).map((opt) => {
                                const isSelected = filterAtivo === opt.id
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setFilterAtivo(opt.id)}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                                            isSelected
                                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                                                : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                )
                            })}
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
