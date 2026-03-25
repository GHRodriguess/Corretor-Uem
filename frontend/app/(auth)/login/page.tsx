"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School } from "lucide-react";
import { useRouter } from "next/navigation"

export default function Login() {
    const router = useRouter()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError("Credenciais inválidas.");
                return;
            }

            localStorage.setItem("access_token", data.access);            
            router.push("/")
            
        } catch (error) {
            setError("Erro de conexão. Tente novamente.")
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center overflow-hidden relative">
            <div className="absolute top-10 left-5 w-125 h-125 rounded-full bg-violet-700 opacity-10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-100 h-100 rounded-full bg-blue-600 opacity-10 blur-[120px] pointer-events-none" />

            <div
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative w-full max-w-sm">
                <div className="mb-10 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-700 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
                        <School />
                    </div>
                    <span
                        className="text-white text-sm tracking-[0.25em] uppercase font-light"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        Vestibular
                    </span>
                </div>

                <div className="bg-white/2 border border-white/[0.07] rounded-2xl p-8 backdrop-blur-md shadow-2xl shadow-black/40">
                    <div className="mb-7">
                        <h1
                            className="text-white text-2xl font-semibold tracking-tight"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Bem-vindo de volta
                        </h1>
                        <p className="text-white/30 text-sm mt-1">
                            Entre com suas credenciais para continuar
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <Label                            
                                aria-required
                                className="text-white/50 text-xs tracking-wide uppercase font-normal"
                            >
                                Nome de Usuário
                            </Label>
                            <Input
                                type="name"
                                placeholder="nome de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-white/5 border-white/5 text-white placeholder:text-white/20 rounded-xl h-11 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label className="text-white/50 text-xs tracking-wide uppercase font-normal">
                                    Senha
                                </Label>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-11 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50 transition-all"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 mt-2 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium text-sm tracking-wide border-0 shadow-lg shadow-violet-900/30 transition-all duration-200 disabled:opacity-60"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="white"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="white"
                                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                                        />
                                    </svg>
                                    Entrando...
                                </span>
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                    </form>
                    {error && (
                        <p className="text-red-400 text-xs mt-3 text-center">
                            {error}
                        </p>
                    )}
                </div>
                <p className="text-center text-white/15 text-xs mt-6">
                    © 2025 Vestibular. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}
