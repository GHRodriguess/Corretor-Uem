import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Questao } from "@/types/questao";
import { CorrecaoClient } from "./CorrecaoClient";

async function getQuestoes(id: string, idioma: string): Promise<Questao[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questoes/gabarito/?idioma=${idioma}&vestibular_id=${id}`,
        { next: { revalidate: 300 } } as RequestInit
    );

    if (!res.ok) return [];
    return res.json();
}

export default async function CorrecaoPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ idioma?: string }>;
}) {
    const { id } = await params;
    const { idioma = "ingles" } = await searchParams;

    const questoes = await getQuestoes(id, idioma);

    if (!questoes.length) notFound();

    return <CorrecaoClient questoes={questoes} />;
}