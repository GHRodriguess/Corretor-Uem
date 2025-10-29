import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const apiBaseUrl = import.meta.env.VITE_BASE_URL_API;

    const verifyToken = async () => {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const res = await fetch(apiBaseUrl + "auth/verify-token/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) return true;
            if (res.status === 401) return await refreshToken(); 
        } catch {
            return false;
        }

        return false;
    };

    const refreshToken = async () => {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) return false;

        try {
            const res = await fetch(apiBaseUrl + "auth/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh }),
            });

            console.log(res)
            if (!res.ok) return false;

            const data = await res.json();
            localStorage.setItem("token", data.access);
            return true;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        (async () => {
            const valid = await verifyToken();
            setIsAuthenticated(valid);
            setLoading(false);

            if (!valid) {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
            }
        })();
    }, []);

    const login = (access, refresh) => {
        localStorage.setItem("token", access);
        localStorage.setItem("refresh", refresh);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
