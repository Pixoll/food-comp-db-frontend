"use client";

import type { FoodWithOnlyMeasurements, NutrientMeasurement } from "@/api";
import { categoryDot, categoryLabel } from "@/app/components/nutrients/categories";
import { useTranslation } from "@/context/I18nContext";
import type { CatalogNutrient } from "@/hooks";
import { foodDisplayName, formatNumber, indexMeasurements, nutrientCategories } from "@/utils/nutrients";
import { X } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

type NutrientComparisonTableProps = {
    foods: FoodWithOnlyMeasurements[];
    /** Catálogo aplanado; define el orden y la jerarquía de las filas. */
    rows: CatalogNutrient[];
    indexes: Array<Map<number, NutrientMeasurement>>;
    onRemove: (code: string) => void;
};

const highestClass = "rounded-full bg-mint-wash px-2 py-0.5 font-semibold text-brand-ink";

export default function NutrientComparisonTable({
    foods,
    rows,
    indexes,
    onRemove,
}: NutrientComparisonTableProps): JSX.Element {
    const { t, language } = useTranslation();

    return (
        <div className="overflow-hidden rounded-card border border-fog bg-paper">
            <div className="relative overflow-x-auto">
                <table className="w-full table-fixed text-[14px]" style={{ minWidth: 300 + foods.length * 180 }}>
                    <thead>
                        <tr className="align-bottom">
                            <th
                                className="sticky left-0 z-10 w-[300px] bg-sprout py-3 pl-5 pr-3 text-left text-[12px]
                                font-medium uppercase tracking-wide"
                            >
                                {t.nutrientsDropdown.nutrient}
                            </th>
                            {foods.map(food => (
                                <th
                                    key={food.code}
                                    className="w-[200px] min-w-[160px] px-3 py-3 text-right font-normal"
                                >
                                    <div className="flex items-start justify-end gap-1">
                                        <div className="min-w-0 text-right">
                                            <Link
                                                href={`/detail-food/${food.code}`}
                                                className="line-clamp-2 whitespace-normal text-[13px] font-semibold
                                                text-carbon hover:text-brand"
                                                title={foodDisplayName(food, food.code)}
                                            >
                                                {foodDisplayName(food, food.code)}
                                            </Link>
                                            <span className="font-mono text-[12px] text-ash">{food.code}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onRemove(food.code)}
                                            className="rounded-full p-0.5 text-ash hover:bg-mist hover:text-carbon"
                                            aria-label={`${t.compare.remove} ${food.code}`}
                                        >
                                            <X size={14}/>
                                        </button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {nutrientCategories.map(category => {
                        const categoryRows = rows.filter(r => r.category === category);
                        if (categoryRows.length === 0) return null;

                        return (
                            <tbody key={category}>
                                <tr className="border-t border-fog bg-linen">
                                    <th
                                        colSpan={foods.length + 1}
                                        className="sticky left-0 py-2.5 pl-5 text-left text-[13px] font-semibold"
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <span className={`size-2 rounded-full ${categoryDot[category]}`}/>
                                            {categoryLabel(t, category)}
                                        </span>
                                    </th>
                                </tr>
                                {categoryRows.map(nutrient => {
                                    const values = indexes.map(index => index.get(nutrient.id)?.average);
                                    const present = values.filter((v): v is number => v !== undefined);
                                    const max = present.length > 1 ? Math.max(...present) : undefined;

                                    return (
                                        <tr key={nutrient.id} className="border-t border-fog hover:bg-linen">
                                            <td
                                                className="sticky left-0 z-10 bg-inherit py-2.5 pr-3"
                                                style={{ paddingLeft: 20 + nutrient.depth * 18 }}
                                            >
                                                <span
                                                    className={nutrient.depth === 0
                                                        ? "font-medium text-carbon"
                                                        : "text-graphite"}
                                                >
                                                    {nutrient.name}
                                                </span>
                                                <span className="ml-1.5 text-[12px] text-ash">
                                                    {nutrient.measurementUnit}
                                                </span>
                                            </td>
                                            {values.map((value, i) => (
                                                <td
                                                    key={foods[i].code}
                                                    className="px-3 py-2.5 text-right tabular-nums"
                                                >
                                                    {value === undefined ? (
                                                        <span className="text-ash">—</span>
                                                    ) : (
                                                        <span
                                                            className={value === max && value > 0
                                                                ? highestClass
                                                                : "text-carbon"}
                                                            title={value === max ? t.compare.highest : undefined}
                                                        >
                                                            {formatNumber(value, language)}
                                                        </span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        );
                    })}
                </table>
            </div>
        </div>
    );
}

export function buildIndexes(foods: FoodWithOnlyMeasurements[]): Array<Map<number, NutrientMeasurement>> {
    return foods.map(food => indexMeasurements(food.nutrientMeasurements));
}
