import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Home, List, ChevronRight, BookOpen, Calculator, CheckCircle, Circle, ArrowRight, TrendingUp, Compass, Settings } from 'lucide-react';

// ======================================================
// COMPONENTES DE PÁGINA
// ======================================================

// Componente para a página de Início
const HomePage = () => {
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
};

// Componente para a página de listagem de vestibulares
const VestibularesPage = () => {
    const navigate = useNavigate();
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

// Novo componente para seleção do ano do PAS
const PasYearSelectionPage = () => {
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
};

// Componente para seleção da série do PAS
const PasSerieSelectionPage = () => {
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
};


// Componente para a página de seleção de idioma
const LanguageSelectionPage = () => {
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
};

// Componente do Corretor, agora uma página do nosso app
const CorrectorPage = () => {
    const { vestibularName, languageName } = useParams();
    // Dados de gabarito para demonstração.
    // Em um projeto real, esses dados seriam carregados de uma API
    // com base em 'selectedVestibular' e 'selectedLanguage'.
    const gabarito = {
        1: [1, 8],
        2: [2, 4, 16],
        3: [1, 2, 4],
        4: [16],
        5: [2,8],
        6: [1, 2, 4, 8],
        7: [8],
        8: [1, 2, 4],
        9: [4, 8],
        10: [1, 16]
    };
    
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [redacaoScore, setRedacaoScore] = useState(0);
    const [results, setResults] = useState(null);
    const [questionFeedback, setQuestionFeedback] = useState({});

    // Componente individual para cada questão
    const Question = ({ questionNumber, selectedAnswers, onAnswerChange, showFeedback, questionFeedback }) => {
        const options = [1, 2, 4, 8, 16];
        const isSelected = (option) => selectedAnswers.includes(option);
        const sumOfSelected = selectedAnswers.reduce((sum, current) => sum + current, 0);

        const getOptionColor = (option) => {
            if (!showFeedback) {
                return isSelected(option) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600';
            }
            const isUserSelected = isSelected(option);
            const isCorrectOption = gabarito[questionNumber].includes(option);
            if (isUserSelected && questionFeedback.userSelectedIncorrect.includes(option)) return 'bg-red-600 text-white';
            if (isUserSelected && questionFeedback.userSelectedCorrect.includes(option)) return 'bg-green-600 text-white';
            if (!isUserSelected && questionFeedback.correctButMissed.includes(option)) return 'bg-yellow-600 text-white';
            return 'bg-gray-700 text-gray-300';
        };

        return (
            <div className="p-4 bg-gray-900 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-medium mb-3 text-white">Questão {questionNumber}</p>
                    <div className="flex items-center space-x-2">
                        {sumOfSelected > 0 && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-sm shadow-lg">
                                {sumOfSelected}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center md:flex-row md:justify-center flex-wrap gap-2">
                    {options.map(option => (
                        <label
                            key={option}
                            className={`
                                flex items-center space-x-2 cursor-pointer p-3 rounded-md transition-colors duration-200
                                ${getOptionColor(option)}
                            `}
                        >
                            <input
                                type="checkbox"
                                name={`q${questionNumber}`}
                                value={option}
                                checked={isSelected(option)}
                                onChange={() => handleAnswerChange(questionNumber, option)}
                                className="hidden"
                            />
                            {isSelected(option) ? <CheckCircle size={16} /> : <Circle size={16} />}
                            <span className="font-bold text-white">{option}</span>
                        </label>
                    ))}
                </div>
                {showFeedback && questionFeedback && (
                    <div className="mt-4 pt-4 border-t border-gray-700 text-sm space-y-2">
                        <p className="font-semibold text-white">
                            Sua pontuação nesta questão: <span className="text-lg font-bold text-green-400">{questionFeedback.score.toFixed(2)}</span> / 6.00
                        </p>
                        {questionFeedback.userSelectedIncorrect.length > 0 && (
                            <p className="text-red-400">
                                Você marcou as opções incorretas: <span className="font-bold">{questionFeedback.userSelectedIncorrect.join(', ')}</span>
                            </p>
                        )}
                        {questionFeedback.correctButMissed.length > 0 && (
                            <p className="text-yellow-400">
                                Você deixou de marcar as opções corretas: <span className="font-bold">{questionFeedback.correctButMissed.join(', ')}</span>
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Funções de lógica do corretor
    const handleAnswerChange = (questionNumber, option) => {
        setResults(null);
        setQuestionFeedback({});
        setSelectedAnswers(prevAnswers => {
            const currentAnswers = prevAnswers[questionNumber] || [];
            if (currentAnswers.includes(option)) {
                return { ...prevAnswers, [questionNumber]: currentAnswers.filter(a => a !== option) };
            } else {
                return { ...prevAnswers, [questionNumber]: [...currentAnswers, option] };
            }
        });
    };

    const calculateScore = () => {
        let totalObjectiveScore = 0;
        const feedback = {};
        for (const qNumber in gabarito) {
            const correctOptions = gabarito[qNumber];
            const userSelectedValues = selectedAnswers[qNumber] || [];
            const userSelectedCorrect = userSelectedValues.filter(val => correctOptions.includes(val));
            const userSelectedIncorrect = userSelectedValues.filter(val => !correctOptions.includes(val));
            const correctButMissed = correctOptions.filter(val => !userSelectedValues.includes(val));

            let questionScore = 0;
            if (userSelectedIncorrect.length > 0) {
                questionScore = 0;
            } else {
                const totalCorrect = correctOptions.length;
                if (totalCorrect === 0) {
                    questionScore = userSelectedValues.length === 0 ? 6 : 0;
                } else if (userSelectedCorrect.length === totalCorrect && userSelectedValues.length === totalCorrect) {
                    questionScore = 6;
                } else if (userSelectedCorrect.length > 0) {
                    const partialPointValue = 6 / totalCorrect;
                    questionScore = partialPointValue * userSelectedCorrect.length;
                }
            }
            totalObjectiveScore += questionScore;
            feedback[qNumber] = { score: questionScore, userSelectedCorrect, userSelectedIncorrect, correctButMissed };
        }
        setQuestionFeedback(feedback);
        const finalScore = totalObjectiveScore + (parseInt(redacaoScore) || 0);
        setResults({ objective: totalObjectiveScore, final: finalScore });
    };

    return (
        <div className="p-8 w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Corretor - {decodeURIComponent(vestibularName)} ({decodeURIComponent(languageName)})</h2>
            <div className="space-y-6">
                <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Questões Objetivas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.keys(gabarito).map(qNumber => (
                            <Question
                                key={qNumber}
                                questionNumber={qNumber}
                                selectedAnswers={selectedAnswers[qNumber] || []}
                                onAnswerChange={handleAnswerChange}
                                showFeedback={!!results}
                                questionFeedback={questionFeedback[qNumber]}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between border border-gray-600">
                    <h3 className="text-2xl font-semibold text-white mb-4 md:mb-0">Nota da Redação (0-120)</h3>
                    <input
                        type="number"
                        value={redacaoScore}
                        onChange={(e) => setRedacaoScore(Math.min(120, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="p-3 rounded-lg bg-gray-900 text-white border border-gray-600 w-full md:w-auto text-center focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        min="0"
                        max="120"
                    />
                </div>

                <button
                    onClick={calculateScore}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                    <Calculator size={24} />
                    <span>Calcular Score Final</span>
                </button>

                {results && (
                    <div className="bg-gray-700 p-6 rounded-xl text-center border border-gray-600 animate-slide-in-up">
                        <h3 className="text-3xl font-bold mb-4 text-white">Seu Resultado</h3>
                        <p className="text-xl flex items-center justify-center space-x-2">
                            <ArrowRight className="text-yellow-400" size={20} />
                            <span>Score das Questões Objetivas: <span className="font-bold text-yellow-400">{results.objective.toFixed(2)}</span></span>
                        </p>
                        <p className="text-xl mt-4 flex items-center justify-center space-x-2">
                            <ArrowRight className="text-green-400" size={20} />
                            <span>Score Final: <span className="font-bold text-green-400">{results.final.toFixed(2)}</span></span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};


// ======================================================
// COMPONENTE PRINCIPAL (APP)
// ======================================================
const App = () => {
    return (
        <HashRouter>
            <div className="flex flex-col min-h-screen p-4 md:p-8 bg-gray-900">
                {/* Barra de navegação */}
                <nav className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4 mb-8">
                    <Link
                        to="/"
                        className="w-full md:w-auto flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                    >
                        <Home size={20} />
                        <span>Início</span>
                    </Link>
                    <Link
                        to="/vestibulares"
                        className="w-full md:w-auto flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                    >
                        <BookOpen size={20} />
                        <span>Vestibulares</span>
                    </Link>
                    <Link
                        to="/pas"
                        className="w-full md:w-auto flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                    >
                        <BookOpen size={20} />
                        <span>PAS</span>
                    </Link>
                </nav>

                {/* Container para o conteúdo da página */}
                <main className="flex-grow bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col items-center justify-center">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/vestibulares" element={<VestibularesPage />} />
                        <Route path="/pas" element={<PasYearSelectionPage />} />
                        <Route path="/pas/:pasYear/serie" element={<PasSerieSelectionPage />} />
                        <Route path="/selecionar-idioma/:vestibularName" element={<LanguageSelectionPage />} />
                        <Route path="/corretor/:vestibularName/:languageName" element={<CorrectorPage />} />
                    </Routes>
                </main>
            </div>
        </HashRouter>
    );
};

export default App;
