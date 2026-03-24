"use client"

import { useEffect, useState } from "react"
import { Settings } from "lucide-react"
import Link from "next/link"

export const Navbar = () => {
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        setToken(localStorage.getItem("access_token"))
    }, [])



    return (
        <nav className="bg-slate-950 h-14 flex items-center justify-between px-6 border-b border-white/10 shadow-sm">
            <Link href="/" className="text-gray-100 text-2xl font-semibold tracking-tight">
                Corretor UEM
            </Link>

            {token && (
                <Link
                    href="/configuracoes"
                    className="text-gray-400 hover:text-gray-100 transition-colors duration-200 rounded-md p-1.5 hover:bg-white/10"
                    aria-label="Configurações"
                >
                    <Settings size={20} />
                </Link>
            )}
        </nav>
    )
}