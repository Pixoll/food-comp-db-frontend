"use client";

import CompositionTable from "@/app/detail-food/components/CompositionTable";
import FoodInformation from "@/app/detail-food/components/FoodInformation";
import Graphic, { type GraphicItem } from "@/app/detail-food/components/Graphic";
import GramsAdjuster from "@/app/detail-food/components/grams-adjuster/GramsAdjuster";
import References from "@/app/detail-food/components/References";
import {
    Badge,
    Button,
    ButtonLink,
    Card,
    EmptyState,
    ErrorState,
    LoadingState,
    PageContainer,
    Tabs,
} from "@/app/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useComparison } from "@/context/ComparisonContext";
import { useTranslation } from "@/context/I18nContext";
import { FetchStatus, useApi } from "@/hooks";
import { foodDisplayName, formatNumber, indexMeasurements, scaleValue } from "@/utils/nutrients";
import { Check, ChevronRight, FlaskConical, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type JSX, useMemo, useState } from "react";

type DetailTab = "composition" | "references";

export default function DetailFoodPage(): JSX.Element {
    const params = useParams();
    const code = (params.code as string).toUpperCase();
    const { t, language } = useTranslation();
    const { state } = useAuth();
    const { comparisonFoods, addToComparison } = useComparison();
    const [grams, setGrams] = useState(100);
    const [tab, setTab] = useState<DetailTab>("composition");

    const result = useApi([code], (api, foodCode) => api.getFood({ path: { code: foodCode } }));
    const food = result.status === FetchStatus.Success ? result.data : null;

    const measurementIndex = useMemo(() => food ? indexMeasurements(food.nutrientMeasurements) : new Map(), [food]);

    const referenceUsage = useMemo(() => {
        const usage = new Map<number, number>();
        for (const measurement of measurementIndex.values()) {
            for (const referenceCode of measurement.referenceCodes ?? []) {
                usage.set(referenceCode, (usage.get(referenceCode) ?? 0) + 1);
            }
        }
        return usage;
    }, [measurementIndex]);

    const chartData: GraphicItem[] = useMemo(() => (food?.nutrientMeasurements.macronutrients ?? [])
        .filter(m => m.measurementUnit === "g")
        .map(m => ({ name: m.name, value: +scaleValue(m.average, grams).toFixed(3), unit: m.measurementUnit })),
    [food, grams]);

    if (result.status === FetchStatus.Loading) {
        return (
            <PageContainer>
                <LoadingState label={t.foodDetail.loading}/>
            </PageContainer>
        );
    }

    if (!food) {
        return (
            <PageContainer>
                <Card>
                    <ErrorState
                        title={t.foodDetail.notFound}
                        description={t.foodDetail.notFoundDescription(code)}
                        action={<ButtonLink href="/search" variant="secondary">{t.foodDetail.backToSearch}</ButtonLink>}
                    />
                </Card>
            </PageContainer>
        );
    }

    const name = foodDisplayName(food, code);
    const isInComparison = comparisonFoods.some(f => f.code === code);
    const energy = food.nutrientMeasurements.energy;

    return (
        <PageContainer>
            <nav className="mb-6 flex items-center gap-1 text-[13px] text-ash" aria-label="breadcrumb">
                <Link href="/search" className="hover:text-carbon">{t.foodDetail.foods}</Link>
                <ChevronRight size={14}/>
                <span className="text-graphite">{code}</span>
            </nav>

            <Card padding="lg" className="mb-6">
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="min-w-0 max-w-[760px]">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge tone="neutral" className="font-mono">{code}</Badge>
                            <Badge tone="brand">{food.group.name}</Badge>
                        </div>
                        <h1 className="text-[28px] sm:text-[36px] font-semibold leading-[1.15] tracking-[-0.025em]">
                            {name}
                        </h1>
                        {food.foodName && food.commonName && (
                            <p className="mt-2 text-[15px] leading-relaxed text-graphite">{food.commonName}</p>
                        )}
                        {food.scientificName && (
                            <p className="mt-1 text-[14px] italic text-ash">{food.scientificName}</p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={isInComparison ? "soft" : "secondary"}
                            icon={isInComparison ? <Check size={16}/> : <Plus size={16}/>}
                            onClick={() => addToComparison([{ code, name }])}
                            disabled={isInComparison}
                        >
                            {isInComparison ? t.foodDetail.inCompare : t.foodDetail.addToCompare}
                        </Button>
                        {state.isAuthenticated && (
                            <ButtonLink href={`/modify-food/${code}`} icon={<Pencil size={16}/>}>
                                {t.foodDetail.edit}
                            </ButtonLink>
                        )}
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {energy.map(e => (
                        <Stat
                            key={e.nutrientId}
                            label={`${e.name} (${e.measurementUnit})`}
                            value={formatNumber(scaleValue(e.average, grams), language, 1)}
                            hint={t.foodDetail.grams(grams)}
                        />
                    ))}
                    <Stat label={t.foodDetail.measuredNutrients} value={measurementIndex.size.toString()}/>
                    <Stat label={t.foodDetail.referencesCount} value={food.references.length.toString()}/>
                </div>

                <div className="mt-6 border-t border-fog pt-6">
                    <FoodInformation food={food}/>
                </div>
            </Card>

            <Tabs<DetailTab>
                className="mb-6"
                active={tab}
                onChange={setTab}
                tabs={[
                    { key: "composition", label: t.foodDetail.foodComposition, count: measurementIndex.size },
                    { key: "references", label: t.foodDetail.references.title, count: food.references.length },
                ]}
            />

            {tab === "composition" && (measurementIndex.size === 0 ? (
                <Card>
                    <EmptyState icon={<FlaskConical size={20}/>} title={t.foodDetail.noComposition}/>
                </Card>
            ) : (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="min-w-0 space-y-4">
                        <GramsAdjuster grams={grams} onGramsChange={setGrams} portion={food.portionQuantity}/>
                        <CompositionTable
                            measurements={food.nutrientMeasurements}
                            grams={grams}
                            references={food.references}
                        />
                    </div>
                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <Graphic
                            title={t.foodDetail.graphics.title}
                            description={t.foodDetail.graphics.description}
                            data={chartData}
                        />
                    </div>
                </div>
            ))}

            {tab === "references" && <References references={food.references} usage={referenceUsage}/>}
        </PageContainer>
    );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }): JSX.Element {
    return (
        <div className="rounded-card border border-fog bg-paper px-4 py-3">
            <p className="truncate text-[12px] text-ash" title={label}>{label}</p>
            <p className="mt-1 text-[22px] font-semibold tabular-nums leading-tight text-carbon">{value}</p>
            {hint && <p className="text-[12px] text-ash">{hint}</p>}
        </div>
    );
}
