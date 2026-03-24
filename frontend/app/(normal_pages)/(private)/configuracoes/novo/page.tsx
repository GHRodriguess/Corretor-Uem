"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Tag,
    Layers,
    ToggleLeft,
    CheckSquare,
    ImagePlus,
    Loader2,
    ChevronDown,
} from "lucide-react";
import Link from "next/link";

type TipoVestibular = "vestibular" | "pas";

interface FormData {
    nome: string;
    ano: number | "";
    tipo: TipoVestibular;
    serie: 1 | 2 | 3 | "";
    com_gabarito: boolean;
    imagem: File | null;
}

const CURRENT_YEAR = new Date().getFullYear();

export default function NovoVestibular() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagemPreview, setImagemPreview] = useState<string | null>(null);


    const [form, setForm] = useState<FormData>({
        nome: "",
        ano: CURRENT_YEAR,
        tipo: "vestibular",
        serie: "",
        com_gabarito: false,
        imagem: null,
    });

    function handleChange(field: keyof FormData, value: unknown) {
        setForm((prev) => {
            if (field === "tipo" && value === "vestibular") {
                return { ...prev, tipo: "vestibular", serie: "" };
            }
            return { ...prev, [field]: value };
        });
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setForm((prev) => ({ ...prev, imagem: file }));
        if (file) {
            setImagemPreview(URL.createObjectURL(file));
        } else {
            setImagemPreview(null);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!form.nome.trim()) return setError("O nome é obrigatório.");
        if (!form.ano || form.ano < 2000 || form.ano > 2030)
            return setError("O ano deve estar entre 2000 e 2030.");
        if (form.tipo === "pas" && !form.serie)
            return setError("Para o tipo PAS, a série é obrigatória.");
        if (!form.imagem) return setError("A imagem é obrigatória");

        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");

            const payload = new FormData();
            payload.append("nome", form.nome.trim());
            payload.append("ano", String(form.ano));
            payload.append("tipo", form.tipo);
            if (form.tipo === "pas" && form.serie)
                payload.append("serie", String(form.serie));
            payload.append("com_gabarito", String(form.com_gabarito));
            if (form.imagem) payload.append("imagem", form.imagem);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    method: "POST",
                    body: payload,
                },
            );

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg =
                    Object.values(data).flat().join(" ") ||
                    "Erro ao criar vestibular.";
                throw new Error(msg);
            }

            const created = await res.json();
            sessionStorage.setItem(`vestibular:${created.id}`, JSON.stringify(created));

            router.push(`/configuracoes/${created.id}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erro inesperado.");
        } finally {
            setLoading(false);
        }
    }

    const isPas = form.tipo === "pas";

    return (
        <div className="min-h-screen bg-[#0a0c14]">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-75rounded-full bg-indigo-600/10 blur-[100px]" />
            </div>

            <div className="relative container mx-auto px-4 py-10 max-w-2xl">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href="/configuracoes"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        Voltar para Vestibulares
                    </Link>

                    <h1 className="text-white text-3xl font-bold tracking-tight">
                        Novo Vestibular
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Preencha as informações para cadastrar um novo
                        vestibular.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome */}
                    <Field
                        icon={<BookOpen className="h-4 w-4" />}
                        label="Nome"
                        required
                    >
                        <input
                            type="text"
                            value={form.nome}
                            onChange={(e) =>
                                handleChange("nome", e.target.value)
                            }
                            placeholder="Ex: ENEM, UnB, UNICAMP..."
                            maxLength={100}
                            className={inputClass}
                        />
                    </Field>

                    {/* Ano + Tipo */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            icon={<Calendar className="h-4 w-4" />}
                            label="Ano"
                            required
                        >
                            <input
                                type="number"
                                value={form.ano}
                                onChange={(e) =>
                                    handleChange(
                                        "ano",
                                        e.target.value
                                            ? Number(e.target.value)
                                            : "",
                                    )
                                }
                                min={2000}
                                max={2030}
                                className={inputClass}
                            />
                        </Field>

                        <Field
                            icon={<Tag className="h-4 w-4" />}
                            label="Tipo"
                            required
                        >
                            <div className="relative">
                                <select
                                    value={form.tipo}
                                    onChange={(e) =>
                                        handleChange(
                                            "tipo",
                                            e.target.value as TipoVestibular,
                                        )
                                    }
                                    className={`${inputClass} appearance-none pr-9`}
                                >
                                    <option value="vestibular">
                                        Vestibular
                                    </option>
                                    <option value="pas">PAS</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            </div>
                        </Field>
                    </div>

                    {/* Série — apenas PAS */}
                    <div
                        className={`transition-all duration-300 overflow-hidden ${
                            isPas
                                ? "max-h-40 opacity-100"
                                : "max-h-0 opacity-0 pointer-events-none"
                        }`}
                    >
                        <Field
                            icon={<Layers className="h-4 w-4" />}
                            label="Série"
                            required={isPas}
                        >
                            <div className="grid grid-cols-3 gap-3">
                                {([1, 2, 3] as const).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => handleChange("serie", s)}
                                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                                            form.serie === s
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

                    {/* Imagem */}
                    <Field
                        required
                        icon={<ImagePlus className="h-4 w-4" />}
                        label="Imagem"
                    >
                        <label className="group relative flex items-center gap-4 cursor-pointer rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 hover:border-white/20 transition-colors">
                            <div className="shrink-0 w-14 h-14 rounded-lg border border-white/10 bg-slate-900/60 overflow-hidden flex items-center justify-center">
                                {imagemPreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={imagemPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImagePlus className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium truncate">
                                    {form.imagem
                                        ? form.imagem.name
                                        : "Selecionar imagem"}
                                </p>
                                <p className="text-xs text-slate-600 mt-0.5">
                                    PNG, JPG, WEBP · opcional
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </label>
                    </Field>

                    {/* Toggles */}
                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 divide-y divide-white/5 overflow-hidden">
                        
                        <Toggle
                            icon={<CheckSquare className="h-4 w-4" />}
                            label="Com Gabarito"
                            description="Gabarito oficial já disponível"
                            checked={form.com_gabarito}
                            onChange={(v) => handleChange("com_gabarito", v)}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                            href="/configuracoes"
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 border border-white/10 hover:border-white/20 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
                        >
                            {loading && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {loading ? "Criando..." : "Criar Vestibular"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const inputClass =
    "w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all";

function Field({
    icon,
    label,
    required,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    required?: boolean;
    children: React.ReactNode;
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
    icon,
    label,
    description,
    checked,
    onChange,
}: {
    icon: React.ReactNode;
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
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
                    <p className="text-xs text-slate-500 mt-0.5">
                        {description}
                    </p>
                </div>
            </div>
            <div
                className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
                    checked ? "bg-indigo-600" : "bg-slate-700"
                }`}
            >
                <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        checked ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </div>
        </div>
    );
}
