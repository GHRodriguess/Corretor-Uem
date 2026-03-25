// app/page.tsx
import { Suspense } from "react";
import { VestibularList } from "@/components/vestibular-list";
import { VestibularCardSkeleton } from "@/components/vestibular-card-skeleton";
import { Vestibular } from "@/types/vestibular";

async function getVestibulares(): Promise<Vestibular[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vestibulares/compactados/`, {
        next: { revalidate: 60 }
    }  as RequestInit );

    if (!res.ok) throw new Error("Falha ao buscar vestibulares");

    return res.json();
}

function LoadingGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <VestibularCardSkeleton key={i} />
            ))}
        </div>
    );
}

async function VestibularesContent() {
    const vestibulares = await getVestibulares();
    return <VestibularList vestibulares={vestibulares} />;
}

export default function Home() {
    return (
        <main className="container h-full mx-auto px-4 py-8 lg:py-12 ">
            <Suspense fallback={<LoadingGrid />}>
                <VestibularesContent />
            </Suspense>
        </main>
    );
}