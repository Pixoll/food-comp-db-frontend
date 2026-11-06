"use client";

import type { XlsxImportResult } from "@/api";
import { Button, ButtonLink, Card } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { CircleCheck, RotateCcw, Search } from "lucide-react";
import type { JSX } from "react";

type ImportDoneProps = {
    result: XlsxImportResult;
    onReset: () => void;
};

export default function ImportDone({ result, onReset }: ImportDoneProps): JSX.Element {
    const { t } = useTranslation();
    const x = t.importXlsx;

    const stats = [
        [x.done.created, result.created.length],
        [x.done.updated, result.updated.length],
        [x.done.skipped, result.skipped.length],
        [x.done.invalid, result.invalid.length],
        [x.done.measurements, result.measurements],
        [x.done.references, result.referencesCreated],
        [x.done.scientificNames, result.scientificNamesCreated],
    ] as const;

    return (
        <Card padding="lg" className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-mint-wash text-brand">
                    <CircleCheck size={22}/>
                </span>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-carbon">{x.doneTitle}</h2>
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map(([label, value]) => (
                    <div key={label} className="rounded-input border border-fog px-4 py-3">
                        <dt className="text-[12px] text-graphite">{label}</dt>
                        <dd className="text-[22px] font-semibold text-carbon tabular-nums">{value}</dd>
                    </div>
                ))}
            </dl>
            {result.invalid.length > 0 && (
                <p className="text-[13px] text-graphite">
                    {x.done.invalid}: <span className="font-mono">{result.invalid.join(", ")}</span>
                </p>
            )}
            <div className="flex flex-wrap gap-2">
                <ButtonLink href="/search" icon={<Search size={16}/>}>{x.viewFoods}</ButtonLink>
                <Button variant="secondary" icon={<RotateCcw size={16}/>} onClick={onReset}>{x.importAnother}</Button>
            </div>
        </Card>
    );
}
