import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function  PasYearSelectionPage() {
    const navigate = useNavigate();
    const pasYears = [
        { id: 'pas-2025', name: 'PAS UEM 2025' },
        { id: 'pas-2024', name: 'PAS UEM 2024' },
    ];

    const handleSelect = (pasName) => {
        navigate(`/pas/${encodeURIComponent(pasName)}/serie`);
    };

    return (
        <div className="p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Selecione o Ano do PAS</h2>
            <div className="space-y-4">
                {pasYears.map(year => (
                    <button
                        key={year.id}
                        onClick={() => handleSelect(year.name)}
                        className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                    >
                        <span className="text-lg font-medium">{year.name}</span>
                        <ChevronRight size={20} />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PasYearSelectionPage;