import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, TrendingUp, Compass, Settings } from "lucide-react";

function HomePage() {

    {/* USAR API PARA PEGAR OS DADOS */}
    const vestibulares = [        
        { id: 'inverno-2025', name: 'Vestibular de Inverno 2025' },
        { id: 'verao-2024', name: 'Vestibular de Verão 2024' },
    ];
    
    const pasYears = [
        { id: 'pas-2025', name: 'PAS UEM 2025' },
        { id: 'pas-2024', name: 'PAS UEM 2024' },
    ];

    const navigate = useNavigate();

    const handleSelectVestibular = (vestibularName) => {
        navigate(`/selecionar-idioma/${encodeURIComponent(vestibularName)}`);
    };

    const handleSelectPas = (pasName) => {
        navigate(`/pas/${encodeURIComponent(pasName)}/serie`);
    };

    return (
        <div className="p-8 flex flex-col items-center justify-center text-center">
            {/* Seção Hero */}
            <div className="max-w-4xl mx-auto py-12 md:py-24">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight animate-fade-in-down">
                    Corretor de Gabaritos UEM
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in-up">
                    Sua ferramenta definitiva para simular a pontuação no vestibular da UEM e entender seu desempenho em detalhes.
                </p>
                <Link
                    to="/vestibulares"
                    className="flex items-center justify-center space-x-2 py-4 px-10 text-xl font-bold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounce-slow"
                >
                    <span>Começar Simulação</span>
                    <ChevronRight size={24} />
                </Link>
            </div>

            {/* Seção de Destaques/Recursos */}
            <div className="mt-16 md:mt-24 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-8">Por que usar o nosso Corretor?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cartão de Destaque 1 */}
                    <div className="p-6 bg-gray-700 rounded-xl shadow-lg border border-gray-600 transition-all duration-300 transform hover:scale-105">
                        <TrendingUp size={48} className="text-blue-400 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-white mb-2">Análise Detalhada</h3>
                        <p className="text-gray-400">
                            Obtenha feedback preciso sobre sua pontuação, identificando acertos e erros em cada questão.
                        </p>
                    </div>
                    {/* Cartão de Destaque 2 */}
                    <div className="p-6 bg-gray-700 rounded-xl shadow-lg border border-gray-600 transition-all duration-300 transform hover:scale-105">
                        <Compass size={48} className="text-blue-400 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-white mb-2">Simulação Realista</h3>
                        <p className="text-gray-400">
                            Nosso sistema de correção segue as regras oficiais do vestibular da UEM para uma estimativa precisa.
                        </p>
                    </div>
                    {/* Cartão de Destaque 3 */}
                    <div className="p-6 bg-gray-700 rounded-xl shadow-lg border border-gray-600 transition-all duration-300 transform hover:scale-105">
                        <Settings size={48} className="text-blue-400 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-white mb-2">Fácil e Rápido</h3>
                        <p className="text-gray-400">
                            Interface intuitiva para inserir suas respostas e obter seu resultado em segundos.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Seção de Vestibulares na HomePage */}
            <div className="mt-16 md:mt-24 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Vestibulares Disponíveis</h2>
                <div className="space-y-4">
                    {vestibulares.map(v => (
                        <button
                            key={v.id}
                            onClick={() => handleSelectVestibular(v.name)}
                            className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                        >
                            <span className="text-lg font-medium">{v.name}</span>
                            <ChevronRight size={20} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Seção do PAS na HomePage */}
            <div className="mt-16 md:mt-24 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Processo de Avaliação Seriada (PAS)</h2>
                <div className="space-y-4">
                    {pasYears.map(year => (
                        <button
                            key={year.id}
                            onClick={() => handleSelectPas(year.name)}
                            className="w-full flex items-center justify-between py-4 px-6 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                        >
                            <span className="text-lg font-medium">{year.name}</span>
                            <ChevronRight size={20} />
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default HomePage;