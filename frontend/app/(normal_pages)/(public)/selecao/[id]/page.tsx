import { redirect } from "next/navigation";
import { Vestibular } from "@/types/vestibular";
import { SelecaoForm } from "./SelecaoForm";

async function getVestibular(id: string): Promise<Vestibular | null> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/${id}/`,
        { next: { revalidate: 60 } } as RequestInit
    );

    if (!res.ok) return null;
    return res.json();
}

async function getSeries(vestibular: Vestibular): Promise<Vestibular[]> {
    if (vestibular.tipo !== "pas") return [];

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/?nome=${encodeURIComponent(vestibular.nome)}&ano=${vestibular.ano}&tipo=pas`,
        { next: { revalidate: 60 } } as RequestInit
    );

    if (!res.ok) return [];

    const data = await res.json();
    const lista: Vestibular[] = Array.isArray(data) ? data : data.results ?? [];
    return lista.sort((a, b) => Number(a.serie ?? 0) - Number(b.serie ?? 0));
}

export default async function SelecaoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const {id} = await params
    const vestibular = await getVestibular(id);

    if (!vestibular || !vestibular.com_gabarito) {
        redirect("/");
    }

    const series = await getSeries(vestibular);

    return <SelecaoForm vestibular={vestibular} series={series} />;
}