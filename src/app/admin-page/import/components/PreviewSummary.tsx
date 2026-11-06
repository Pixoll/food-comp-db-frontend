"use client";

import type { XlsxPreview } from "@/api";
import { useTranslation } from "@/context/I18nContext";
import { AlertTriangle } from "lucide-react";
import type { JSX } from "react";
import { formatIssue } from "../issues";

export default function PreviewSummary({ preview }: { preview: XlsxPreview }): JSX.Element {
    const { t, language } = useTranslation();
    const x = t.importXlsx;
    const { summary } = preview;
    const number = (value: number): string => value.toLocaleString(language === "es" ? "es-CL" : "en-US");

    const tiles = [
        { label: x.newFoods, value: summary.newFoods, dot: "bg-brand" },
        { label: x.existingFoods, value: summary.existingFoods, dot: "bg-sky" },
        { label: x.invalidFoods, value: summary.invalidFoods, dot: "bg-danger" },
        { label: x.measurements, value: summary.measurements, dot: "bg-ash" },
    ];

    return (
        <section className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {tiles.map(tile => (
                    <div key={tile.label} className="rounded-card border border-fog bg-paper p-4">
                        <p className="flex items-center gap-2 text-[13px] text-graphite">
                            <span className={`size-2 rounded-full ${tile.dot}`}/>
                            {tile.label}
                        </p>
                        <p className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-carbon tabular-nums">
                            {number(tile.value)}
                        </p>
                    </div>
                ))}
            </div>
            <p className="text-[13px] text-graphite">
                {x.extras(summary.newReferences, summary.newScientificNames)}
                {" · "}
                {x.ignoredColumns(summary.ignoredColumns, summary.ignoredValues)}
            </p>
            {preview.warnings.length > 0 && (
                <div className="rounded-card border border-amber/30 bg-amber-wash px-4 py-3 text-[13px] text-carbon">
                    <p className="mb-1 flex items-center gap-2 font-medium">
                        <AlertTriangle size={16} className="text-amber"/>
                        {x.fileWarnings}
                    </p>
                    <ul className="ml-6 list-disc space-y-0.5 text-graphite">
                        {preview.warnings.map((warning, i) => <li key={i}>{formatIssue(t, warning)}</li>)}
                    </ul>
                </div>
            )}
        </section>
    );
}
