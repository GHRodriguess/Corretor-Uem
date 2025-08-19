import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import LoadingComponent from "../components/LoadingComponent";

function VestibularesPage() {
    const navigate = useNavigate();
    const [vestibulares, setVestibulares] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async (endpoint, setter) => {
            try {
                setLoading(true)
                const apiBaseUrl = import.meta.env.VITE_BASE_URL_API;
                const response = await fetch(apiBaseUrl + endpoint);
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setter(data);
                } else {
                    console.error(`A resposta da API para ${endpoint} não é um array.`, data);
                    setter([]); 
                }
                setLoading(false)
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setter([]);
            }
        };
            fetchData('vestibulares', setVestibulares);
        }, []);


    const handleSelect = (vestibularId) => {
        navigate(`/selecionar-idioma/${encodeURIComponent(vestibularId)}`);
    };

    return (
        <div className="p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Vestibulares Disponíveis</h2>
            {loading ? (
                <LoadingComponent message="Carregando vestibulares..." />
            ) : (
                <div className="space-y-4">
                {vestibulares.map(v => (
                    <button
                        key={v.id}
                        onClick={() => handleSelect(v.id)}
                        className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                    >
                        <span className="text-lg font-medium">{v.nome} {v.ano}</span>
                        <ChevronRight size={20} />
                    </button>
                ))}
            </div>
            )}
            
        </div>
    );
};
export default VestibularesPage;
