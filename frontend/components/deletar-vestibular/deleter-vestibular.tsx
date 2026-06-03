"use client"

import { Vestibular } from "@/types/vestibular"
import { Trash2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"

export const DeletarVestibular = ({ v }: { v: Vestibular }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function excluirVestibular() {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("access_token")

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/${v.id}/`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                },
            )

            if (res.ok) {
                setIsOpen(false)
                router.refresh()
            } else {
                const data = await res.json().catch(() => ({}))
                setError(data.detail || data.erro || "Ocorreu um erro ao excluir o vestibular. Tente novamente.")
            }
        } catch {
            setError("Erro ao se conectar ao servidor.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) setError(null)
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Excluir Vestibular</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Tem certeza que deseja excluir o vestibular <strong>{v.nome}</strong> ({v.ano})? Esta ação é irreversível e todas as questões associadas também serão apagadas.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={excluirVestibular}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        {loading ? "Excluindo..." : "Sim, Excluir"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}