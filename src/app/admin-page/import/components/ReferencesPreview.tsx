"use client";

import type { XlsxReferencePreview } from "@/api";
import { Badge } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import type { JSX } from "react";

export default function ReferencesPreview({ references }: { references: XlsxReferencePreview[] }): JSX.Element {
    const { t } = useTranslation();
    const x = t.importXlsx;

    if (references.length === 0) {
        return <p className="px-5 py-10 text-center text-[14px] text-graphite">{x.noReferences}</p>;
    }

    return (
        <ul>
            {references.map(reference => (
                <li key={reference.code} className="flex gap-4 border-b border-fog px-5 py-4 last:border-b-0">
                    <span
                        className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-mint-wash px-2
                        font-mono text-[12px] font-semibold text-brand-ink"
                    >
                        {reference.code}
                    </span>
                    <div className="flex min-w-0 flex-col gap-1.5">
                        <p className="text-[14px] leading-relaxed text-carbon">{reference.text}</p>
                        <div className="flex flex-wrap items-center gap-2 text-[12px] text-graphite">
                            <Badge tone={reference.isNew ? "brand" : "neutral"}>
                                {reference.isNew ? x.referenceNew : x.referenceExisting}
                            </Badge>
                            {x.usedBy(reference.foods)}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
