import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function  PasYearSelectionPage() {
    const navigate = useNavigate();
    const [pas, setPAS] = useState([]);
    
    useEffect(() => {
        const fetchData = async (endpoint, setter) => {
            try {
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
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setter([]);
            }
        };
            fetchData('pas', setPAS);
        }, []);

    const handleSelect = (pasName) => {
        navigate(`/pas/${encodeURIComponent(pasName)}/serie`);
    };

    return (
        <div className="p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Selecione o Ano do PAS</h2>
            <div className="space-y-4">
                {pas.map(p => (
                    <button
                        key={p.id}
                        onClick={() => handleSelect(p.ano)}
                        className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                    >
                        <span className="text-lg font-medium">{p.nome} {p.ano}</span>
                        <ChevronRight size={20} />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PasYearSelectionPage;