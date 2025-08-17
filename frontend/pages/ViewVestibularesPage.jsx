import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, ArrowRight } from "lucide-react";

function ViewVestibularesPage() {
    const navigate = useNavigate();
    const [vestibulares, setVestibulares] = useState([]);
    const [isEditingGabarito, setIsEditingGabarito] = useState(false);
    const [currentVestibular, setCurrentVestibular] = useState(null);
    const [editedQuestoes, setEditedQuestoes] = useState([]);
    const [vestibularToDelete, setVestibularToDelete] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const fetchVestibulares = async () => {
        try {
            const apiBaseUrl = import.meta.env.VITE_BASE_URL_API;

            const response_vestibulares = await fetch(apiBaseUrl + "vestibulares");
            if (!response_vestibulares.ok) {
                throw new Error("Erro ao carregar a lista de vestibulares.");
            }
            const data_vestibulares = await response_vestibulares.json();

            const response_pas = await fetch(apiBaseUrl + "pas/true");
            if (!response_pas.ok) {
                throw new Error("Erro ao carregar a lista de vestibulares.");
            }
            const data_pas = await response_pas.json();
            setVestibulares([...data_vestibulares, ...data_pas]);

        } catch (error) {
            setError(error.message);
        }
    };
    const fetchQuestoes = async (vestibularId) => {
        try {
            const apiBaseUrl = import.meta.env.VITE_BASE_URL_API || 'http://localhost:8000/api/';
            const response = await fetch(`${apiBaseUrl}questoes/${vestibularId}`);
            if (!response.ok) {
                throw new Error("Erro ao carregar as questões do vestibular.");
            }
            const data = await response.json();
            setEditedQuestoes(data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchVestibulares();
    }, []);

    const handleEditGabaritoClick = (vestibular) => {
        setCurrentVestibular(vestibular);
        fetchQuestoes(vestibular.id);
        setIsEditingGabarito(true);
    };

    // Updated to handle 'anulada' field
    const handleUpdateQuestion = (index, field, value) => {
        const newQuestoes = [...editedQuestoes];
        newQuestoes[index] = { ...newQuestoes[index], [field]: value };
        // If question is 'anulada', clear other fields
        if (field === 'anulada' && value === true) {
            newQuestoes[index].eh_idioma = false;
            newQuestoes[index].resposta_geral = null;
            newQuestoes[index].respostas_idioma = { ingles: null, espanhol: null, frances: null };
        }
        setEditedQuestoes(newQuestoes);
    };

    const handleUpdateLanguageAnswer = (index, idioma, value) => {
        const newQuestoes = [...editedQuestoes];
        newQuestoes[index] = {
            ...newQuestoes[index],
            respostas_idioma: {
                ...newQuestoes[index].respostas_idioma,
                [idioma]: value,
            },
        };
        setEditedQuestoes(newQuestoes);
    };

    const handleSaveGabarito = async () => {
        const apiBaseUrl = import.meta.env.VITE_BASE_URL_API || 'http://localhost:8000/api/';
        try {
            console.log(editedQuestoes)
            const response = await fetch(apiBaseUrl + 'salva_gabarito/' + currentVestibular.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                
                body: JSON.stringify({
                    vestibularId: currentVestibular.id,
                    questoes: editedQuestoes,
                }),
            });
            if (!response.ok) {
                throw new Error("Erro ao salvar as alterações do gabarito.");
            }
            setSuccessMessage("Gabarito atualizado com sucesso!");
            handleCloseGabaritoEditor();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCloseGabaritoEditor = () => {
        setIsEditingGabarito(false);
        setCurrentVestibular(null);
        setEditedQuestoes([]);
        setError(null);
        setSuccessMessage(null);
    };

    const handleDeleteClick = (vestibular) => {
        setVestibularToDelete(vestibular);
    };

    const handleCancelDelete = () => {
        setVestibularToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!vestibularToDelete) return;

        try {
            const apiBaseUrl = import.meta.env.VITE_BASE_URL_API;
            const response = await fetch(`${apiBaseUrl}delete/vestibulares/${vestibularToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Erro ao deletar o vestibular.");
            }

            setVestibulares(vestibulares.filter(v => v.id !== vestibularToDelete.id));
            setSuccessMessage("Vestibular deletado com sucesso!");
            setVestibularToDelete(null);
        } catch (error) {
            setError(error.message);
            setVestibularToDelete(null);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 p-8 font-sans antialiased flex items-center justify-center text-gray-100">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-50">
                        Vestibulares Existentes
                    </h1>
                    <button
                        onClick={() => navigate('/add/vestibulares')}
                        className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition duration-200"
                    >
                        Adicionar Novo Vestibular
                    </button>
                </div>
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

                {vestibularToDelete && (
                    <div className="fixed inset-0 bg-gray-950 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-sm w-full">
                            <h2 className="text-xl font-bold text-gray-50 mb-4">Confirmar Exclusão</h2>
                            <p className="text-gray-300 mb-6">
                                Tem certeza que deseja deletar o vestibular <span className="font-semibold">{vestibularToDelete.nome}</span>? Esta ação não pode ser desfeita.
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={handleCancelDelete}
                                    className="px-4 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!isEditingGabarito ? (
                    <div className="space-y-4">
                        {vestibulares.length === 0 ? (
                            <p className="text-center text-gray-400">Nenhum vestibular encontrado.</p>
                        ) : (
                            vestibulares.map((vestibular) => (
                                <div
                                    key={vestibular.id}
                                    className="bg-gray-700 p-4 rounded-lg flex justify-between items-center shadow-md"
                                >
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-50">
                                            {vestibular.nome} ({vestibular.ano})
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            Tipo: {vestibular.tipo.toUpperCase()}
                                            {vestibular.serie && ` - Série: ${vestibular.serie}`}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditGabaritoClick(vestibular)}
                                            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                                        >
                                            Editar Gabarito
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(vestibular)}
                                            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition duration-200"
                                        >
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-50 mb-4 text-center">
                            Editando Gabarito: {currentVestibular.nome}
                        </h2>
                        <div className="p-6 bg-gray-700 rounded-xl space-y-4 border border-gray-600 shadow-md">
                            {editedQuestoes.map((questao, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-2">
                                    <div className="flex items-center gap-4 justify-between">
                                        <label htmlFor={`questao-${index}`} className="text-lg font-bold text-gray-50">
                                            Questão {index + 1}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`anulada-${index}`}
                                                checked={questao.anulada}
                                                onChange={(e) => {
                                                    const isAnulada = e.target.checked;
                                                    handleUpdateQuestion(index, 'anulada', isAnulada);
                                                }}
                                                className="rounded text-red-600 bg-gray-800 border-gray-600 shadow-sm focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                                            />
                                            <label htmlFor={`anulada-${index}`} className="text-sm font-medium text-gray-400">
                                                Anulada
                                            </label>
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-2 mt-4 ${questao.anulada ? 'opacity-50' : ''}`}>
                                        <input
                                            type="checkbox"
                                            id={`eh_idioma-${index}`}
                                            checked={questao.eh_idioma}
                                            onChange={(e) => {
                                                handleUpdateQuestion(index, 'eh_idioma', e.target.checked);
                                                if (e.target.checked) {
                                                    handleUpdateQuestion(index, 'resposta_geral', null);
                                                } else {
                                                    handleUpdateQuestion(index, 'respostas_idioma', { ingles: null, espanhol: null, frances: null });
                                                }
                                            }}
                                            disabled={questao.anulada}
                                            className="rounded text-purple-600 bg-gray-800 border-gray-600 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <label htmlFor={`eh_idioma-${index}`} className="text-sm font-medium text-gray-400">
                                            Questão de Idioma
                                        </label>
                                    </div>
                                    
                                    {!questao.anulada && (
                                        questao.eh_idioma ? (
                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {["espanhol", "frances", "ingles",].map(
                                                    (idioma) => (
                                                        <div key={idioma}>
                                                            <label
                                                                htmlFor={`${idioma}-${index}`}
                                                                className="block text-sm font-medium text-gray-400"
                                                            >
                                                                Gabarito {idioma.charAt(0).toUpperCase() + idioma.slice(1)}:
                                                            </label>
                                                            <input
                                                                type="number"
                                                                id={`${idioma}-${index}`}
                                                                value={questao.respostas_idioma[idioma]}
                                                                onChange={(e) => handleUpdateLanguageAnswer(index, idioma, e.target.value)}
                                                                className="mt-1 block w-full h-10 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm"
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <label htmlFor={`resposta_geral-${index}`} className="block text-sm font-medium text-gray-400">
                                                    Gabarito:
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`resposta_geral-${index}`}
                                                    value={questao.resposta_geral}
                                                    onChange={(e) => handleUpdateQuestion(index, 'resposta_geral', e.target.value)}
                                                    className="mt-1 block w-full h-10 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm"
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={handleCloseGabaritoEditor}
                                type="button"
                                className="px-4 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleSaveGabarito}
                                type="button"
                                className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                            >
                                Salvar Gabarito
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewVestibularesPage;
