import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function LanguageSelectionPage(){
    const [vestibularName, setVestibularName] = useState("");
    const [vestibularYear, setVestibularYear] = useState("");

    const navigate = useNavigate();
    const { vestibularId } = useParams();
    const { serieId } = useParams();

    useEffect(() => {
        async function getVestibular(id) {
            try {
                const response = await fetch(
                    import.meta.env.VITE_BASE_URL_API + `get_vestibular_by_id/${id}`
                );

                if (!response.ok) {
                    console.error("Erro na requisição:", response.status);
                    setVestibularName("Vestibular não encontrado");
                    return;
                }

                const data = await response.json();
                setVestibularName(data.nome);
                setVestibularYear(data.ano);
            } catch (error) {
                console.error("Erro ao buscar vestibular:", error);
                setVestibularName("Vestibular não encontrado");
            }
        }

        if (vestibularId) {
            getVestibular(vestibularId);
        }
    }, [vestibularId]);
    
    const languages = [
        { id: 'ingles', name: 'Inglês' },
        { id: 'espanhol', name: 'Espanhol' },
        { id: 'frances', name: 'Francês' },
    ];

    const handleSelect = (languageName) => {
        navigate(`/corretor/${encodeURIComponent(vestibularId)}/${encodeURIComponent(languageName)}/${encodeURIComponent(serieId)}`);
    };

    return (
        <div className="p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Selecione o Idioma para o Vestibular: <br /><span className="text-blue-400">{vestibularName} {vestibularYear}</span></h2>
            <div className="space-y-4">
                {languages.map(lang => (
                    <button
                        key={lang.id}
                        onClick={() => handleSelect(lang.id)}
                        className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                    >
                        <span className="text-lg font-medium">{lang.name}</span>
                        <ChevronRight size={20} />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LanguageSelectionPage;
