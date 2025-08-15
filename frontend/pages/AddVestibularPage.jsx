import { useState, useEffect } from "react";

function AddVestibularPage() {
    // Estado para armazenar os dados do vestibular (nome, ano e tipo).
    const [vestibular, setVestibular] = useState(null);
    // Estado para armazenar a lista de todas as questões adicionadas.
    const [questoes, setQuestoes] = useState([]);
    // Estado para a questão sendo configurada no momento.
    const [currentQuestion, setCurrentQuestion] = useState(null);
    // Índice da questão atual sendo exibida.
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Inicializa o estado da primeira questão quando o vestibular é definido.
    useEffect(() => {
        if (vestibular && questoes.length === 0 && currentQuestion === null) {
            setCurrentQuestion({
                numero: 1,
                ehIdioma: false,
                respostasIdioma: {
                    ingles: "",
                    espanhol: "",
                    frances: "",
                },
                respostaGeral: "",
            });
        }
    }, [vestibular, questoes, currentQuestion]);

    // Função para salvar o nome, ano e tipo do vestibular.
    const handleSalvarVestibular = (e) => {
        e.preventDefault();
        setVestibular({
            nome: e.target.nome.value,
            ano: e.target.ano.value,
            tipo: e.target.tipo.value,
        });
    };

    // Salva a questão atual e avança para a próxima.
    const handleAvancar = () => {
        if (!currentQuestion) return;

        const questaoParaSalvar = { ...currentQuestion };

        if (currentQuestionIndex >= questoes.length) {
            // Adiciona uma nova questão se for a última.
            setQuestoes([...questoes, questaoParaSalvar]);
        } else {
            // Atualiza a questão existente se estiver editando.
            const newQuestoes = [...questoes];
            newQuestoes[currentQuestionIndex] = questaoParaSalvar;
            setQuestoes(newQuestoes);
        }

        // Move para a próxima questão ou cria uma nova.
        const newIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(newIndex);
        if (newIndex < questoes.length) {
            setCurrentQuestion(questoes[newIndex]);
        } else {
            setCurrentQuestion({
                numero: newIndex + 1,
                ehIdioma: false,
                respostasIdioma: {
                    ingles: "",
                    espanhol: "",
                    frances: "",
                },
                respostaGeral: "",
            });
        }
    };

    // Volta para a questão anterior.
    const handleVoltar = () => {
        if (currentQuestionIndex > 0) {
            // Salva o estado atual antes de voltar.
            const newQuestoes = [...questoes];
            newQuestoes[currentQuestionIndex] = currentQuestion;
            setQuestoes(newQuestoes);

            const newIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(newIndex);
            setCurrentQuestion(questoes[newIndex]);
        }
    };

    // Função para salvar todos os dados no final.
    const handleFinalizar = () => {
        // Salva a última questão antes de finalizar.
        if (currentQuestion) {
            if (currentQuestionIndex >= questoes.length) {
                setQuestoes([...questoes, currentQuestion]);
            } else {
                const newQuestoes = [...questoes];
                newQuestoes[currentQuestionIndex] = currentQuestion;
                setQuestoes(newQuestoes);
            }
        }

        // Nesta etapa, você faria a chamada para a sua API para salvar os dados.
        console.log("Dados a serem enviados para a API:");
        console.log("Vestibular:", vestibular);
        console.log("Questões:", questoes);

        alert(
            "Dados salvos com sucesso! Verifique o console para os detalhes."
        );
        // Reseta a aplicação para um novo vestibular.
        setVestibular(null);
        setQuestoes([]);
        setCurrentQuestion(null);
        setCurrentQuestionIndex(0);
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 p-8 font-sans antialiased flex items-center justify-center text-gray-100">
            <style>
                {`
          /* Remove as setas (spinners) de inputs de número */
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
                                className="mt-1 block w-full h-12 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                            >
                                <option value="Vestibular">Vestibular</option>
                                <option value="PAS">PAS</option>
                            </select>
                        </div>
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
                            Adicionar Questões: {vestibular.nome} (
                            {vestibular.ano})
                        </h2>

                        {currentQuestion && (
                            <div className="p-6 bg-gray-700 rounded-xl space-y-5 border border-gray-600 shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-50">
                                        Questão {currentQuestion.numero}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2 mt-4">
                                    <input
                                        type="checkbox"
                                        id="ehIdioma"
                                        checked={currentQuestion.ehIdioma}
                                        onChange={(e) =>
                                            setCurrentQuestion({
                                                ...currentQuestion,
                                                ehIdioma: e.target.checked,
                                                respostaGeral: "",
                                                respostasIdioma: {
                                                    ingles: "",
                                                    espanhol: "",
                                                    frances: "",
                                                },
                                            })
                                        }
                                        className="rounded text-purple-600 bg-gray-800 border-gray-600 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                                    />
                                    <label
                                        htmlFor="ehIdioma"
                                        className="text-sm font-medium text-gray-400"
                                    >
                                        Questão de Idioma
                                    </label>
                                </div>

                                {currentQuestion.ehIdioma ? (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {["ingles", "espanhol", "frances"].map(
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
                                                                    .respostasIdioma[
                                                                    idioma
                                                                ]
                                                            }
                                                            onChange={(e) =>
                                                                setCurrentQuestion(
                                                                    {
                                                                        ...currentQuestion,
                                                                        respostasIdioma:
                                                                            {
                                                                                ...currentQuestion.respostasIdioma,
                                                                                [idioma]:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                    }
                                                                )
                                                            }
                                                            className="text-4xl text-white font-bold text-center bg-transparent w-full h-full p-2 border-none focus:ring-0"
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <label
                                            htmlFor="respostaGeral"
                                            className="block text-sm font-medium text-gray-400"
                                        >
                                            Gabarito
                                        </label>
                                        <div className="mt-1 flex items-center justify-center h-40 w-full rounded-lg border-2 border-gray-600 bg-gray-800 shadow-sm">
                                            <input
                                                type="number"
                                                id="respostaGeral"
                                                value={
                                                    currentQuestion.respostaGeral
                                                }
                                                onChange={(e) =>
                                                    setCurrentQuestion({
                                                        ...currentQuestion,
                                                        respostaGeral:
                                                            e.target.value,
                                                    })
                                                }
                                                className="text-7xl text-white font-bold text-center bg-transparent w-full h-full p-2 border-none focus:ring-0"
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
            </div>
        </div>
    );
}

export default AddVestibularPage;
