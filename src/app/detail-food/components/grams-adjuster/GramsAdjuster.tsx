"use client";

import { useTranslation } from "@/context/I18nContext";
import { RotateCcw } from "lucide-react";
import { type JSX, useState } from "react";

type GramsAdjusterProps = {
    grams: number;
    onGramsChange: (grams: number) => void;
    /** Porción declarada del alimento (g), se ofrece como atajo si es distinta de 100. */
    portion?: number;
};

const MIN = 1;
const MAX = 10_000;

export default function GramsAdjuster({ grams, onGramsChange, portion }: GramsAdjusterProps): JSX.Element {
    const { t } = useTranslation();
    const [input, setInput] = useState(grams.toString());
    const [syncedGrams, setSyncedGrams] = useState(grams);

    // si los gramos cambian desde afuera (atajos), el texto del input se actualiza
    if (syncedGrams !== grams) {
        setSyncedGrams(grams);
        setInput(grams.toString());
    }

    const commit = (raw: string): void => {
        const value = Number(raw.replace(",", "."));
        if (Number.isFinite(value) && value >= MIN && value <= MAX) {
            onGramsChange(Math.round(value * 100) / 100);
        } else {
            setInput(grams.toString());
        }
    };

    // atajos solo si el alimento declara una porción distinta de 100 g
    const presets = portion && portion !== 100 ? [100, portion] : [];

    return (
        <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="grams-adjuster" className="text-[13px] font-medium text-graphite">
                {t.gramsAdjuster.quantity}
            </label>
            <div
                className="flex items-center rounded-full border border-fog bg-paper pl-3 pr-1
                focus-within:border-leaf"
            >
                <input
                    id="grams-adjuster"
                    type="number"
                    inputMode="decimal"
                    min={MIN}
                    max={MAX}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onBlur={e => commit(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === "Enter") commit((e.target as HTMLInputElement).value);
                    }}
                    className="w-16 bg-transparent py-1.5 text-right text-[14px] font-medium tabular-nums
                    text-carbon focus:outline-none [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="pl-1 pr-2 text-[14px] text-graphite">{t.gramsAdjuster.grams}</span>
            </div>
            {presets.map(preset => (
                <button
                    key={preset}
                    type="button"
                    onClick={() => onGramsChange(preset)}
                    className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${grams === preset
                        ? "bg-mint-wash text-brand-ink"
                        : "bg-mist text-graphite hover:text-carbon"}`}
                >
                    {preset} g
                </button>
            ))}
            {grams !== 100 && (
                <button
                    type="button"
                    onClick={() => onGramsChange(100)}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-[13px] text-ash
                    hover:text-carbon"
                    title={t.gramsAdjuster.reset}
                >
                    <RotateCcw size={14}/>
                    <span className="sr-only">{t.gramsAdjuster.reset}</span>
                </button>
            )}
        </div>
    );
}
