"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import {
    ArrowLeft, BookOpen, Calendar, Tag, Layers, ImagePlus,
    ChevronDown, Loader2, Save, Plus, Trash2, Hash,
    Globe, CheckSquare, ToggleLeft, AlertCircle, Check,
} from "lucide-react";
import Link from "next/link";
import { TipoVestibular, Vestibular } from "@/types/vestibular";
import { QuestaoAPI, QuestaoForm } from "@/types/questao";




export default function VestibularConfigPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const [vestibular, setVestibular] = useState<Vestibular | null>(null);
    const [questoes, setQuestoes] = useState<QuestaoAPI[]>([]);
    const [loadingPage, setLoadingPage] = useState(true);

    // ── Edit vestibular ──
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
    ingles: "",
    espanhol: "",
    frances: "",
    anulada_ingles: false,
    anulada_espanhol: false,
    anulada_frances: false,
});
    const [savingQuestao, setSavingQuestao] = useState(false);
    const [questaoError, setQuestaoError] = useState<string | null>(null);

    // ── Load inicial ──
    useEffect(() => {
        async function load() {
            const token = localStorage.getItem("access_token");

            const cached = sessionStorage.getItem(`vestibular:${id}`);
            let v: Vestibular;
            if (cached) {
                v = JSON.parse(cached);
            } else {
                const r = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/${id}/`,
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                v = await r.json();
            }
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
        load();
    }, [id]);

    // ── Salvar vestibular ──
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

    // ── Adicionar questão ──
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
                const idiomas = [
                    { idioma: "espanhol", resposta: Number(novaQuestao.espanhol), anulada: novaQuestao.anulada_espanhol },
                    { idioma: "frances",  resposta: Number(novaQuestao.frances),  anulada: novaQuestao.anulada_frances },
                    { idioma: "ingles",   resposta: Number(novaQuestao.ingles),   anulada: novaQuestao.anulada_ingles },
                ];
                for (const g of idiomas) {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questoes-idioma/`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                        body: JSON.stringify({ questao: created.id, ...g }),
                    });
                }

                
                created.gabaritos_idioma = idiomas;
            }

            setQuestoes((prev) => [...prev, created].sort((a, b) => a.numero - b.numero));
            setNovaQuestao((p) => ({
                numero: p.numero + 1,
                anulada: false,
                is_idioma: false,
                resposta_geral: "",
                ingles: "",
                espanhol: "",
                frances: "",
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

    // ── Deletar questão ──
    async function handleDeleteQuestao(questaoId: number) {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/questoes/${questaoId}/`,
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) setQuestoes((prev) => prev.filter((q) => q.id !== questaoId));
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    if (loadingPage || !editForm) {
        return (
            <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
            </div>
        );
    }

    const isPas = editForm.tipo === "pas";

    return (
        <div className="min-h-screen bg-[#0a0c14]">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-indigo-600/10 blur-[100px]" />
            </div>

            <div className="relative container mx-auto px-4 py-10 max-w-2xl space-y-12">

                <div>
                    <Link
                        href="/configuracoes"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        Voltar para Vestibulares
                    </Link>
                    <h1 className="text-white text-3xl font-bold tracking-tight">{vestibular?.nome}</h1>
                    <p className="text-slate-500 text-sm mt-1 capitalize">
                        {vestibular?.tipo}
                        {vestibular?.serie ? ` · ${vestibular.serie}ª série` : ""}
                        {" · "}{vestibular?.ano}
                    </p>
                </div>

                <section>
                    <SectionHeader number="01" title="Informações do Vestibular" />

                    <form onSubmit={handleSaveVestibular} className="space-y-6 mt-6">
                        <Field icon={<BookOpen className="h-4 w-4" />} label="Nome" required>
                            <input
                                type="text"
                                value={editForm.nome}
                                onChange={(e) => setEditForm((p) => p && { ...p, nome: e.target.value })}
                                maxLength={100}
                                className={inputClass}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field icon={<Calendar className="h-4 w-4" />} label="Ano" required>
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
                            </Field>

                            <Field icon={<Tag className="h-4 w-4" />} label="Tipo" required>
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
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                </div>
                            </Field>
                        </div>

                        <div className={`transition-all duration-300 overflow-hidden ${isPas ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
                            <Field icon={<Layers className="h-4 w-4" />} label="Série" required={isPas}>
                                <div className="grid grid-cols-3 gap-3">
                                    {([1, 2, 3] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setEditForm((p) => p && { ...p, serie: s })}
                                            className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                                                editForm.serie === s
                                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                                    : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                                            }`}
                                        >
                                            {s}ª Série
                                        </button>
                                    ))}
                                </div>
                            </Field>
                        </div>

                        <Field icon={<ImagePlus className="h-4 w-4" />} label="Imagem">
                            <label className="group relative flex items-center gap-4 cursor-pointer rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 hover:border-white/20 transition-colors">
                                <div className="shrink-0 w-14 h-14 rounded-lg border border-white/10 bg-slate-900/60 overflow-hidden flex items-center justify-center">
                                    {imagemPreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={imagemPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImagePlus className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-slate-300 font-medium truncate">
                                        {editForm.imagem ? editForm.imagem.name : "Trocar imagem"}
                                    </p>
                                    <p className="text-xs text-slate-600 mt-0.5">PNG, JPG, WEBP · opcional</p>
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
                        </Field>

                        <div className="rounded-2xl border border-white/10 bg-slate-900/40 divide-y divide-white/5 overflow-hidden">
                            
                            <Toggle
                                icon={<CheckSquare className="h-4 w-4" />}
                                label="Com Gabarito"
                                description="Gabarito oficial já disponível"
                                checked={editForm.com_gabarito}
                                onChange={(v) => setEditForm((p) => p && { ...p, com_gabarito: v })}
                            />
                        </div>

                        {saveVestibularError && <ErrorBox message={saveVestibularError} />}

                        <div className="flex items-center justify-end gap-3">
                            {saveVestibularOk && (
                                <span className="flex items-center gap-1.5 text-sm text-green-400">
                                    <Check className="h-4 w-4" /> Salvo com sucesso
                                </span>
                            )}
                            <button
                                type="submit"
                                disabled={savingVestibular}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60 transition-all shadow-lg shadow-indigo-600/20"
                            >
                                {savingVestibular ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {savingVestibular ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </form>
                </section>

                <div className="border-t border-white/5" />

                <section>
                    <SectionHeader number="02" title={`Questões (${questoes.length})`} />

                    {questoes.length > 0 && (
                        <div className="mt-6 rounded-2xl border border-white/10 overflow-hidden mb-8">
                            <ul className="divide-y divide-white/5">
                                {questoes.map((q) => (
                                    <li
                                        key={q.id}
                                        className="flex items-center justify-between gap-4 px-5 py-3 bg-slate-900/40 hover:bg-slate-900/60 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <span className="shrink-0 w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold flex items-center justify-center">
                                                {q.numero}
                                            </span>
                                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                                                {q.resposta_geral !== null ? (
                                                    <span className="text-sm text-slate-400">
                                                        Resposta:{" "}
                                                        <span className="text-white font-semibold">{q.resposta_geral}</span>
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
                                                            <Globe className="h-3 w-3" /> Idioma
                                                        </span>
                                                        {q.gabaritos_idioma?.map((g) => (
                                                            <span key={g.idioma} className="text-xs text-slate-500 capitalize">
                                                                {g.idioma}:{" "}
                                                                <span className="text-slate-300">{g.resposta}</span>
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
                                        <button
                                            onClick={() => q.id && handleDeleteQuestao(q.id)}
                                            className="shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {questoes.length === 0 && (
                        <p className="mt-4 mb-8 text-sm text-slate-600">Nenhuma questão cadastrada ainda.</p>
                    )}

                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">
                            Adicionar Questão
                        </p>

                        <form onSubmit={handleAddQuestao} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <Field icon={<Hash className="h-4 w-4" />} label="Número" required>
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
                                </Field>

                                {!novaQuestao.is_idioma && (
                                    <Field icon={<Hash className="h-4 w-4" />} label="Resposta (0–31)" required>
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
                                    </Field>
                                )}
                            </div>

                            {novaQuestao.is_idioma && (
                                <div className="space-y-3">
                                    {(["espanhol", "frances", "ingles"] as const).map((lang) => {
                                        const labelMap = { espanhol: "Espanhol", frances: "Francês", ingles: "Inglês" };
                                        const anuladaKey = `anulada_${lang}` as "anulada_ingles" | "anulada_espanhol" | "anulada_frances";
                                        const isAnulada = novaQuestao[anuladaKey];

                                        return (
                                            <div key={lang} className="rounded-xl border border-white/10 bg-slate-900/60 p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                        {labelMap[lang]}
                                                    </span>
                                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                                        <span className="text-xs text-slate-500">Anulada</span>
                                                        <div
                                                            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${isAnulada ? "bg-red-600" : "bg-slate-700"}`}
                                                            onClick={() => setNovaQuestao((p) => ({ ...p, [anuladaKey]: !p[anuladaKey] }))}
                                                        >
                                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isAnulada ? "translate-x-4" : "translate-x-0"}`} />
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

                            <div className="rounded-xl border border-white/10 divide-y divide-white/5 overflow-hidden">
                                <Toggle
                                    icon={<Globe className="h-4 w-4" />}
                                    label="Questão de Idioma"
                                    description="Inglês, Espanhol e Francês com respostas separadas"
                                    checked={novaQuestao.is_idioma}
                                    onChange={(v) =>
                                        setNovaQuestao((p) => ({
                                            ...p,
                                            is_idioma: v,
                                            resposta_geral: "",
                                            ingles: "",
                                            espanhol: "",
                                            frances: "",
                                        }))
                                    }
                                />
                                <Toggle
                                    icon={<AlertCircle className="h-4 w-4" />}
                                    label="Anulada"
                                    description="Questão sem resposta válida"
                                    checked={novaQuestao.anulada}
                                    onChange={(v) => setNovaQuestao((p) => ({ ...p, anulada: v }))}
                                />
                            </div>

                            {questaoError && <ErrorBox message={questaoError} />}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={savingQuestao}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60 transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    {savingQuestao ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                    {savingQuestao ? "Adicionando..." : "Adicionar Questão"}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const inputClass =
    "w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all";

function SectionHeader({ number, title }: { number: string; title: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-indigo-400/60 tabular-nums">{number}</span>
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">{title}</h2>
            <div className="h-px flex-1 bg-white/5" />
        </div>
    );
}

function Field({
    icon, label, required, children,
}: {
    icon: React.ReactNode; label: string; required?: boolean; children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className="text-slate-600">{icon}</span>
                {label}
                {required && <span className="text-indigo-400 ml-0.5">*</span>}
            </label>
            {children}
        </div>
    );
}

function Toggle({
    icon, label, description, checked, onChange,
}: {
    icon: React.ReactNode; label: string; description: string;
    checked: boolean; onChange: (v: boolean) => void;
}) {
    return (
        <div
            role="button"
            tabIndex={0}
            className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-slate-900/40 transition-colors"
            onClick={() => onChange(!checked)}
            onKeyDown={(e) => e.key === " " && onChange(!checked)}
        >
            <div className="flex items-center gap-3">
                <span className="text-slate-500">{icon}</span>
                <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                </div>
            </div>
            <div className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-indigo-600" : "bg-slate-700"}`}>
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
            </div>
        </div>
    );
}

function ErrorBox({ message }: { message: string }) {
    return (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {message}
        </div>
    );
}