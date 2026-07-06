/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, BookOpen, Calendar, Tag, Layers, ImagePlus,
    ChevronDown, Loader2, Save, Plus, Trash2, Hash,
    Globe, CheckSquare, AlertCircle, Check,
} from "lucide-react";
import Link from "next/link";
import { TipoVestibular, Vestibular } from "@/types/vestibular";
import { QuestaoAPI, QuestaoForm } from "@/types/questao";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";




interface QuestaoPreview {
    numero: number;
    resposta_geral: number | null;
    anulada: boolean;
}

interface IdiomaPreview {
    numero: number;
    idioma: string;
    resposta: number;
    anulada: boolean;
}

interface PreviewGabarito {
    questoes: QuestaoPreview[];
    gabarito_idiomas?: IdiomaPreview[];
}

export default function VestibularConfigPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();

    const [vestibular, setVestibular] = useState<Vestibular | null>(null);
    const [questoes, setQuestoes] = useState<QuestaoAPI[]>([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingImport, setLoadingImport] = useState(false);
    const [preview, setPreview] = useState<PreviewGabarito | null>(null);
    const [errorImport, setErrorImport] = useState<string | null>(null);
    const [pdf, setPdf] = useState<File | null>(null);
    const [openModalImport, setOpenModalImport] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [editForm, setEditForm] = useState<{
        nome: string;
        ano: number | "";
        tipo: TipoVestibular;
        serie: 1 | 2 | 3 | "";
        com_gabarito: boolean;
        imagem: File | null;
    } | null>(null);
    const [imagemPreview, setImagemPreview] = useState<string | null>(null);
    const [savingVestibular, setSavingVestibular] = useState(false);
    const [saveVestibularError, setSaveVestibularError] = useState<string | null>(null);
    const [saveVestibularOk, setSaveVestibularOk] = useState(false);

    const [novaQuestao, setNovaQuestao] = useState<QuestaoForm>({
        numero: 1,
        anulada: false,
        is_idioma: false,
        resposta_geral: "",
        espanhol: "",
        frances: "",
        ingles: "",
        anulada_ingles: false,
        anulada_espanhol: false,
        anulada_frances: false,
    });
    const [savingQuestao, setSavingQuestao] = useState(false);
    const [questaoError, setQuestaoError] = useState<string | null>(null);
    const [editingQuestaoId, setEditingQuestaoId] = useState<number | null>(null);
    const [editQuestaoForm, setEditQuestaoForm] = useState<QuestaoForm | null>(null);
    const [savingEditQuestao, setSavingEditQuestao] = useState(false);
    const [editQuestaoError, setEditQuestaoError] = useState<string | null>(null);

    useEffect(() => {
        async function obterDados() {
            const token = localStorage.getItem("access_token");

            const r = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/${id}/`,
                { headers: { Authorization: `Bearer ${token}` } },
            );

            if (!r.ok) {
                setLoadError("Vestibular não encontrado ou excluído.");
                setLoadingPage(false);
                setTimeout(() => {
                    router.push("/configuracoes");
                }, 3000);
                return;
            }

            const v = await r.json();
            setVestibular(v);
            setEditForm({
                nome: v.nome,
                ano: v.ano,
                tipo: v.tipo as TipoVestibular,
                serie: (Number(v.serie) as 1 | 2 | 3) ?? null,
                com_gabarito: v.com_gabarito,
                imagem: null,
            });
            if (v.imagem) setImagemPreview(v.imagem as string);

            const rq = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/questoes/?vestibular=${id}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            if (rq.ok) {
                const data = await rq.json();
                setQuestoes(Array.isArray(data) ? data : data.results ?? []);
            }

            setLoadingPage(false);
        }
        obterDados();
    }, [id, router]);

    async function handleSaveVestibular(e: React.FormEvent) {
        e.preventDefault();
        if (!editForm) return;
        setSaveVestibularError(null);
        setSaveVestibularOk(false);
        setSavingVestibular(true);
        try {
            const token = localStorage.getItem("access_token");
            const payload = new FormData();
            payload.append("nome", editForm.nome.trim());
            payload.append("ano", String(editForm.ano));
            payload.append("tipo", editForm.tipo);
            if (editForm.tipo === "pas" && editForm.serie)
                payload.append("serie", String(editForm.serie));
            payload.append("com_gabarito", String(editForm.com_gabarito));
            if (editForm.imagem) payload.append("imagem", editForm.imagem);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/${id}/`,
                { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: payload },
            );
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(Object.values(data).flat().join(" ") || "Erro ao salvar.");
            }
            const updated = await res.json();
            setVestibular(updated);
            sessionStorage.setItem(`vestibular:${id}`, JSON.stringify(updated));
            setSaveVestibularOk(true);
            setTimeout(() => setSaveVestibularOk(false), 3000);
        } catch (err: unknown) {
            setSaveVestibularError(err instanceof Error ? err.message : "Erro inesperado.");
        } finally {
            setSavingVestibular(false);
        }
    }

    async function handleAddQuestao(e: React.FormEvent) {
        e.preventDefault();
        setQuestaoError(null);

        if (!novaQuestao.numero) return setQuestaoError("Número é obrigatório.");
        if (!novaQuestao.is_idioma && novaQuestao.resposta_geral === "")
            return setQuestaoError("Informe a resposta.");
        if (novaQuestao.is_idioma) {
            const precisaIngles   = !novaQuestao.anulada_ingles   && novaQuestao.ingles === "";
            const precisaEspanhol = !novaQuestao.anulada_espanhol && novaQuestao.espanhol === "";
            const precisaFrances  = !novaQuestao.anulada_frances  && novaQuestao.frances === "";
            if (precisaIngles || precisaEspanhol || precisaFrances)
                return setQuestaoError("Informe a resposta ou marque como anulada para cada idioma.");
        }
        if (questoes.find((q) => q.numero === novaQuestao.numero))
            return setQuestaoError(`Questão ${novaQuestao.numero} já existe.`);

        setSavingQuestao(true);
        try {
            const token = localStorage.getItem("access_token");
            const body = {
                vestibular: Number(id),
                numero: novaQuestao.numero,
                anulada: novaQuestao.anulada,
                resposta_geral: novaQuestao.is_idioma ? null : Number(novaQuestao.resposta_geral),
            };


            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questoes/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(Object.values(data).flat().join(" ") || "Erro ao criar questão.");
            }
            const created: QuestaoAPI = await res.json();

            if (novaQuestao.is_idioma) {
                const idiomasPayload = [
                    { idioma: "espanhol", resposta: Number(novaQuestao.espanhol), anulada: novaQuestao.anulada_espanhol },
                    { idioma: "frances",  resposta: Number(novaQuestao.frances),  anulada: novaQuestao.anulada_frances },
                    { idioma: "ingles",   resposta: Number(novaQuestao.ingles),   anulada: novaQuestao.anulada_ingles },
                ];
                const gabsComId: { id?: number; idioma: string; resposta: number; anulada: boolean }[] = [];
                for (const g of idiomasPayload) {
                    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questoes-idioma/`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                        body: JSON.stringify({ questao: created.id, ...g }),
                    });
                    const saved = await r.json();
                    gabsComId.push(saved);
                }
                created.gabaritos_idioma = gabsComId;
            }

            setQuestoes((prev) => [...prev, created].sort((a, b) => a.numero - b.numero));
            setNovaQuestao((p) => ({
                numero: p.numero + 1,
                anulada: false,
                is_idioma: false,
                resposta_geral: "",
                espanhol: "",
                frances: "",
                ingles: "",
                anulada_ingles: false,
                anulada_espanhol: false,
                anulada_frances: false,
            }));
        } catch (err: unknown) {
            setQuestaoError(err instanceof Error ? err.message : "Erro inesperado.");
        } finally {
            setSavingQuestao(false);
        }
    }

    async function handleDeleteQuestao(questaoId: number) {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/questoes/${questaoId}/`,
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) setQuestoes((prev) => prev.filter((q) => q.id !== questaoId));
    }

    function startEditQuestao(q: QuestaoAPI) {
        const isIdioma = q.resposta_geral === null;
        const gi = q.gabaritos_idioma ?? [];
        const get = (lang: string) => gi.find((g) => g.idioma === lang);
        setEditingQuestaoId(q.id!);
        setEditQuestaoForm({
            numero: q.numero,
            anulada: q.anulada,
            is_idioma: isIdioma,
            resposta_geral: isIdioma ? "" : q.resposta_geral ?? "",
            espanhol: Number(get("espanhol")?.resposta ?? ""),
            frances:  Number(get("frances")?.resposta  ?? ""),
            ingles:   Number(get("ingles")?.resposta   ?? ""),
            anulada_ingles:   get("ingles")?.anulada   ?? false,
            anulada_espanhol: get("espanhol")?.anulada ?? false,
            anulada_frances:  get("frances")?.anulada  ?? false,
        });
        setEditQuestaoError(null);
    }

    async function handleSaveEditQuestao(q: QuestaoAPI) {
        if (!editQuestaoForm) return;
        setEditQuestaoError(null);

        if (!editQuestaoForm.is_idioma && editQuestaoForm.resposta_geral === "")
            return setEditQuestaoError("Informe a resposta.");
        if (editQuestaoForm.is_idioma) {
            const precisaIngles   = !editQuestaoForm.anulada_ingles   && editQuestaoForm.ingles === "";
            const precisaEspanhol = !editQuestaoForm.anulada_espanhol && editQuestaoForm.espanhol === "";
            const precisaFrances  = !editQuestaoForm.anulada_frances  && editQuestaoForm.frances === "";
            if (precisaIngles || precisaEspanhol || precisaFrances)
                return setEditQuestaoError("Informe a resposta ou marque como anulada para cada idioma.");
        }

        setSavingEditQuestao(true);
        try {
            const token = localStorage.getItem("access_token");

            const body = {
                anulada: editQuestaoForm.anulada,
                resposta_geral: editQuestaoForm.is_idioma ? null : Number(editQuestaoForm.resposta_geral),
            };
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questoes/${q.id}/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(Object.values(data).flat().join(" ") || "Erro ao salvar.");
            }
            const updated: QuestaoAPI = await res.json();

            if (editQuestaoForm.is_idioma) {
                const gi = q.gabaritos_idioma ?? [];
                const idiomas = [
                    { idioma: "espanhol", resposta: Number(editQuestaoForm.espanhol), anulada: editQuestaoForm.anulada_espanhol },
                    { idioma: "frances",  resposta: Number(editQuestaoForm.frances),  anulada: editQuestaoForm.anulada_frances },
                    { idioma: "ingles",   resposta: Number(editQuestaoForm.ingles),   anulada: editQuestaoForm.anulada_ingles },
                ];
                for (const ig of idiomas) {
                    const existing = gi.find((g) => g.idioma === ig.idioma);
                    if (existing?.id) {
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questoes-idioma/${existing.id}/`, {
                            method: "PATCH",
                            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                            body: JSON.stringify({ resposta: ig.resposta, anulada: ig.anulada }),
                        });
                    } else {
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questoes-idioma/`, {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                            body: JSON.stringify({ questao: q.id, ...ig }),
                        });
                    }
                }
                updated.gabaritos_idioma = idiomas.map((ig) => {
                    const existing = gi.find((g) => g.idioma === ig.idioma);
                    return { ...ig, id: existing?.id };
                });
            }

            setQuestoes((prev) =>
                prev.map((item) => (item.id === q.id ? updated : item)).sort((a, b) => a.numero - b.numero),
            );
            setEditingQuestaoId(null);
            setEditQuestaoForm(null);
        } catch (err: unknown) {
            setEditQuestaoError(err instanceof Error ? err.message : "Erro inesperado.");
        } finally {
            setSavingEditQuestao(false);
        }
    }

    async function handlePreviewGabarito() {
        setLoadingImport(true);
        setErrorImport(null);

        try {
            const token = localStorage.getItem("access_token");

            const formData = new FormData()
            if (!pdf) {
                return setErrorImport("O arquivo é obrigatório")
            }
            formData.append("file", pdf)

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/questoes/preview-gabarito/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,                    
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.erro || "Erro ao importar gabarito");
            }

            setPreview(data);

        } catch (err) {
            setErrorImport(err instanceof Error ? err.message : String(err));
        } finally {
            setLoadingImport(false);
        }
    }

    async function handleImportGabarito() {
        if (!preview) return;
        try {
            const token = localStorage.getItem("access_token");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/questoes/confirmar-importacao/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        vestibular_id: Number(id),
                        questoes: preview.questoes,
                        gabarito_idiomas: preview.gabarito_idiomas,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.erro || "Erro ao confirmar importação");
            }

            const rq = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/questoes/?vestibular=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (rq.ok) {
                const data = await rq.json();
                setQuestoes(Array.isArray(data) ? data : data.results ?? []);
            }

            setOpenModalImport(false);
            setPreview(null);

        } catch (err) {
            console.error(err);
            setErrorImport(err instanceof Error ? err.message : String(err));
        }
    }


    if (loadError) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-10 w-10 text-destructive animate-pulse" />
                <p className="text-foreground text-lg font-semibold">{loadError}</p>
                <p className="text-muted-foreground text-sm">Redirecionando em instantes...</p>
            </div>
        );
    }

    if (loadingPage || !editForm) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
        );
    }

    const isPas = editForm.tipo === "pas";

    return (
        <div className="min-h-screen bg-background">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-primary/5 blur-[100px]" />
            </div>

            <div className="relative container mx-auto px-4 py-10 max-w-2xl space-y-12">

                <div>
                    <Link
                        href="/configuracoes"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        Voltar para Vestibulares
                    </Link>
                    <h1 className="text-foreground text-3xl font-bold tracking-tight">{vestibular?.nome}</h1>
                    <p className="text-muted-foreground text-sm mt-1 capitalize">
                        {vestibular?.tipo}
                        {vestibular?.serie ? ` · ${vestibular.serie}ª série` : ""}
                        {" · "}{vestibular?.ano}
                    </p>
                </div>

                <section>
                    <CabecalhoSecao number="01" title="Informações do Vestibular" />

                    <form onSubmit={handleSaveVestibular} className="space-y-6 mt-6">
                        <CampoFormulario icon={<BookOpen className="h-4 w-4" />} label="Nome" required>
                            <input
                                type="text"
                                value={editForm.nome}
                                onChange={(e) => setEditForm((p) => p && { ...p, nome: e.target.value })}
                                maxLength={100}
                                className={inputClass}
                            />
                        </CampoFormulario>

                        <div className="grid grid-cols-2 gap-4">
                            <CampoFormulario icon={<Calendar className="h-4 w-4" />} label="Ano" required>
                                <input
                                    type="number"
                                    value={editForm.ano}
                                    onChange={(e) =>
                                        setEditForm((p) => p && { ...p, ano: e.target.value ? Number(e.target.value) : "" })
                                    }
                                    min={2000}
                                    max={2030}
                                    className={inputClass}
                                />
                            </CampoFormulario>

                            <CampoFormulario icon={<Tag className="h-4 w-4" />} label="Tipo" required>
                                <div className="relative">
                                    <select
                                        value={editForm.tipo}
                                        onChange={(e) =>
                                            setEditForm((p) => p && { ...p, tipo: e.target.value as TipoVestibular, serie: "" })
                                        }
                                        className={`${inputClass} appearance-none pr-9`}
                                    >
                                        <option value="vestibular">Vestibular</option>
                                        <option value="pas">PAS</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </CampoFormulario>
                        </div>

                        <div className={`transition-all duration-300 overflow-hidden ${isPas ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
                            <CampoFormulario icon={<Layers className="h-4 w-4" />} label="Série" required={isPas}>
                                <div className="grid grid-cols-3 gap-3">
                                    {([1, 2, 3] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setEditForm((p) => p && { ...p, serie: s })}
                                            className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                                                editForm.serie === s
                                                    ? "bg-primary border-primary text-primary-foreground shadow-xs"
                                                    : "bg-card border-border text-muted-foreground hover:border-border hover:text-foreground"
                                            }`}
                                        >
                                            {s}ª Série
                                        </button>
                                    ))}
                                </div>
                            </CampoFormulario>
                        </div>

                        <CampoFormulario icon={<ImagePlus className="h-4 w-4" />} label="Imagem">
                            <label className="group relative flex items-center gap-4 cursor-pointer rounded-xl border border-border bg-card/40 px-4 py-3 hover:border-border/80 transition-colors">
                                <div className="shrink-0 w-14 h-14 rounded-lg border border-border bg-card/60 overflow-hidden flex items-center justify-center">
                                    {imagemPreview ? (
                                        <img src={imagemPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImagePlus className="h-5 w-5 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-foreground font-medium truncate">
                                        {editForm.imagem ? editForm.imagem.name : "Trocar imagem"}
                                    </p>
                                    <p className="text-xs text-muted-foreground/60 mt-0.5">PNG, JPG, WEBP · opcional</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        setEditForm((p) => p && { ...p, imagem: file });
                                        if (file) setImagemPreview(URL.createObjectURL(file));
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </label>
                        </CampoFormulario>

                        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
                            <Alternador
                                icon={<CheckSquare className="h-4 w-4" />}
                                label="Com Gabarito"
                                description="Gabarito oficial já disponível"
                                checked={editForm.com_gabarito}
                                onChange={(v) => setEditForm((p) => p && { ...p, com_gabarito: v })}
                            />
                        </div>

                        {saveVestibularError && <CaixaErro message={saveVestibularError} />}

                        <div className="flex items-center justify-end gap-3">
                            {saveVestibularOk && (
                                <span className="flex items-center gap-1.5 text-sm text-green-400">
                                    <Check className="h-4 w-4" /> Salvo com sucesso
                                </span>
                            )}
                            <button
                                type="submit"
                                disabled={savingVestibular}
                                className="flex items-center cursor-pointer gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-60 transition-all shadow-xs"
                            >
                                {savingVestibular ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {savingVestibular ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </form>
                </section>

                <div className="border-t border-border" />

                <section>
                    <CabecalhoSecao number="02" title={`Questões (${questoes.length})`} />

                    {questoes.length > 0 && (
                        <div className="mt-6 rounded-2xl border border-border overflow-hidden mb-8">
                            <ul className="divide-y divide-border">
                                {questoes.map((q) => {
                                    const isEditing = editingQuestaoId === q.id;
                                    const f = editQuestaoForm;

                                    return (
                                        <li key={q.id} className="bg-card">
                                            <div className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-accent/10 transition-colors">
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <span className="shrink-0 w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center">
                                                        {q.numero}
                                                    </span>
                                                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                                                        {q.resposta_geral !== null ? (
                                                            <span className="text-sm text-muted-foreground">
                                                                Resposta:{" "}
                                                                <span className="text-foreground font-semibold">{q.resposta_geral}</span>
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
                                                                    <Globe className="h-3 w-3" /> Idioma
                                                                </span>
                                                                {q.gabaritos_idioma?.map((g) => (
                                                                    <span key={g.idioma} className="text-xs text-muted-foreground capitalize">
                                                                        {g.idioma}:{" "}
                                                                        <span className="text-foreground">{g.anulada ? "Anulada" : g.resposta}</span>
                                                                    </span>
                                                                ))}
                                                            </>
                                                        )}
                                                        {q.anulada && (
                                                            <span className="text-[10px] font-bold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                                                                Anulada
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => isEditing ? (setEditingQuestaoId(null), setEditQuestaoForm(null)) : startEditQuestao(q)}
                                                        className={`p-1.5 rounded-lg transition-colors ${isEditing ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => q.id && handleDeleteQuestao(q.id)}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {isEditing && f && (
                                                <div className="px-5 pb-5 pt-2 border-t border-border space-y-4">

                                                    <div className="rounded-xl border border-border overflow-hidden">
                                                        <Alternador
                                                            icon={<AlertCircle className="h-4 w-4" />}
                                                            label="Anulada"
                                                            description="Questão sem resposta válida"
                                                            checked={f.anulada}
                                                            onChange={(v) => setEditQuestaoForm((p) => p && { ...p, anulada: v })}
                                                        />
                                                    </div>

                                                    {!f.is_idioma && (
                                                        <CampoFormulario icon={<Hash className="h-4 w-4" />} label="Resposta (0–31)" required>
                                                            <input
                                                                type="number"
                                                                value={f.resposta_geral}
                                                                onChange={(e) =>
                                                                    setEditQuestaoForm((p) => p && { ...p, resposta_geral: e.target.value ? Number(e.target.value) : "" })
                                                                }
                                                                min={0} max={31}
                                                                className={inputClass}
                                                            />
                                                        </CampoFormulario>
                                                    )}

                                                    {f.is_idioma && (
                                                        <div className="space-y-3">
                                                            {(["espanhol", "frances", "ingles"] as const).map((lang) => {
                                                                const labelMap = { espanhol: "Espanhol", frances: "Francês", ingles: "Inglês" };
                                                                const anuladaKey = `anulada_${lang}` as "anulada_ingles" | "anulada_espanhol" | "anulada_frances";
                                                                const isAnulada = f[anuladaKey];
                                                                return (
                                                                    <div key={lang} className="rounded-xl border border-border bg-card p-4 space-y-3">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                                                {labelMap[lang]}
                                                                            </span>
                                                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                                                <span className="text-xs text-muted-foreground">Anulada</span>
                                                                                <div
                                                                                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${isAnulada ? "bg-destructive" : "bg-muted-foreground/30"}`}
                                                                                    onClick={() => setEditQuestaoForm((p) => p && { ...p, [anuladaKey]: !p[anuladaKey] })}
                                                                                >
                                                                                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background shadow transition-transform duration-200 ${isAnulada ? "translate-x-4" : "translate-x-0"}`} />
                                                                                </div>
                                                                            </label>
                                                                        </div>
                                                                        {!isAnulada && (
                                                                            <input
                                                                                type="number"
                                                                                value={f[lang]}
                                                                                onChange={(e) =>
                                                                                    setEditQuestaoForm((p) => p && { ...p, [lang]: e.target.value ? Number(e.target.value) : "" })
                                                                                }
                                                                                min={0} max={31}
                                                                                placeholder="Resposta (0–31)"
                                                                                className={inputClass}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {editQuestaoError && <CaixaErro message={editQuestaoError} />}

                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setEditingQuestaoId(null); setEditQuestaoForm(null); }}
                                                            className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSaveEditQuestao(q)}
                                                            disabled={savingEditQuestao}
                                                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-60 transition-all shadow-xs"
                                                        >
                                                            {savingEditQuestao ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                            {savingEditQuestao ? "Salvando..." : "Salvar"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {questoes.length === 0 && (
                        <p className="mt-4 mb-8 text-sm text-muted-foreground">Nenhuma questão cadastrada ainda.</p>
                    )}

                    <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                            Adicionar Questão
                        </p>

                        <form onSubmit={handleAddQuestao} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <CampoFormulario icon={<Hash className="h-4 w-4" />} label="Número" required>
                                    <input
                                        type="number"
                                        value={novaQuestao.numero}
                                        onChange={(e) =>
                                            setNovaQuestao((p) => ({ ...p, numero: Number(e.target.value) }))
                                        }
                                        min={1}
                                        max={50}
                                        className={inputClass}
                                    />
                                </CampoFormulario>

                                {!novaQuestao.is_idioma && (
                                    <CampoFormulario icon={<Hash className="h-4 w-4" />} label="Resposta (0–31)" required>
                                        <input
                                            type="number"
                                            value={novaQuestao.resposta_geral}
                                            onChange={(e) =>
                                                setNovaQuestao((p) => ({
                                                    ...p,
                                                    resposta_geral: e.target.value ? Number(e.target.value) : "",
                                                }))
                                            }
                                            min={0}
                                            max={31}
                                            className={inputClass}
                                        />
                                    </CampoFormulario>
                                )}
                            </div>

                            {novaQuestao.is_idioma && (
                                <div className="space-y-3">
                                    {(["espanhol", "frances", "ingles"] as const).map((lang) => {
                                        const labelMap = { espanhol: "Espanhol", frances: "Francês", ingles: "Inglês" };
                                        const anuladaKey = `anulada_${lang}` as "anulada_ingles" | "anulada_espanhol" | "anulada_frances";
                                        const isAnulada = novaQuestao[anuladaKey];

                                        return (
                                            <div key={lang} className="rounded-xl border border-border bg-card p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                        {labelMap[lang]}
                                                    </span>
                                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                                        <span className="text-xs text-muted-foreground">Anulada</span>
                                                        <div
                                                            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${isAnulada ? "bg-destructive" : "bg-muted-foreground/30"}`}
                                                            onClick={() => setNovaQuestao((p) => ({ ...p, [anuladaKey]: !p[anuladaKey] }))}
                                                        >
                                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background shadow transition-transform duration-200 ${isAnulada ? "translate-x-4" : "translate-x-0"}`} />
                                                        </div>
                                                    </label>
                                                </div>

                                                {!isAnulada && (
                                                    <input
                                                        type="number"
                                                        value={novaQuestao[lang]}
                                                        onChange={(e) =>
                                                            setNovaQuestao((p) => ({
                                                                ...p,
                                                                [lang]: e.target.value ? Number(e.target.value) : "",
                                                            }))
                                                        }
                                                        min={0}
                                                        max={31}
                                                        placeholder="Resposta (0–31)"
                                                        className={inputClass}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
                                <Alternador
                                    icon={<Globe className="h-4 w-4" />}
                                    label="Questão de Idioma"
                                    description="Inglês, Espanhol e Francês com respostas separadas"
                                    checked={novaQuestao.is_idioma}
                                    onChange={(v) =>
                                        setNovaQuestao((p) => ({
                                            ...p,
                                            is_idioma: v,
                                            resposta_geral: "",
                                            espanhol: "",
                                            frances: "",
                                            ingles: "",
                                        }))
                                    }
                                />
                                <Alternador
                                    icon={<AlertCircle className="h-4 w-4" />}
                                    label="Anulada"
                                    description="Questão sem resposta válida"
                                    checked={novaQuestao.anulada}
                                    onChange={(v) => setNovaQuestao((p) => ({ ...p, anulada: v }))}
                                />
                            </div>

                            {questaoError && <CaixaErro message={questaoError} />}

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setOpenModalImport(true)}
                                    className="flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-xs"
                                >
                                    Importar Gabarito UEM
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingQuestao}
                                    className="flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-60 transition-all shadow-xs"
                                >
                                    {savingQuestao ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                    {savingQuestao ? "Adicionando..." : "Adicionar Questão"}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
            <Dialog open={openModalImport} onOpenChange={setOpenModalImport}>
                <DialogContent className="max-w-2xl bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">
                            Importar Gabarito UEM
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">

                        <label className="relative flex flex-col items-center justify-center gap-3 border border-dashed border-primary/50 rounded-2xl p-10 cursor-pointer bg-primary/5 hover:bg-primary/10 hover:border-primary/80 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" className="text-primary" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                <polyline points="14,2 14,8 20,8" stroke="currentColor" className="text-primary" strokeWidth="1.8" strokeLinecap="round"/>
                                <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" className="text-primary" strokeWidth="1.8" strokeLinecap="round"/>
                                <polyline points="9,15 12,12 15,15" stroke="currentColor" className="text-primary" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>

                            {pdf ? (
                                <p className="text-muted-foreground text-sm font-medium">{pdf.name}</p>
                            ) : (
                                <>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Arraste o PDF ou{" "}
                                    <span className="text-primary underline">escolha um arquivo</span>
                                </p>
                                <p className="text-muted-foreground/60 text-xs">Somente arquivos .pdf</p>
                                </>
                            )}

                            <input
                                type="file"
                                accept=".pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                onChange={(e) => setPdf(e.target.files?.[0] || null)}
                            />
                            </label>

                        <button
                            onClick={handlePreviewGabarito}
                            disabled={loadingImport}
                            className="w-full cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-60"
                        >
                            {loadingImport ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Buscar Preview"
                            )}
                        </button>

                        {errorImport && (
                            <CaixaErro message={errorImport} />
                        )}

                        {preview && (
                            <div className="mt-4 max-h-100 overflow-y-auto border border-border rounded-xl p-4 bg-card space-y-3">
                                <p className="text-sm text-muted-foreground font-semibold">
                                    Preview do Gabarito:
                                </p>

                                {preview.questoes.map((q: QuestaoPreview) => {
                                    const idiomasDestaQuestao = preview.gabarito_idiomas?.filter(
                                        (g: IdiomaPreview) => g.numero === q.numero
                                    );

                                    return (
                                        <div
                                            key={q.numero}
                                            className="flex flex-col border-b border-border pb-2 pt-1"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground font-medium">
                                                    Questão {q.numero}
                                                </span>

                                                {q.resposta_geral !== null ? (
                                                    <span className="text-sm text-foreground font-bold">
                                                        {q.resposta_geral}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Globe className="h-3 w-3" /> Idioma
                                                    </span>
                                                )}
                                            </div>

                                            {q.resposta_geral === null && idiomasDestaQuestao && (
                                                <div className="flex border-t border-border justify-around gap-4 mt-2 pt-1 px-2 py-1.5 rounded-lg">
                                                    {idiomasDestaQuestao.map((g: IdiomaPreview, idx: number) => (
                                                        <div key={idx} className="text-xs">
                                                            <span className="text-muted-foreground capitalize">{g.idioma}: </span>
                                                            <span className="text-foreground font-mono">
                                                                {g.anulada ? "Anulada" : String(g.resposta).padStart(2, '0')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {preview && (
                            <button
                                className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500"
                                onClick={handleImportGabarito}
                            >
                                Confirmar Importação
                            </button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const inputClass =
    "w-full bg-input/30 border border-input rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all";

function CabecalhoSecao({ number, title }: { number: string; title: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-primary/60 tabular-nums">{number}</span>
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">{title}</h2>
            <div className="h-px flex-1 bg-border" />
        </div>
    );
}

function CampoFormulario({
    icon, label, required, children,
}: {
    icon: React.ReactNode; label: string; required?: boolean; children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span className="text-muted-foreground/60">{icon}</span>
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
            </label>
            {children}
        </div>
    );
}

function Alternador({
    icon, label, description, checked, onChange,
}: {
    icon: React.ReactNode; label: string; description: string;
    checked: boolean; onChange: (v: boolean) => void;
}) {
    return (
        <div
            role="button"
            tabIndex={0}
            className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-accent/10 transition-colors"
            onClick={() => onChange(!checked)}
            onKeyDown={(e) => e.key === " " && onChange(!checked)}
        >
            <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{icon}</span>
                <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
            </div>
            <div className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}>
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-background shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
            </div>
        </div>
    );
}

function CaixaErro({ message }: { message: string }) {
    return (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {message}
        </div>
    );
}