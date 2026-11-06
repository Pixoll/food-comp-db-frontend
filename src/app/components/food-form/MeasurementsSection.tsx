"use client";

import { categoryDot, categoryLabel } from "@/app/components/nutrients/categories";
import { Card, CardHeader, Input, MultiSearchSelect, type SelectOption } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import type { CatalogNutrient } from "@/hooks";
import { nutrientCategories } from "@/utils/nutrients";
import { BookMarked, FlaskConical, Search } from "lucide-react";
import { Fragment, type JSX, useMemo, useState } from "react";
import { type FoodFormErrors, type FoodFormMode, type MeasurementDraft, parseDecimal } from "./formModel";

type MeasurementsSectionProps = {
    mode: FoodFormMode;
    catalog: CatalogNutrient[];
    measurements: Record<number, MeasurementDraft>;
    saved: Record<number, MeasurementDraft>;
    errors: FoodFormErrors;
    showErrors: boolean;
    referenceOptions: Array<SelectOption<number>>;
    onChange: (nutrientId: number, draft: MeasurementDraft) => void;
};

const emptyDraft: MeasurementDraft = { average: "", deviation: "", referenceCodes: [] };

export default function MeasurementsSection({
    mode,
    catalog,
    measurements,
    saved,
    errors,
    showErrors,
    referenceOptions,
    onChange,
}: MeasurementsSectionProps): JSX.Element {
    const { t } = useTranslation();
    const f = t.foodForm;
    const [query, setQuery] = useState("");
    const [onlyFilled, setOnlyFilled] = useState(false);
    const [refsOpen, setRefsOpen] = useState<number | null>(null);

    const byId = useMemo(() => new Map(catalog.map(n => [n.id, n])), [catalog]);
    const isFilled = (id: number): boolean => (measurements[id]?.average.trim() ?? "") !== "";
    const filledCount = catalog.filter(n => isFilled(n.id)).length;

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q && !onlyFilled) return null;

        const ids = new Set<number>();
        const addWithAncestors = (nutrient: CatalogNutrient | undefined): void => {
            while (nutrient) {
                ids.add(nutrient.id);
                nutrient = nutrient.parentId !== undefined ? byId.get(nutrient.parentId) : undefined;
            }
        };

        for (const nutrient of catalog) {
            const matchesQuery = !q || nutrient.name.toLowerCase().includes(q);
            const matchesFilled = !onlyFilled || (measurements[nutrient.id]?.average.trim() ?? "") !== "";
            if (matchesQuery && matchesFilled) addWithAncestors(nutrient);
        }

        return ids;
    }, [catalog, byId, query, onlyFilled, measurements]);

    const update = (id: number, patch: Partial<MeasurementDraft>): void => {
        onChange(id, { ...emptyDraft, ...measurements[id], ...patch });
    };

    return (
        <Card as="section" padding="none">
            <div className="p-6 sm:p-8 pb-4 sm:pb-4">
                <CardHeader
                    icon={<FlaskConical size={18}/>}
                    title={f.sections.composition}
                    description={(
                        <>
                            {t.nutrientsDropdown.perPortion(100)}.{" "}
                            {mode === "edit" && f.savedMeasurementsHint}
                        </>
                    )}
                    className="mb-4"
                />
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash"/>
                        <Input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder={f.filterNutrients}
                            className="pl-9"
                            aria-label={f.filterNutrients}
                        />
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-graphite">
                        <input
                            type="checkbox"
                            checked={onlyFilled}
                            onChange={e => setOnlyFilled(e.target.checked)}
                            className="size-4 accent-[var(--color-brand)]"
                        />
                        {f.onlyFilled}
                    </label>
                    <span className="ml-auto text-[13px] text-ash">{f.filled(filledCount, catalog.length)}</span>
                </div>
                {showErrors && errors.measurementsGeneral && (
                    <p className="mt-3 text-[13px] text-danger">{errors.measurementsGeneral}</p>
                )}
            </div>

            <div className="relative overflow-x-auto border-t border-fog">
                <table className="w-full min-w-[680px] text-[14px]">
                    <thead>
                        <tr className="text-left text-[12px] uppercase tracking-wide text-ash">
                            <th className="py-2.5 pl-6 pr-3 font-medium sm:pl-8">{t.nutrientsDropdown.nutrient}</th>
                            <th className="w-[70px] px-3 py-2.5 font-medium">{t.nutrientsDropdown.unit}</th>
                            <th className="w-[150px] px-3 py-2.5 font-medium">{f.average}</th>
                            <th className="w-[150px] px-3 py-2.5 font-medium">{f.deviation}</th>
                            <th className="w-[110px] py-2.5 pl-3 pr-6 font-medium sm:pr-8">{f.references}</th>
                        </tr>
                    </thead>
                    {nutrientCategories.map(category => {
                        const rows = catalog.filter(n => n.category === category && (!visible || visible.has(n.id)));
                        if (rows.length === 0) return null;

                        return (
                            <tbody key={category}>
                                <tr className="border-t border-fog bg-linen">
                                    <th colSpan={5} className="py-2.5 pl-6 text-left text-[13px] font-semibold sm:pl-8">
                                        <span className="inline-flex items-center gap-2">
                                            <span className={`size-2 rounded-full ${categoryDot[category]}`}/>
                                            {categoryLabel(t, category)}
                                        </span>
                                    </th>
                                </tr>
                                {rows.map(nutrient => {
                                    const draft = measurements[nutrient.id] ?? emptyDraft;
                                    const savedDraft = saved[nutrient.id];
                                    const rowErrors = showErrors ? errors.measurements[nutrient.id] : undefined;
                                    const changed = mode === "edit" && isChanged(draft, savedDraft);
                                    const refsExpanded = refsOpen === nutrient.id;

                                    return (
                                        <Fragment key={nutrient.id}>
                                            <tr
                                                className={`border-t border-fog align-top ${changed
                                                    ? "bg-mint-wash/40"
                                                    : "hover:bg-linen"}`}
                                            >
                                                <td
                                                    className="py-2 pr-3"
                                                    style={{ paddingLeft: 24 + nutrient.depth * 20 }}
                                                >
                                                    <div className="flex min-h-9 items-center gap-2">
                                                        {nutrient.depth > 0 && (
                                                            <span className="h-px w-2.5 bg-fog" aria-hidden="true"/>
                                                        )}
                                                        <span
                                                            className={nutrient.depth === 0
                                                                ? "font-medium text-carbon"
                                                                : "text-graphite"}
                                                        >
                                                            {nutrient.name}
                                                        </span>
                                                        {savedDraft && (
                                                            <span
                                                                className="size-1.5 rounded-full bg-leaf"
                                                                title={f.savedMeasurementsHint}
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className="flex min-h-9 items-center text-graphite">
                                                        {nutrient.measurementUnit}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <NumberCell
                                                        label={`${f.average} ${nutrient.name}`}
                                                        value={draft.average}
                                                        error={rowErrors?.average}
                                                        onChange={average => update(nutrient.id, { average })}
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <NumberCell
                                                        label={`${f.deviation} ${nutrient.name}`}
                                                        value={draft.deviation}
                                                        error={rowErrors?.deviation}
                                                        onChange={deviation => update(nutrient.id, { deviation })}
                                                    />
                                                </td>
                                                <td className="py-2 pl-3 pr-6 sm:pr-8">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRefsOpen(refsExpanded ? null : nutrient.id)}
                                                        aria-expanded={refsExpanded}
                                                        title={f.editReferences}
                                                        className={`inline-flex min-h-9 items-center gap-1.5
                                                        rounded-full px-3 text-[13px] ${
                                                            refsExpanded || draft.referenceCodes.length > 0
                                                            ? "bg-mint-wash text-brand-ink"
                                                            : "text-ash hover:bg-mist hover:text-carbon"}`}
                                                    >
                                                        <BookMarked size={14}/>
                                                        <span className="tabular-nums">
                                                            {draft.referenceCodes.length}
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                            {refsExpanded && (
                                                <tr className="bg-linen">
                                                    <td colSpan={5} className="px-6 pb-4 pt-2 sm:px-8">
                                                        <p className="mb-2 text-[12px] font-medium text-graphite">
                                                            {f.references}: {nutrient.name}
                                                        </p>
                                                        <MultiSearchSelect
                                                            options={referenceOptions}
                                                            values={draft.referenceCodes}
                                                            onChange={referenceCodes => update(nutrient.id, {
                                                                referenceCodes,
                                                            })}
                                                            placeholder={f.referencePlaceholder}
                                                            emptyText={t.common.noResults}
                                                            renderChipLabel={o => `[${o.value}] ${o.label}`}
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        );
                    })}
                </table>
            </div>
        </Card>
    );
}

function NumberCell({ label, value, error, onChange }: {
    label: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}): JSX.Element {
    return (
        <div>
            <Input
                inputMode="decimal"
                value={value}
                aria-label={label}
                aria-invalid={!!error || undefined}
                onChange={e => onChange(e.target.value)}
                className="text-right tabular-nums"
            />
            {error && <p className="mt-1 text-[12px] leading-snug text-danger">{error}</p>}
        </div>
    );
}

function isChanged(draft: MeasurementDraft, saved: MeasurementDraft | undefined): boolean {
    if (!saved) {
        return draft.average.trim() !== "" || draft.deviation.trim() !== "" || draft.referenceCodes.length > 0;
    }

    const codes = new Set(saved.referenceCodes);

    return parseDecimal(draft.average) !== parseDecimal(saved.average)
        || parseDecimal(draft.deviation) !== parseDecimal(saved.deviation)
        || draft.referenceCodes.length !== saved.referenceCodes.length
        || draft.referenceCodes.some(code => !codes.has(code));
}
