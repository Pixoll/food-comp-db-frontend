"use client";

import type { XlsxColumnPreview } from "@/api";
import { Badge, type BadgeTone } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useNutrients } from "@/hooks";
import { Info } from "lucide-react";
import Link from "next/link";
import { type JSX, useState } from "react";

type Filter = "mapped" | "ignored";

const statusTone: Record<XlsxColumnPreview["status"], BadgeTone> = {
    mapped: "brand",
    fallback: "sky",
    unmapped: "neutral",
    no_code: "neutral",
    unit_mismatch: "amber",
    ambiguous: "amber",
};

export default function ColumnsPreview({ columns }: { columns: XlsxColumnPreview[] }): JSX.Element {
    const { t } = useTranslation();
    const x = t.importXlsx;
    const { byId } = useNutrients();
    const [filter, setFilter] = useState<Filter>("mapped");

    const mapped = columns.filter(column => column.status === "mapped" || column.status === "fallback");
    // Las ignoradas con más valores primero: son las que más conviene agregar al catálogo.
    const ignored = columns
        .filter(column => column.status !== "mapped" && column.status !== "fallback")
        .sort((a, b) => b.values - a.values);
    const visible = filter === "mapped" ? mapped : ignored;

    return (
        <div>
            <div className="flex flex-col gap-3 border-b border-fog p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {([["mapped", mapped.length], ["ignored", ignored.length]] as const).map(([key, count]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setFilter(key)}
                            aria-pressed={filter === key}
                            className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${filter === key
                                ? "border-brand bg-brand text-on-brand"
                                : "border-fog bg-paper text-graphite hover:border-ash"}`}
                        >
                            {x.columnFilters[key]} <span className="tabular-nums opacity-70">{count}</span>
                        </button>
                    ))}
                </div>
                {filter === "ignored" && (
                    <p className="flex items-start gap-2 text-[13px] text-graphite sm:max-w-[420px]">
                        <Info size={15} className="mt-0.5 shrink-0 text-ash"/>
                        <span>
                            {x.columnsHelp}{" "}
                            <Link href="/admin-page/nutrients" className="text-brand underline">
                                {x.goToNutrients}
                            </Link>
                        </span>
                    </p>
                )}
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full min-w-[720px] text-[13px]">
                    <thead>
                        <tr className="border-b border-fog text-left text-[12px] uppercase tracking-wide text-ash">
                            <th className="py-2.5 pl-5 pr-3 font-medium">{x.column}</th>
                            <th className="px-3 py-2.5 font-medium">{x.code}</th>
                            <th className="px-3 py-2.5 font-medium">{x.name}</th>
                            <th className="px-3 py-2.5 font-medium">{x.nutrient}</th>
                            <th className="py-2.5 pl-3 pr-5 text-right font-medium">{x.values}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map(column => {
                            const nutrient = column.nutrientId ? byId.get(column.nutrientId) : undefined;

                            return (
                                <tr key={column.column} className="border-b border-fog last:border-b-0">
                                    <td className="py-2 pl-5 pr-3 font-mono text-graphite">
                                        {column.column}
                                        {column.deviationColumn && (
                                            <span className="text-ash"> ± {column.deviationColumn}</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        {column.code
                                            ? <span className="font-mono text-carbon">{column.code}</span>
                                            : <span className="text-ash">—</span>}
                                    </td>
                                    <td className="max-w-[280px] px-3 py-2 text-graphite">
                                        <span className="line-clamp-2" title={column.header}>{column.header}</span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge
                                                tone={statusTone[column.status]}
                                                title={x.columnStatusHint[column.status]}
                                            >
                                                {x.columnStatus[column.status]}
                                            </Badge>
                                            {nutrient && (
                                                <span className="text-carbon">
                                                    {nutrient.name}
                                                    <span className="text-ash"> ({nutrient.measurementUnit})</span>
                                                </span>
                                            )}
                                        </div>
                                        {column.factor && (
                                            <p className="mt-0.5 text-[12px] text-ash">{x.converted(column.factor)}</p>
                                        )}
                                    </td>
                                    <td className="py-2 pl-3 pr-5 text-right tabular-nums text-graphite">
                                        {column.values}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
