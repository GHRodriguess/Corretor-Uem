import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, TrendingUp, Compass, Settings } from "lucide-react";

function HomePage() {

    const [vestibulares, setVestibulares] = useState([]);
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
        fetchData('vestibulares', setVestibulares);
        fetchData('pas', setPAS);
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
            <div className="mt-16 md:mt-24 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-8">Por que usar o nosso Corretor?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-gray-700 rounded-xl shadow-lg border border-gray-600 transition-all duration-300 transform hover:scale-105">
                        <TrendingUp size={48} className="text-blue-400 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-white mb-2">Análise Detalhada</h3>
                        <p className="text-gray-400">
                            Obtenha feedback preciso sobre sua pontuação, identificando acertos e erros em cada questão.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-700 rounded-xl shadow-lg border border-gray-600 transition-all duration-300 transform hover:scale-105">
                        <Compass size={48} className="text-blue-400 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-white mb-2">Simulação Realista</h3>
                        <p className="text-gray-400">
                            Nosso sistema de correção segue as regras oficiais do vestibular da UEM para uma estimativa precisa.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-700 rounded-xl shadow-lg border border-gray-600 transition-all duration-300 transform hover:scale-105">
                        <Settings size={48} className="text-blue-400 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-white mb-2">Fácil e Rápido</h3>
                        <p className="text-gray-400">
                            Interface intuitiva para inserir suas respostas e obter seu resultado em segundos.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="mt-16 md:mt-24 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Vestibulares Recentes</h2>
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
            </div>
            <div className="mt-16 md:mt-24 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Processo de Avaliação Seriada (PAS) Recentes</h2>
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
            </div>

        </div>
    );
}

export default HomePage;