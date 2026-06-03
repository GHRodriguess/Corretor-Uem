import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CampoFormulario } from "@/components/molecules/CampoFormulario";
import { MensagemErro } from "@/components/atoms/MensagemErro";
import { CarregadorBotao } from "@/components/atoms/CarregadorBotao";

export function FormularioLogin() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const lidarComEnvio = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError("Credenciais inválidas.");
                return;
            }

            localStorage.setItem("access_token", data.access);
            router.push("/");
        } catch {
            setError("Erro de conexão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-5" onSubmit={lidarComEnvio}>
            <CampoFormulario
                label="Nome de Usuário"
                type="text"
                placeholder="Insira seu usuário"
                value={username}
                onChange={setUsername}
                required
            />

            <CampoFormulario
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                required
            />

            {error && <MensagemErro message={error} />}

            <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm tracking-wide border-0 shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200 disabled:opacity-60"
            >
                {loading ? <CarregadorBotao /> : "Entrar"}
            </Button>
        </form>
    );
}
