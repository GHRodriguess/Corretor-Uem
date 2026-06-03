"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function AlternadorTema() {
    const [theme, setTheme] = useState<string>("light")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        const currentTheme = savedTheme || systemTheme
        
        setTimeout(() => {
            setTheme(currentTheme)
            setMounted(true)
        }, 0)
    }, [])

    const alternarTema = () => {
        const nextTheme = theme === "dark" ? "light" : "dark"
        setTheme(nextTheme)
        localStorage.setItem("theme", nextTheme)
        
        if (nextTheme === "dark") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }

    if (!mounted) {
        return <div className="w-9 h-9" />
    }

    return (
        <button
            onClick={alternarTema}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md p-1.5 hover:bg-accent cursor-pointer"
            aria-label={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
        >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    )
}
