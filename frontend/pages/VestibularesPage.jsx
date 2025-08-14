import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function VestibularesPage() {
    const navigate = useNavigate();

    {/* USAR API PARA PEGAR OS DADOS */}
    const vestibulares = [
        { id: 'inverno-2025', name: 'Vestibular de Inverno 2025' },
        { id: 'verao-2024', name: 'Vestibular de Verão 2024' },
    ];

    const handleSelect = (vestibularName) => {
        navigate(`/selecionar-idioma/${encodeURIComponent(vestibularName)}`);
    };

    return (
        <div className="p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Vestibulares Disponíveis</h2>
            <div className="space-y-4">
                {vestibulares.map(v => (
                    <button
                        key={v.id}
                        onClick={() => handleSelect(v.name)}
                        className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                    >
                        <span className="text-lg font-medium">{v.name}</span>
                        <ChevronRight size={20} />
                    </button>
                ))}
            </div>
        </div>
    );
};
export default VestibularesPage;
