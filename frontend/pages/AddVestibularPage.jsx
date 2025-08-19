import { useState, useEffect } from "react";
import LoadingComponent from "../components/LoadingComponent";

function AddVestibularPage() {
    const [vestibular, setVestibular] = useState(null);
    const [questoes, setQuestoes] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [tipo, setTipo] = useState('vestibular');
    const [serie, setSerie] = useState('1');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (vestibular && questoes.length === 0 && currentQuestion === null) {
            setCurrentQuestion({
                numero: 1,
                eh_idioma: false,
                respostas_idioma: {
                    ingles: "",
                    espanhol: "",
                    frances: "",
                },
                resposta_geral: "",
                anulada: false, 
            });
        }
    }, [vestibular, questoes, currentQuestion]);

    const enviarDadosParaAPI = async (payload) => {
        const url = import.meta.env.VITE_BASE_URL_API + 'adiciona_vestibular';

        try {
            setLoading(true)
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error("Erro ao enviar dados para a API:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSalvarVestibular = (e) => {
        e.preventDefault();
        const nome = e.target.nome.value;
        const ano = e.target.ano.value;
        const tipoProva = e.target.tipo.value;
        const dadosVestibular = { nome, ano, tipo: tipoProva };

        if (tipoProva === 'pas') {
            dadosVestibular.serie = e.target.serie.value;
        }

        setVestibular(dadosVestibular);
        setError(null);
        setSuccessMessage(null);
    };

    const handleAvancar = () => {
        if (!currentQuestion) return;
        setError(null);
        setSuccessMessage(null);

        const questaoParaSalvar = { ...currentQuestion };
        if (currentQuestionIndex >= questoes.length) {
            setQuestoes([...questoes, questaoParaSalvar]);
        } else {
            const newQuestoes = [...questoes];
            newQuestoes[currentQuestionIndex] = questaoParaSalvar;
            setQuestoes(newQuestoes);
        }

        const newIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(newIndex);
        if (newIndex < questoes.length) {
            setCurrentQuestion(questoes[newIndex]);
        } else {
            setCurrentQuestion({
                numero: newIndex + 1,
                eh_idioma: false,
                respostas_idioma: {
                    ingles: "",
                    espanhol: "",
                    frances: "",
                },
                resposta_geral: "",
                anulada: false, 
            });
        }
    };

    const handleVoltar = () => {
        if (currentQuestionIndex > 0) {
            setError(null);
            setSuccessMessage(null);
            const newQuestoes = [...questoes];
            newQuestoes[currentQuestionIndex] = currentQuestion;
            setQuestoes(newQuestoes);

            const newIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(newIndex);
            setCurrentQuestion(questoes[newIndex]);
        }
    };

    const handleFinalizar = async () => {
        if (currentQuestion) {
            const newQuestoes = [...questoes];
            newQuestoes[currentQuestionIndex] = currentQuestion;
            setQuestoes(newQuestoes);
            try {
                await enviarDadosParaAPI({ vestibular, questoes: newQuestoes });

                setSuccessMessage("Dados salvos com sucesso!");
                setError(null);
                setVestibular(null);
                setQuestoes([]);
                setCurrentQuestion(null);
                setCurrentQuestionIndex(0);
            } catch (error) {
                if (error.message.includes("duplicate key value")) {
                    setError("Já existe um vestibular com o mesmo nome e ano. Por favor, corrija e tente novamente.");
                } else {
                    setError(`Erro ao salvar dados: ${error.message}`);
                }
                setSuccessMessage(null);
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 p-8 font-sans antialiased flex items-center justify-center text-gray-100">
            <style>
                {`
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
            </style>
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700">
                <h1 className="text-3xl font-bold text-gray-50 mb-6 text-center">
                    Configuração de Gabaritos
                </h1>

                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg mb-6 text-center">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-900 border border-green-700 text-green-200 p-4 rounded-lg mb-6 text-center">
                        <p className="font-medium">{successMessage}</p>
                    </div>
                )}
                {loading ? (
                    <LoadingComponent message="Enviando dados..." />
                ) : (
                    <>
                        {!vestibular ? (
                            <form
                                onSubmit={handleSalvarVestibular}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-semibold text-gray-50 mb-4 text-center">
                                    Novo Gabarito
                                </h2>
                                <div>
                                    <label
                                        htmlFor="tipo"
                                        className="block text-sm font-medium text-gray-400"
                                    >
                                        Tipo de Prova
                                    </label>
                                    <select
                                        id="tipo"
                                        required
                                        value={tipo}
                                        onChange={(e) => setTipo(e.target.value)}
                                        className="mt-1 block w-full h-12 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                                    >
                                        <option value="vestibular">Vestibular</option>
                                        <option value="pas">PAS</option>
                                    </select>
                                </div>
                                {tipo === 'pas' && (
                                    <div>
                                        <label
                                            htmlFor="serie"
                                            className="block text-sm font-medium text-gray-400"
                                        >
                                            Série do PAS
                                        </label>
                                        <select
                                            id="serie"
                                            required
                                            value={serie}
                                            onChange={(e) => setSerie(e.target.value)}
                                            className="mt-1 block w-full h-12 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                                        >
                                            <option value="1">1ª Série</option>
                                            <option value="2">2ª Série</option>
                                            <option value="3">3ª Série</option>
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label
                                        htmlFor="nome"
                                        className="block text-sm font-medium text-gray-400"
                                    >
                                        Nome da Prova
                                    </label>
                                    <input
                                        type="text"
                                        id="nome"
                                        required
                                        className="mt-1 block w-full h-12 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="ano"
                                        className="block text-sm font-medium text-gray-400"
                                    >
                                        Ano
                                    </label>
                                    <input
                                        type="number"
                                        id="ano"
                                        required
                                        className="mt-1 block w-full h-12 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition duration-200 ease-in-out shadow-lg transform hover:scale-105"
                                >
                                    Adicionar Gabarito
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-50 mb-4 text-center">
                                    Adicionar Questões: {vestibular.nome} ({vestibular.ano})
                                    {vestibular.tipo === 'pas' && ` - ${vestibular.serie}ª Série`}
                                </h2>
                                {currentQuestion && (
                                    <div className="p-6 bg-gray-700 rounded-xl space-y-5 border border-gray-600 shadow-md">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold text-gray-50">
                                                Questão {currentQuestion.numero}
                                            </h3>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="anulada"
                                                    checked={currentQuestion.anulada}
                                                    onChange={(e) =>
                                                        setCurrentQuestion({
                                                            ...currentQuestion,
                                                            anulada: e.target.checked,
                                                            resposta_geral: e.target.checked ? "" : currentQuestion.resposta_geral,
                                                            respostas_idioma: e.target.checked ? { ingles: "", espanhol: "", frances: "" } : currentQuestion.respostas_idioma,
                                                        })
                                                    }
                                                    className="rounded text-red-600 bg-gray-800 border-gray-600 shadow-sm focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                                                />
                                                <label
                                                    htmlFor="anulada"
                                                    className="ml-2 text-sm font-medium text-gray-400"
                                                >
                                                    Anulada
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4">
                                            <input
                                                type="checkbox"
                                                id="eh_idioma"
                                                checked={currentQuestion.eh_idioma}
                                                onChange={(e) =>
                                                    setCurrentQuestion({
                                                        ...currentQuestion,
                                                        eh_idioma: e.target.checked,
                                                        resposta_geral: e.target.checked ? "" : currentQuestion.resposta_geral,
                                                        respostas_idioma: !e.target.checked ? { ingles: "", espanhol: "", frances: "" } : currentQuestion.respostas_idioma,
                                                    })
                                                }
                                                disabled={currentQuestion.anulada}
                                                className="rounded text-purple-600 bg-gray-800 border-gray-600 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            <label
                                                htmlFor="eh_idioma"
                                                className="text-sm font-medium text-gray-400"
                                            >
                                                Questão de Idioma
                                            </label>
                                        </div>
                                        {currentQuestion.eh_idioma ? (
                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {["espanhol", "frances", "ingles",].map(
                                                    (idioma) => (
                                                        <div key={idioma}>
                                                            <label
                                                                htmlFor={idioma}
                                                                className="block text-sm font-medium text-gray-400"
                                                            >
                                                                Gabarito{" "}
                                                                {idioma
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    idioma.slice(
                                                                        1
                                                                    )}{" "}
                                                                (0-31)
                                                            </label>
                                                            <div className="mt-1 flex items-center justify-center h-24 w-full rounded-lg border-2 border-gray-600 bg-gray-800 shadow-sm">
                                                                <input
                                                                    type="number"
                                                                    id={idioma}
                                                                    min="0"
                                                                    max="31"
                                                                    value={
                                                                        currentQuestion
                                                                            .respostas_idioma[
                                                                            idioma
                                                                        ]
                                                                    }
                                                                    onChange={(e) =>
                                                                        setCurrentQuestion(
                                                                            {
                                                                                ...currentQuestion,
                                                                                respostas_idioma:
                                                                                {
                                                                                    ...currentQuestion.respostas_idioma,
                                                                                    [idioma]:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                },
                                                                            }
                                                                        )
                                                                    }
                                                                    disabled={currentQuestion.anulada}
                                                                    className="text-4xl text-white font-bold text-center bg-transparent w-full h-full p-2 border-none focus:ring-0 disabled:opacity-50"
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <label
                                                    htmlFor="resposta_geral"
                                                    className="block text-sm font-medium text-gray-400"
                                                >
                                                    Gabarito
                                                </label>
                                                <div className="mt-1 flex items-center justify-center h-40 w-full rounded-lg border-2 border-gray-600 bg-gray-800 shadow-sm">
                                                    <input
                                                        type="number"
                                                        id="resposta_geral"
                                                        value={
                                                            currentQuestion.resposta_geral
                                                        }
                                                        onChange={(e) =>
                                                            setCurrentQuestion({
                                                                ...currentQuestion,
                                                                resposta_geral:
                                                                    e.target.value,
                                                            })
                                                        }
                                                        disabled={currentQuestion.anulada}
                                                        className="text-7xl text-white font-bold text-center bg-transparent w-full h-full p-2 border-none focus:ring-0 disabled:opacity-50"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap items-center gap-3 place-content-between justify-items-center m-0 mt-6 pt-4 border-t border-gray-600">
                                            <button
                                                onClick={handleVoltar}
                                                disabled={currentQuestionIndex === 0}
                                                className="flex-1 py-3 px-4 rounded-lg text-lg font-bold text-gray-100 bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200 ease-in-out shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                            >
                                                Anterior
                                            </button>
                                            <button
                                                onClick={handleAvancar}
                                                className="flex-1 py-3 px-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition duration-200 ease-in-out shadow-md transform hover:scale-105"
                                            >
                                                Próxima
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {questoes.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-gray-600">
                                        <button
                                            onClick={handleFinalizar}
                                            className="w-full py-3 px-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition duration-200 ease-in-out shadow-lg transform hover:scale-105"
                                        >
                                            Finalizar e Salvar
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AddVestibularPage