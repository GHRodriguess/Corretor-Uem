import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Circle, CheckCircle, Calculator, ArrowRight } from "lucide-react";
import LoadingComponent from "../components/LoadingComponent";

const Question = ({ questionNumber, selectedAnswers, showFeedback, questionFeedback, onAnswerChange }) => {
    const options = [1, 2, 4, 8, 16];
    const isSelected = (option) => selectedAnswers.includes(option);
    const sumOfSelected = selectedAnswers.reduce((sum, current) => sum + current, 0);
    const getOptionColor = (option) => {
        if (!showFeedback) {
            return isSelected(option) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600';
        }
        const isUserSelected = isSelected(option);
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
            <div className="w-full flex flex-col md:flex-row md:justify-center flex-wrap gap-2">
                <div className="w-full grid grid-cols-2 gap-2">
                    {options.slice(0, 4).map(option => (
                        <label
                            key={option}
                            className={`
                                flex items-center  space-x-2 cursor-pointer p-3 rounded-md transition-colors duration-200 w-full
                                ${getOptionColor(option)}
                            `}
                        >
                            <input
                                type="checkbox"
                                name={`q${questionNumber}`}
                                value={option}
                                checked={isSelected(option)}
                                onChange={() => onAnswerChange(questionNumber, option)}
                                className="hidden"
                            />
                            {isSelected(option) ? <CheckCircle size={16} /> : <Circle size={16} />}
                            <span className="font-bold text-white">{option}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-center w-full">
                     <label
                        key={options[4]}
                        className={`
                            flex items-center justify-center space-x-2 cursor-pointer p-3 rounded-md transition-colors duration-200 w-full
                            ${getOptionColor(options[4])}
                        `}
                    >
                        <input
                            type="checkbox"
                            name={`q${questionNumber}`}
                            value={options[4]}
                            checked={isSelected(options[4])}
                            onChange={() => onAnswerChange(questionNumber, options[4])}
                            className="hidden"
                        />
                        {isSelected(options[4]) ? <CheckCircle size={16} /> : <Circle size={16} />}
                        <span className="font-bold text-white">{options[4]}</span>
                    </label>
                </div>
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

export default function CorrectorPage() {
    const { vestibularId, languageName, serieId } = useParams();
    const [vestibularName, setVestibularName] = useState("");
    const [vestibularYear, setVestibularYear] = useState("");
    const [gabarito, setGabarito] = useState({});
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function getVestibular(id) {
            try {
                setLoading(true)
                await new Promise(resolve => setTimeout(resolve, 2000));
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
                setLoading(false)
            } catch (error) {
                console.error("Erro ao buscar vestibular:", error);
                setVestibularName("Vestibular não encontrado");
            }
        }

        if (vestibularId) {
            getVestibular(vestibularId);
        }
    }, [vestibularId]);

    useEffect(() => {
        async function fetchGabarito(id, language, serie) {
            try {
                let response = await fetch(
                    import.meta.env.VITE_BASE_URL_API + `questoes/${id}/${language}/${serie}`
                )

                if (!response.ok) {
                    console.error("Erro na requisição:", response.status);
                    return;
                }
                const data = await response.json();
                setGabarito(formatarGabarito(data));
            }
            catch (error) {
                console.error("Erro ao buscar gabarito:", error);
            }
        }
        if (vestibularId && languageName && serieId) {
            fetchGabarito(vestibularId, languageName, serieId);
        }

        function formatarGabarito(gabarito) {
            const gabaritoFormatado = {};

            gabarito.forEach(item => {
                let valor;
                if (item.resposta_geral !== null) {
                    valor = item.resposta_geral;
                } else if (item.respostas_idioma !== null) {
                    valor = item.respostas_idioma;
                    
                } else if (item.anulada){
                    valor = "ANULADA"
                }
                else {
                    return;
                }
                const numerosSoma = somaToList(valor);
                gabaritoFormatado[item.numero] = numerosSoma;
            });

            return gabaritoFormatado;
        }

    }, [vestibularId, languageName, serieId]);

    function somaToList(soma) {
        if (isNaN(soma) || soma === null) {
            return "ANULADA";
        }
        const valor = parseInt(soma, 10);

        if (valor === 0) {
            return [];
        }

        try {
            const resultado = [];
            const binario = valor.toString(2);

            for (let i = binario.length - 1; i >= 0; i--) {
                const posicao = binario.length - 1 - i;

                if (binario[i] === '1') {
                    resultado.push(Math.pow(2, posicao));
                }
            }

            return resultado.sort((a, b) => a - b);
        } catch (error) {
            console.error(error)
            return "ANULADA";
        }
    }

    const languageMap = {
        ingles: 'Inglês',
        espanhol: 'Espanhol',
        frances: 'Francês',
    };
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [redacaoScore, setRedacaoScore] = useState(0);
    const [results, setResults] = useState(null);
    const [questionFeedback, setQuestionFeedback] = useState({});

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
        let qQuestoesGabaritadas = 0;
        let qQuestoesZeradas = 0;
        const feedback = {};

        for (const qNumber in gabarito) {
            const correctOptions = gabarito[qNumber];
            const userSelectedValues = selectedAnswers[qNumber] || [];

            let questionScore = 0;
            const isAnulada = correctOptions === "ANULADA";

            if (isAnulada) {
                questionScore = 6;
                feedback[qNumber] = {
                    score: questionScore,
                    userSelectedCorrect: [1, 2, 4, 8, 16],
                    userSelectedIncorrect: [],
                    correctButMissed: [],
                    isAnulada: true
                };
            } else {
                const userSelectedCorrect = userSelectedValues.filter(val => correctOptions.includes(val));
                const userSelectedIncorrect = userSelectedValues.filter(val => !correctOptions.includes(val));
                const correctButMissed = correctOptions.filter(val => !userSelectedValues.includes(val));

                if (userSelectedIncorrect.length > 0) {
                    questionScore = 0;
                } else {
                    const totalCorrectOptions = correctOptions.length;

                    if (totalCorrectOptions === 0) {
                        questionScore = userSelectedValues.length === 0 ? 6 : 0;
                    } else {
                        const partialPointValue = 6 / totalCorrectOptions;
                        questionScore = partialPointValue * userSelectedCorrect.length;
                    }
                }

                feedback[qNumber] = {
                    score: questionScore,
                    userSelectedCorrect,
                    userSelectedIncorrect,
                    correctButMissed,
                    isAnulada: false
                };
            }

            if (questionScore == 6) {
                qQuestoesGabaritadas += 1;
            }
            else if (questionScore == 0) {
                qQuestoesZeradas += 1;
            }

            totalObjectiveScore += questionScore;
        }

        setQuestionFeedback(feedback);
        const finalScore = totalObjectiveScore + (parseInt(redacaoScore) || 0);
        setResults({ objective: totalObjectiveScore, final: finalScore , qQuestoesGabaritadas: qQuestoesGabaritadas, qQuestoesZeradas: qQuestoesZeradas});
    };

    return (
        <div className="p-8 w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Corretor - {decodeURIComponent(vestibularName)} ({languageMap[languageName]}) - {vestibularYear}</h2>
            <div className="space-y-6">
                <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Questões Objetivas</h3>
                    
                        {loading ? (
                            <LoadingComponent message="Carregando questões" />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.keys(gabarito).map(questao => (
                                <Question
                                    key={questao}
                                    questionNumber={questao}
                                    selectedAnswers={selectedAnswers[questao] || []}
                                    onAnswerChange={handleAnswerChange}
                                    showFeedback={!!results}
                                    questionFeedback={questionFeedback[questao]}
                                />))}
                            </div>
                        )}
                        
                        
                    
                </div>

                <div className="bg-gray-700 p-6 w-full rounded-xl flex flex-col md:flex-row items-center justify-between border border-gray-600">
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
                        <p className="w-full text-xl text-wh text-gray-50  flex items-center justify-center space-x-2">
                            <ArrowRight className="text-yellow-400" size={20} />
                            <span>Score das Questões Objetivas: <span className="font-bold text-yellow-400">{results.objective.toFixed(2)}</span></span>
                        </p>
                        <p className="text-xl mt-4 text-gray-50 flex items-center justify-center space-x-2">
                            <ArrowRight className="text-green-400" size={20} />
                            <span>Score Final: <span className="font-bold text-green-400">{results.final.toFixed(2)}</span></span>
                        </p>
                        <p className="text-xl mt-4 text-gray-50 flex items-center justify-center space-x-2">
                            <ArrowRight className="text-green-400" size={20} />
                            <span>Você acertou completamente: <span className="font-bold text-green-400">{results.qQuestoesGabaritadas}</span> questões</span>
                        </p>
                        <p className="text-xl mt-4 text-gray-50 flex items-center justify-center space-x-2">
                            <ArrowRight className="text-red-600" size={20} />
                            <span>Você zerou: <span className="font-bold text-red-600">{results.qQuestoesZeradas}</span> questões</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
