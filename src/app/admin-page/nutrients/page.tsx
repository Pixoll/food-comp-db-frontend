"use client";

import api, { type NewNutrientDto } from "@/api";
import { categoryDot, categoryLabel } from "@/app/components/nutrients/categories";
import RequireAdmin from "@/app/components/RequireAdmin";
import {
    Button,
    Card,
    CardHeader,
    Field,
    Input,
    LoadingState,
    PageContainer,
    PageHeader,
    SearchSelect,
    Select,
    type SelectOption,
} from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useToast } from "@/context/ToastContext";
import { FetchStatus, useNutrients } from "@/hooks";
import { nutrientCategories } from "@/utils/nutrients";
import { ChevronRight, FlaskConical, Plus, Search } from "lucide-react";
import Link from "next/link";
import { type FormEvent, type JSX, useMemo, useState } from "react";

type NutrientType = NewNutrientDto["type"];
type MicronutrientType = NonNullable<NewNutrientDto["micronutrientType"]>;

const LIMITS = { name: 32, unit: 8, note: 100, code: 16 } as const;
const CODE_PATTERN = /^[A-Z0-9_-]+$/;
const codeBadge = "ml-2 rounded-full bg-mist px-2 py-0.5 font-mono text-[11px] text-graphite";
const idCell = "py-2.5 pl-3 pr-5 text-right text-[12px] tabular-nums text-ash";

export default function NutrientsAdminPage(): JSX.Element {
    return (
        <RequireAdmin>
            <NutrientsAdmin/>
        </RequireAdmin>
    );
}

