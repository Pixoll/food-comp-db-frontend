"use client";

import type { XlsxFoodPreview, XlsxIssue, XlsxReferencePreview } from "@/api";
import { Badge, type BadgeTone, Input } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useNutrients } from "@/hooks";
import { formatNumber } from "@/utils/nutrients";
import { AlertTriangle, ChevronDown, CircleX, Search } from "lucide-react";
import { Fragment, type JSX, useMemo, useState } from "react";
import { formatIssue } from "../issues";

type Filter = "all" | "new" | "existing" | "invalid" | "warnings";

const statusTone: Record<XlsxFoodPreview["status"], BadgeTone> = {
    new: "brand",
    existing: "sky",
    invalid: "danger",
};

type FoodsPreviewProps = {
    foods: XlsxFoodPreview[];
    references: XlsxReferencePreview[];
};

export default function FoodsPreview({ foods, references }: FoodsPreviewProps): JSX.Element {
    const { t } = useTranslation();
    const x = t.importXlsx;
    const [filter, setFilter] = useState<Filter>("all");
    const [query, setQuery] = useState("");
    const [expanded, setExpanded] = useState<number | null>(null);

    const referencesByCode = useMemo(() => new Map(references.map(ref => [ref.code, ref])), [references]);

    const counts: Record<Filter, number> = {
        all: foods.length,
        new: foods.filter(food => food.status === "new").length,
        existing: foods.filter(food => food.status === "existing").length,
        invalid: foods.filter(food => food.status === "invalid").length,
        warnings: foods.filter(food => food.warnings.length > 0).length,
    };

    const visible = useMemo(() => {
        const q = searchKey(query);

        return foods.filter(food => {
            if (filter === "warnings" ? food.warnings.length === 0 : filter !== "all" && food.status !== filter) {
                return false;
            }

            return !q || [food.code, food.foodName, food.commonName].some(text => text && searchKey(text).includes(q));
        });
    }, [foods, filter, query]);

    return (
        <div>
            <div className="flex flex-col gap-3 border-b border-fog p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5" role="group" aria-label={x.tabs.foods}>
                    {(Object.keys(counts) as Filter[]).map(key => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setFilter(key)}
                            aria-pressed={filter === key}
                            className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${filter === key
                                ? "border-brand bg-brand text-on-brand"
                                : "border-fog bg-paper text-graphite hover:border-ash"}`}
                        >
                            {x.filters[key]} <span className="tabular-nums opacity-70">{counts[key]}</span>
                        </button>
                    ))}
                </div>
                <div className="relative sm:w-[260px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash"/>
                    <Input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={x.searchFoods}
                        aria-label={x.searchFoods}
                        className="rounded-full pl-9"
                    />
                </div>
            </div>

            {visible.length === 0 ? (
                <p className="px-5 py-10 text-center text-[14px] text-graphite">{x.noFoods}</p>
            ) : (
                <div className="relative overflow-x-auto">
                    <table className="w-full min-w-[640px] text-[14px]">
                        <thead>
                            <tr className="border-b border-fog text-left text-[12px] uppercase tracking-wide text-ash">
                                <th className="py-2.5 pl-5 pr-3 font-medium">{x.code}</th>
                                <th className="px-3 py-2.5 font-medium">{x.name}</th>
                                <th className="hidden px-3 py-2.5 font-medium md:table-cell">{x.group}</th>
                                <th className="px-3 py-2.5 text-right font-medium">{x.measurements}</th>
                                <th className="px-3 py-2.5 font-medium">{x.issues}</th>
                                <th className="w-10 pr-4"/>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map(food => {
                                const open = expanded === food.row;

                                return (
                                    <Fragment key={food.row}>
                                        <tr
                                            className={`cursor-pointer border-b border-fog transition-colors
                                            hover:bg-linen ${open ? "bg-linen" : ""}`}
                                            onClick={() => setExpanded(open ? null : food.row)}
                                        >
                                            <td className="py-2.5 pl-5 pr-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-[13px] font-medium">
                                                        {food.code}
                                                    </span>
                                                    <Badge tone={statusTone[food.status]}>
                                                        {x.status[food.status]}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <p className="text-carbon">
                                                    {food.foodName ?? food.commonName ?? "—"}
                                                </p>
                                                {food.scientificName && (
                                                    <p className="text-[12px] italic text-ash">{food.scientificName}</p>
                                                )}
                                            </td>
                                            <td className="hidden px-3 py-2.5 text-graphite md:table-cell">
                                                {food.groupName ?? "—"}
                                            </td>
                                            <td className="px-3 py-2.5 text-right tabular-nums text-graphite">
                                                {food.measurements.length}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <IssueCounts errors={food.errors} warnings={food.warnings}/>
                                            </td>
                                            <td className="pr-4 text-ash">
                                                <button
                                                    type="button"
                                                    aria-expanded={open}
                                                    aria-label={food.code}
                                                    className="flex size-7 items-center justify-center rounded-full
                                                    hover:bg-mist"
                                                >
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform ${open ? "rotate-180" : ""}`}
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                        {open && (
                                            <tr className="border-b border-fog bg-linen">
                                                <td colSpan={6} className="px-5 pb-5 pt-1">
                                                    <FoodDetail
                                                        food={food}
                                                        reference={food.referenceCode
                                                            ? referencesByCode.get(food.referenceCode)
                                                            : undefined}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function IssueCounts({ errors, warnings }: { errors: XlsxIssue[]; warnings: XlsxIssue[] }): JSX.Element {
    if (errors.length === 0 && warnings.length === 0) {
        return <span className="text-ash">—</span>;
    }

    return (
        <span className="flex items-center gap-1.5">
            {errors.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-danger">
                    <CircleX size={14}/>
                    {errors.length}
                </span>
            )}
            {warnings.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-amber">
                    <AlertTriangle size={14}/>
                    {warnings.length}
                </span>
            )}
        </span>
    );
}

type FoodDetailProps = {
    food: XlsxFoodPreview;
    reference?: XlsxReferencePreview;
};

function FoodDetail({ food, reference }: FoodDetailProps): JSX.Element {
    const { t, language } = useTranslation();
    const x = t.importXlsx;
    const { byId } = useNutrients();

    const fields: Array<[string, string | undefined, boolean?]> = [
        [x.commonName, food.commonName],
        [x.scientificName, food.scientificName, food.newScientificName],
        [x.observation, food.observation],
        [x.others, food.others],
        [x.portion, food.portionQuantity ? `${food.portionQuantity} g` : undefined],
    ];

    return (
        <div className="grid gap-4 rounded-card border border-fog bg-paper p-4 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
                <p className="text-[12px] text-ash">{x.row(food.row)}</p>
                <dl className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-3 gap-y-2 text-[13px]">
                    {fields.filter(([, value]) => value).map(([label, value, isNew]) => (
                        <Fragment key={label}>
                            <dt className="text-graphite">{label}</dt>
                            <dd className="text-carbon">
                                {value}
                                {isNew && <Badge tone="brand" className="ml-2">{x.newBadge}</Badge>}
                            </dd>
                        </Fragment>
                    ))}
                    <dt className="text-graphite">{x.reference}</dt>
                    <dd className="text-carbon">
                        {reference ? (
                            <>
                                <span className="mr-1.5 font-mono text-[12px] text-graphite">#{reference.code}</span>
                                {reference.text}
                                {reference.isNew && <Badge tone="brand" className="ml-2">{x.newBadge}</Badge>}
                            </>
                        ) : <span className="text-ash">{x.noReference}</span>}
                    </dd>
                </dl>

                {(food.errors.length > 0 || food.warnings.length > 0) && (
                    <ul className="flex flex-col gap-1.5 text-[13px]">
                        {food.errors.map((issue, i) => (
                            <li key={`e${i}`} className="flex gap-2 text-danger">
                                <CircleX size={15} className="mt-0.5 shrink-0"/>
                                {formatIssue(t, issue)}
                            </li>
                        ))}
                        {food.warnings.map((issue, i) => (
                            <li key={`w${i}`} className="flex gap-2 text-carbon">
                                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber"/>
                                {formatIssue(t, issue)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {food.measurements.length > 0 && (
                <div className="max-h-[320px] overflow-y-auto rounded-input border border-fog">
                    <table className="w-full text-[13px]">
                        <thead className="sticky top-0 bg-sprout">
                            <tr className="border-b border-fog text-left text-[11px] uppercase tracking-wide text-ash">
                                <th className="px-3 py-2 font-medium">{x.nutrient}</th>
                                <th className="px-3 py-2 text-right font-medium">{x.value}</th>
                                <th className="px-3 py-2 text-right font-medium">{x.column}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {food.measurements.map(m => {
                                const nutrient = byId.get(m.nutrientId);

                                return (
                                    <tr key={m.nutrientId} className="border-b border-fog last:border-b-0">
                                        <td className="px-3 py-1.5 text-carbon">
                                            {nutrient?.name ?? `#${m.nutrientId}`}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-right tabular-nums">
                                            {formatNumber(m.average, language, 5)}
                                            {m.deviation !== undefined && (
                                                <span className="text-ash">
                                                    {" ± "}{formatNumber(m.deviation, language, 5)}
                                                </span>
                                            )}
                                            <span className="ml-1 text-ash">{nutrient?.measurementUnit}</span>
                                        </td>
                                        <td className="px-3 py-1.5 text-right font-mono text-[12px] text-ash">
                                            {m.column}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function searchKey(text: string): string {
    return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}
