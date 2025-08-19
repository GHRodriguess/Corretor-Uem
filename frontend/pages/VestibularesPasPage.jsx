import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, TrendingUp, Compass, Settings } from "lucide-react";
import LoadingComponent from "../components/LoadingComponent";

function VestibularesPasPage() {
    const [vestibulares, setVestibulares] = useState([]);
    const [pas, setPAS] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchData = async (endpoint, setter) => {
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
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

        const fetchAllData = async () => {
            setLoading(true); 
            await Promise.all([
                fetchData('vestibulares', setVestibulares),
                fetchData('pas', setPAS)
            ]);
            setLoading(false); 
        };

        fetchAllData();
    }, []);  

    const navigate = useNavigate();

    const handleSelectVestibular = (vestibularId) => {
        navigate(`/selecionar-idioma/${encodeURIComponent(vestibularId)}`);
    };

    const handleSelectPas = (pasName) => {
        navigate(`/pas/${encodeURIComponent(pasName)}/serie`);
    };

    return (
        <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="mt-16 md:mt-24 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Vestibulares UEM</h2>
                {loading ? ( 
                    <LoadingComponent message="Carregando vestibulares..." />
                ) : (
                    <div className="space-y-4">
                        {vestibulares.map(v => (
                            <button
                                key={v.id}
                                onClick={() => handleSelectVestibular(v.id)}
                                className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                            >
                                <span className="text-lg font-medium">{v.nome} {v.ano}</span>
                                <ChevronRight size={20} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-16 md:mt-24 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Processo de Avaliação Seriada (PAS)</h2>
                {loading ? ( 
                    <LoadingComponent message="Carregando Processos de Avaliação Seriada..." />
                ) : (
                    <div className="space-y-4">
                        {pas.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handleSelectPas(p.ano)}
                                className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                            >
                                <span className="text-lg font-medium">{p.nome} {p.ano}</span>
                                <ChevronRight size={20} />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VestibularesPasPage;