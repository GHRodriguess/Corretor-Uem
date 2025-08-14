import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function PasSerieSelectionPage(){
    const navigate = useNavigate();
    const { pasYear } = useParams();
    const series = [
        { id: 'serie-1', name: '1ª Série' },
        { id: 'serie-2', name: '2ª Série' },
        { id: 'serie-3', name: '3ª Série' },
    ];

    const handleSelect = (serieName) => {
        const vestibularName = `${decodeURIComponent(pasYear)} - ${serieName}`;
        navigate(`/selecionar-idioma/${encodeURIComponent(vestibularName)}`);
    };

    return (
        <div className="p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Selecione a Série para o {decodeURIComponent(pasYear)}</h2>
            <div className="space-y-4">
                {series.map(serie => (
                    <button
                        key={serie.id}
                        onClick={() => handleSelect(serie.name)}
                        className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                    >
                        <span className="text-lg font-medium">{serie.name}</span>
                        <ChevronRight size={20} />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PasSerieSelectionPage;