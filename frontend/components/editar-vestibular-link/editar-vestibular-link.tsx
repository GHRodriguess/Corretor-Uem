"use client";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Vestibular } from "@/types/vestibular";
import { Button } from "../ui/button";

export function EditarVestibularLink({ v }: { v: Vestibular }) {
    return (
        <Button className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent rounded-lg text-sm font-medium text-indigo-400 border border-indigo-500/30 transition-all" asChild>
            <Link
                href={`/configuracoes/${v.id}`}
                onClick={() => sessionStorage.setItem(`vestibular:${v.id}`, JSON.stringify(v))}
                className="hover:bg-indigo-400 "
            >
                <Pencil className="h-3.5 w-3.5" />
                Editar
            </Link>
        </Button>
    );
}