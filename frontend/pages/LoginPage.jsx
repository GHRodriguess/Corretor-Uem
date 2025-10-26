import { useAuth } from "../src/context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const apiBaseUrl =
                import.meta.env.VITE_BASE_URL_API ||
                "http://localhost:8000/api/";
            const response = await fetch(apiBaseUrl + "auth/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error("Usuário ou senha incorretos.");
            }

            const data = await response.json();
            console.log(data)
            localStorage.setItem("token", data.access);
            localStorage.setItem("refresh", data.refresh);
            login(data.access);
            navigate("/view-vestibulares");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 w-full">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-200 p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Usuário
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
