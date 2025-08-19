import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import LoadingComponent from "../components/LoadingComponent";

function PasSerieSelectionPage(){
    const navigate = useNavigate();
    const { pasYear } = useParams();
    const [loading, setLoading] = useState(false)
    const series = [
        { id: '1', name: '1ª Série' },
        { id: '2', name: '2ª Série' },
        { id: '3', name: '3ª Série' },
    ];

    const handleSelect = async (serieId) => {        
        try {
            setLoading(true)
            const response = await fetch(import.meta.env.VITE_BASE_URL_API + `pas/${pasYear}/${serieId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar dados da série');
            }
            const responseData = await response.json();
            const vestibularId = responseData.id;

            navigate(`/selecionar-idioma/${vestibularId}/${encodeURIComponent(serieId)}`);
        } catch (error) {
            console.error("Erro na requisição:", error);
        } finally {
            setLoading(false)
        }
        
    };

    return (
        <div className="p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Selecione a Série para o PAS UEM {decodeURIComponent(pasYear)}</h2>
            { loading ? (
                <LoadingComponent message="Carregando as séries..." />
            ) : (
                <div className="space-y-4">
                    {series.map(serie => (
                        <button
                            key={serie.id}
                            onClick={() => handleSelect(serie.id)}
                            className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                        >
                            <span className="text-lg font-medium">{serie.name}</span>
                            <ChevronRight size={20} />
                        </button>
                    ))}
                </div>
            )}
            
        </div>
    );
}

export default PasSerieSelectionPage;