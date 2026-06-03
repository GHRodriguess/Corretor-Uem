"use client"

import { useEffect, useState } from "react"
import { Settings } from "lucide-react"
import Link from "next/link"
import AlternadorTema from "./alternador-tema"

export const Navbar = () => {
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const savedToken = localStorage.getItem("access_token")
        setTimeout(() => {
            setToken(savedToken)
        }, 0)
    }, [])

    return (
        <nav className="bg-background h-14 flex items-center justify-between px-6 border-b border-border shadow-xs">
            <Link href="/" className="text-foreground text-2xl font-semibold tracking-tight">
                Corretor UEM
            </Link>

            <div className="flex items-center gap-4">
                <AlternadorTema />
                {token && (
                    <Link
                        href="/configuracoes"
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md p-1.5 hover:bg-accent"
                        aria-label="Configurações"
                    >
                        <Settings size={20} />
                    </Link>
                )}
            </div>
        </nav>
    )
}