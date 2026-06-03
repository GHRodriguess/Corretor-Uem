"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import { Vestibular } from "@/types/vestibular"
import { Button } from "../ui/button"

export function EditarVestibularLink({ v }: { v: Vestibular }) {
    return (
        <Button variant="outline" size="sm" asChild>
            <Link
                href={`/configuracoes/${v.id}`}
                onClick={() => sessionStorage.setItem(`vestibular:${v.id}`, JSON.stringify(v))}
            >
                <Pencil className="h-3.5 w-3.5" />
                Editar
            </Link>
        </Button>
    )
}