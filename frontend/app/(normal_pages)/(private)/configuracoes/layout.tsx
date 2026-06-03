"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { verificarSeStaff } from "@/lib/autenticacao"

export default function LayoutConfiguracoes({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("access_token")
        setTimeout(() => {
            if (token && verificarSeStaff(token)) {
                setAuthorized(true)
            } else {
                setAuthorized(false)
                router.replace("/")
            }
        }, 0)
    }, [router])

    if (authorized === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
        )
    }

    if (!authorized) {
        return null
    }

    return <>{children}</>
}
