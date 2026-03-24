// components/EditarVestibularLink.tsx
"use client";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Vestibular } from "@/types/vestibular";

export function EditarVestibularLink({ v }: { v: Vestibular }) {
    return (
        <Link
            href={`/configuracoes/${v.id}`}
            onClick={() => sessionStorage.setItem(`vestibular:${v.id}`, JSON.stringify(v))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 transition-colors"
        >
            <Pencil className="h-3.5 w-3.5" />
            Editar
        </Link>
    );
}