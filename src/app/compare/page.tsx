"use client";

import type { FoodWithOnlyMeasurements } from "@/api";
import {
    Button,
    ButtonLink,
    Card,
    EmptyState,
    ErrorState,
    LoadingState,
    PageContainer,
    PageHeader,
} from "@/app/components/ui";
import { useComparison } from "@/context/ComparisonContext";
import { useTranslation } from "@/context/I18nContext";
import { FetchStatus, useApi, useNutrients } from "@/hooks";
import { downloadCsv } from "@/utils/csv";
import { foodDisplayName } from "@/utils/nutrients";
import { ArrowLeft, Download, GitCompareArrows, Search, Trash2, X } from "lucide-react";
import { type JSX, useMemo } from "react";
import NutrientComparisonTable, { buildIndexes } from "./components/NutrientComparisonTable";

export default function ComparisonPage(): JSX.Element {
    const { t, language } = useTranslation();
    const { comparisonFoods, removeFromComparison, clearComparison } = useComparison();

    return (
        <PageContainer width="xl">
            <PageHeader
                title={t.compare.foodComparison}
                description={t.compare.selectFoods}
                actions={(
                    <>
                        <ButtonLink href="/search" variant="ghost" icon={<ArrowLeft size={16}/>}>
                            {t.compare.goToSearch}
                        </ButtonLink>
                        {comparisonFoods.length > 0 && (
                            <Button variant="danger" icon={<Trash2 size={16}/>} onClick={clearComparison}>
                                {t.compare.clear}
                            </Button>
                        )}
                    </>
                )}
            />

            {comparisonFoods.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-[13px] text-graphite">
                        {t.compare.selectedFoods(comparisonFoods.length)}
                    </span>
                    {comparisonFoods.map(food => (
                        <span
                            key={food.code}
                            className="inline-flex items-center gap-1.5 rounded-full border border-fog bg-paper
                            py-1 pl-3 pr-1 text-[13px] text-carbon"
                        >
                            <span className="max-w-[240px] truncate">{food.name || food.code}</span>
                            <span className="font-mono text-[11px] text-ash">{food.code}</span>
                            <button
                                type="button"
                                onClick={() => removeFromComparison([food.code])}
                                className="rounded-full p-0.5 text-ash hover:bg-mist hover:text-carbon"
                                aria-label={`${t.compare.remove} ${food.code}`}
                            >
                                <X size={14}/>
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {comparisonFoods.length < 2 ? (
                <Card>
                    <EmptyState
                        icon={<Search size={20}/>}
                        title={t.compare.notEnoughFoods}
                        description={t.compare.addFoods}
                        action={(
                            <ButtonLink href="/search" icon={<Search size={16}/>}>{t.compare.goToSearch}</ButtonLink>
                        )}
                    />
                </Card>
            ) : (
                <ComparisonResults
                    codes={comparisonFoods.map(f => f.code)}
                    onRemove={code => removeFromComparison([code])}
                    language={language}
                />
            )}
        </PageContainer>
    );
}

function ComparisonResults({ codes, onRemove, language }: {
    codes: string[];
    onRemove: (code: string) => void;
    language: string;
}): JSX.Element {
    const { t } = useTranslation();
    const { list } = useNutrients();
    const codesKey = codes.join(",");
    const result = useApi([codesKey], (api, key) => api.compareFoods({ query: { codes: key.split(",") } }));

    // mantiene el orden en que se agregaron los alimentos
    const foods: FoodWithOnlyMeasurements[] = useMemo(() => {
        if (result.status !== FetchStatus.Success) return [];
        const byCode = new Map(result.data.map(f => [f.code, f]));
        return codes.map(code => byCode.get(code)).filter((f): f is FoodWithOnlyMeasurements => !!f);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result, codesKey]);

    const indexes = useMemo(() => buildIndexes(foods), [foods]);

    // filas: nutrientes del catálogo con dato en algún alimento, más sus ancestros para no perder la jerarquía
    const rows = useMemo(() => {
        const byId = new Map(list.map(n => [n.id, n]));
        const keep = new Set<number>();
        for (const nutrient of list) {
            if (!indexes.some(index => index.has(nutrient.id))) continue;
            let current: typeof nutrient | undefined = nutrient;
            while (current) {
                keep.add(current.id);
                current = current.parentId !== undefined ? byId.get(current.parentId) : undefined;
            }
        }
        return list.filter(n => keep.has(n.id));
    }, [list, indexes]);

    if (result.status === FetchStatus.Loading) {
        return <Card><LoadingState label={t.compare.loadingNutrients}/></Card>;
    }

    if (result.status === FetchStatus.Failed) {
        return (
            <Card>
                <ErrorState
                    title={t.compare.errorLoadingNutrients}
                    description={t.compare.pleaseTryAgain}
                    action={<Button variant="secondary" onClick={result.forceReload}>{t.compare.retry}</Button>}
                />
            </Card>
        );
    }

    const exportCsv = (): void => {
        downloadCsv("comparacion.csv", [
            [
                t.nutrientsDropdown.nutrient,
                t.nutrientsDropdown.unit,
                ...foods.map(f => `${foodDisplayName(f, f.code)} (${f.code})`),
            ],
            ...rows.map(n => [
                `${"  ".repeat(n.depth)}${n.name}`,
                n.measurementUnit,
                ...indexes.map(index => index.get(n.id)?.average),
            ]),
        ], language);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <GitCompareArrows size={18} className="text-brand"/>
                    <h2 className="text-[18px] font-semibold">{t.compare.nutrientsComparison}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-2 text-[12px] text-graphite">
                        <span className="inline-block h-4 w-7 rounded-full bg-mint-wash" aria-hidden="true"/>
                        {t.compare.highest}
                    </span>
                    <Button variant="secondary" size="sm" icon={<Download size={14}/>} onClick={exportCsv}>
                        {t.compare.exportData}
                    </Button>
                </div>
            </div>
            <p className="text-[13px] text-graphite">{t.compare.per100g}</p>
            <NutrientComparisonTable foods={foods} rows={rows} indexes={indexes} onRemove={onRemove}/>
        </div>
    );
}