function NutrientsAdmin(): JSX.Element {
    const { t } = useTranslation();
    const n = t.nutrientsAdmin;
    const { addToast } = useToast();
    const { status, list, forceReload } = useNutrients();

    const [type, setType] = useState<NutrientType>("macronutrient");
    const [micronutrientType, setMicronutrientType] = useState<MicronutrientType>("vitamin");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [unit, setUnit] = useState("g");
    const [parentId, setParentId] = useState<number | undefined>();
    const [standardized, setStandardized] = useState(false);
    const [note, setNote] = useState("");
    const [query, setQuery] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);

    // en la API los componentes solo se agrupan bajo macronutrientes
    const parentOptions: Array<SelectOption<number>> = useMemo(() => list
        .filter(nutrient => nutrient.category === "macronutrients")
        .map(nutrient => ({
            value: nutrient.id,
            label: `${"· ".repeat(nutrient.depth)}${nutrient.name} (${nutrient.measurementUnit})`,
        })), [list]);

    const duplicate = list.some(nutrient => nutrient.name.trim().toLowerCase() === name.trim().toLowerCase()
        && nutrient.measurementUnit.toLowerCase() === unit.trim().toLowerCase()
        && (nutrient.category === "energy"
            ? type === "energy"
            : nutrient.category === "macronutrients" ? type === "macronutrient" : type === "micronutrient"));

    const codeValue = code.trim().toUpperCase();
    const codeTaken = !!codeValue && list.some(nutrient => nutrient.code === codeValue
        && nutrient.measurementUnit.toLowerCase() === unit.trim().toLowerCase());

    const errors = {
        code: codeValue && (!CODE_PATTERN.test(codeValue) || codeValue.length > LIMITS.code)
            ? n.codeInvalid
            : codeTaken ? n.codeTaken : undefined,
        name: !name.trim() ? n.required : name.trim().length > LIMITS.name ? n.tooLong(LIMITS.name) : undefined,
        unit: !unit.trim() ? n.required : unit.trim().length > LIMITS.unit ? n.tooLong(LIMITS.unit) : undefined,
        note: note.trim().length > LIMITS.note ? n.tooLong(LIMITS.note) : undefined,
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? list.filter(nutrient => nutrient.name.toLowerCase().includes(q)) : list;
    }, [list, query]);

    const submit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        setSubmitted(true);
        if (errors.name || errors.unit || errors.note || errors.code || duplicate) return;

        const body: NewNutrientDto = {
            type,
            name: name.trim(),
            measurementUnit: unit.trim(),
            standardized,
            ...codeValue && { code: codeValue },
            ...note.trim() && { note: note.trim() },
            ...type === "macronutrient" && parentId && { parentId },
            ...type === "micronutrient" && { micronutrientType },
        };

        setSaving(true);
        const result = await api.createNutrient({ body }).catch(error => ({ error }));
        setSaving(false);

        if (result.error) {
            addToast({
                type: "Danger",
                title: t.common.error,
                message: (result.error as { message?: string }).message ?? t.common.unknownError,
                position: "top-end",
            });
            return;
        }

        addToast({ type: "Success", message: n.created(body.name), position: "top-end", duration: 3000 });
        setName("");
        setCode("");
        setNote("");
        setStandardized(false);
        setSubmitted(false);
        forceReload();
    };

    const show = (error: string | undefined): string | undefined => submitted ? error : undefined;

    return (
        <PageContainer width="xl">
            <PageHeader
                eyebrow={(
                    <>
                        <Link href="/admin-page" className="hover:text-carbon">{t.adminPage.title}</Link>
                        <ChevronRight size={14}/>
                        <span>{n.title}</span>
                    </>
                )}
                title={n.title}
                description={n.description}
            />

            <div className="grid items-start gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
                <Card as="section" padding="lg">
                    <CardHeader icon={<Plus size={18}/>} title={n.newNutrient}/>
                    <form className="flex flex-col gap-4" noValidate onSubmit={e => void submit(e)}>
                        <Field label={n.type} htmlFor="nutrient-type" required>
                            <Select
                                id="nutrient-type"
                                value={type}
                                onChange={e => setType(e.target.value as NutrientType)}
                            >
                                <option value="energy">{n.energy}</option>
                                <option value="macronutrient">{n.macronutrient}</option>
                                <option value="micronutrient">{n.micronutrient}</option>
                            </Select>
                        </Field>

                        {type === "micronutrient" && (
                            <Field label={n.micronutrientType} htmlFor="nutrient-micro-type" required>
                                <Select
                                    id="nutrient-micro-type"
                                    value={micronutrientType}
                                    onChange={e => setMicronutrientType(e.target.value as MicronutrientType)}
                                >
                                    <option value="vitamin">{n.vitamin}</option>
                                    <option value="mineral">{n.mineral}</option>
                                </Select>
                            </Field>
                        )}

                        <Field
                            label={n.name}
                            htmlFor="nutrient-name"
                            required
                            error={show(errors.name) ?? (duplicate ? n.alreadyExists : undefined)}
                            hint={`${name.trim().length}/${LIMITS.name}`}
                        >
                            <Input
                                id="nutrient-name"
                                value={name}
                                placeholder={n.namePlaceholder}
                                aria-invalid={!!show(errors.name) || duplicate || undefined}
                                onChange={e => setName(e.target.value)}
                            />
                        </Field>

                        <Field label={n.unit} htmlFor="nutrient-unit" required error={show(errors.unit)}>
                            <Input
                                id="nutrient-unit"
                                value={unit}
                                placeholder={n.unitPlaceholder}
                                aria-invalid={!!show(errors.unit) || undefined}
                                onChange={e => setUnit(e.target.value)}
                                className="max-w-[160px]"
                            />
                        </Field>

                        <Field
                            label={n.code}
                            htmlFor="nutrient-code"
                            error={errors.code}
                            hint={n.codeHint}
                        >
                            <Input
                                id="nutrient-code"
                                value={code}
                                placeholder={n.codePlaceholder}
                                aria-invalid={!!errors.code || undefined}
                                onChange={e => setCode(e.target.value.toUpperCase())}
                                className="max-w-[220px] font-mono"
                                maxLength={LIMITS.code}
                            />
                        </Field>

                        {type === "macronutrient" && (
                            <Field label={n.parent} htmlFor="nutrient-parent" hint={n.parentHint}>
                                <SearchSelect
                                    id="nutrient-parent"
                                    options={parentOptions}
                                    value={parentId}
                                    onChange={setParentId}
                                    placeholder={n.parentPlaceholder}
                                    emptyText={t.common.noResults}
                                />
                            </Field>
                        )}

                        <Field label={n.note} htmlFor="nutrient-note" error={show(errors.note)}>
                            <Input
                                id="nutrient-note"
                                value={note}
                                placeholder={n.notePlaceholder}
                                onChange={e => setNote(e.target.value)}
                            />
                        </Field>

                        <label className="inline-flex cursor-pointer items-center gap-2 text-[14px] text-graphite">
                            <input
                                type="checkbox"
                                checked={standardized}
                                onChange={e => setStandardized(e.target.checked)}
                                className="size-4 accent-[var(--color-brand)]"
                            />
                            {n.standardized}
                        </label>

                        <Button type="submit" disabled={saving} className="self-start">
                            {saving ? n.saving : n.save}
                        </Button>
                    </form>
                </Card>

                <Card as="section" padding="none">
                    <div className="border-b border-fog p-5">
                        <CardHeader
                            icon={<FlaskConical size={18}/>}
                            title={n.catalog}
                            description={status === FetchStatus.Success ? `${list.length}` : undefined}
                            className="mb-4"
                        />
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash"/>
                            <Input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder={n.filter}
                                aria-label={n.filter}
                                className="rounded-full pl-9"
                            />
                        </div>
                    </div>
                    {status === FetchStatus.Loading ? <LoadingState label={t.common.loading}/> : (
                        <table className="w-full text-[14px]">
                            {nutrientCategories.map(category => {
                                const rows = filtered.filter(nutrient => nutrient.category === category);
                                if (rows.length === 0) return null;

                                return (
                                    <tbody key={category}>
                                        <tr className="border-t border-fog bg-linen first:border-t-0">
                                            <th colSpan={3} className="py-2.5 pl-5 text-left text-[13px] font-semibold">
                                                <span className="inline-flex items-center gap-2">
                                                    <span className={`size-2 rounded-full ${categoryDot[category]}`}/>
                                                    {categoryLabel(t, category)}
                                                    <span className="font-normal text-ash">({rows.length})</span>
                                                </span>
                                            </th>
                                        </tr>
                                        {rows.map(nutrient => (
                                            <tr key={nutrient.id} className="border-t border-fog">
                                                <td
                                                    className="py-2.5 pr-3"
                                                    style={{ paddingLeft: 20 + (query ? 0 : nutrient.depth * 20) }}
                                                >
                                                    <span
                                                        className={nutrient.depth === 0
                                                            ? "font-medium text-carbon"
                                                            : "text-graphite"}
                                                    >
                                                        {nutrient.name}
                                                    </span>
                                                    {nutrient.code && (
                                                        <span className={codeBadge}>{nutrient.code}</span>
                                                    )}
                                                    {nutrient.note && (
                                                        <span className="ml-2 text-[12px] text-ash">
                                                            {nutrient.note}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2.5 text-graphite">
                                                    {nutrient.measurementUnit}
                                                </td>
                                                <td className={idCell}>#{nutrient.id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                );
                            })}
                        </table>
                    )}
                </Card>
            </div>
        </PageContainer>
    );
}
