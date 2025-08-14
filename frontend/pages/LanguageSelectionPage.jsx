import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function LanguageSelectionPage(){
    const navigate = useNavigate();
    const { vestibularName } = useParams();
    const languages = [
        { id: 'ingles', name: 'Inglês' },
        { id: 'espanhol', name: 'Espanhol' },
        { id: 'frances', name: 'Francês' },
    ];

    const handleSelect = (languageName) => {
        navigate(`/corretor/${encodeURIComponent(vestibularName)}/${encodeURIComponent(languageName)}`);
    };

    return (
        <div className="p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Selecione o Idioma para o Vestibular: <br /><span className="text-blue-400">{decodeURIComponent(vestibularName)}</span></h2>
            <div className="space-y-4">
                {languages.map(lang => (
                    <button
                        key={lang.id}
                        onClick={() => handleSelect(lang.name)}
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