"use client";

import type { GroupedNutrientMeasurements, NutrientMeasurement, Reference } from "@/api";
import { categoryDot, categoryLabel } from "@/app/components/nutrients/categories";
import { Badge } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import {
    formatNumber,
    measurementSection,
    type NutrientCategory,
    nutrientCategories,
    scaleValue,
    type TreeNode,
} from "@/utils/nutrients";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { Fragment, type JSX, useMemo, useState } from "react";

type CompositionTableProps = {
    measurements: GroupedNutrientMeasurements;
    grams: number;
    references: Reference[];
};

/**
 * Tabla de composición de un alimento. Respeta el árbol que entrega el backend:
 * cada macronutriente puede tener componentes, y éstos a su vez los suyos.
 */
export default function CompositionTable({ measurements, grams, references }: CompositionTableProps): JSX.Element {
    const { t, language } = useTranslation();
    const [collapsedSections, setCollapsedSections] = useState<Set<NutrientCategory>>(new Set());
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [detailsOpen, setDetailsOpen] = useState<number | null>(null);

    const referenceByCode = useMemo(() => new Map(references.map(r => [r.code, r])), [references]);

    const parentIds = useMemo(() => {
        const ids: number[] = [];
        const visit = (node: TreeNode<NutrientMeasurement>): void => {
            if (node.components?.length) {
                ids.push(node.nutrientId);
                node.components.forEach(visit);
            }
        };
        nutrientCategories.forEach(c => measurementSection(measurements, c).forEach(visit));
        return ids;
    }, [measurements]);

    const allExpanded = parentIds.length > 0 && parentIds.every(id => expanded.has(id));

    const toggle = <T, >(set: Set<T>, value: T): Set<T> => {
        const next = new Set(set);
        if (next.has(value)) {
            next.delete(value);
        } else {
            next.add(value);
        }
        return next;
    };

    const renderRows = (node: TreeNode<NutrientMeasurement>, depth: number): JSX.Element => {
        const children = node.components ?? [];
        const hasChildren = children.length > 0;
        const isExpanded = expanded.has(node.nutrientId);
        const showDetails = detailsOpen === node.nutrientId;
        const refCodes = node.referenceCodes ?? [];
        const hasDetails = !!node.note || node.standardized || refCodes.length > 0;

        return (
            <Fragment key={node.nutrientId}>
                <tr className="group border-t border-fog first:border-t-0 hover:bg-linen">
                    <td className="py-2.5 pr-3" style={{ paddingLeft: 16 + depth * 20 }}>
                        <div className="flex items-center gap-1.5">
                            {hasChildren ? (
                                <button
                                    type="button"
                                    onClick={() => setExpanded(prev => toggle(prev, node.nutrientId))}
                                    className="-ml-1 rounded p-0.5 text-ash hover:bg-mist hover:text-carbon"
                                    aria-expanded={isExpanded}
                                    aria-label={t.nutrientsDropdown.toggleComponents}
                                >
                                    {isExpanded ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                                </button>
                            ) : depth > 0 && <span className="ml-1 mr-1 h-px w-2.5 bg-fog" aria-hidden="true"/>}
                            <span className={depth === 0 ? "font-medium text-carbon" : "text-graphite"}>
                                {node.name}
                            </span>
                        </div>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-medium text-carbon whitespace-nowrap">
                        {formatNumber(scaleValue(node.average, grams), language)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-graphite whitespace-nowrap">
                        {node.deviation !== undefined
                            ? `± ${formatNumber(scaleValue(node.deviation, grams), language)}`
                            : <span className="text-ash">—</span>}
                    </td>
                    <td className="py-2.5 px-3 text-graphite whitespace-nowrap">{node.measurementUnit}</td>
                    <td className="py-2.5 pl-3 pr-4 text-right">
                        {hasDetails && (
                            <button
                                type="button"
                                onClick={() => setDetailsOpen(showDetails ? null : node.nutrientId)}
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] ${
                                    showDetails
                                    ? "bg-mint-wash text-brand-ink"
                                    : "text-ash hover:bg-mist hover:text-carbon"}`}
                                aria-expanded={showDetails}
                                aria-label={`${t.nutrientsDropdown.details}: ${node.name}`}
                            >
                                <Info size={14}/>
                                {refCodes.length > 0 && <span className="tabular-nums">{refCodes.length}</span>}
                            </button>
                        )}
                    </td>
                </tr>
                {showDetails && (
                    <tr className="bg-linen">
                        <td colSpan={5} className="pb-3 pt-1 pr-4" style={{ paddingLeft: 36 + depth * 20 }}>
                            <dl className="grid gap-2 text-[13px]">
                                {node.standardized && (
                                    <div><Badge tone="brand">{t.nutrientsDropdown.standardized}</Badge></div>
                                )}
                                {node.note && (
                                    <div className="flex gap-2">
                                        <dt className="text-ash">{t.nutrientsDropdown.note}:</dt>
                                        <dd className="text-graphite">{node.note}</dd>
                                    </div>
                                )}
                                {refCodes.length > 0 && (
                                    <div>
                                        <dt className="mb-1 text-ash">{t.nutrientsDropdown.references}:</dt>
                                        <dd>
                                            <ul className="space-y-1">
                                                {refCodes.map(code => (
                                                    <li key={code} className="flex gap-2 text-graphite">
                                                        <span className="font-medium text-carbon tabular-nums">
                                                            [{code}]
                                                        </span>
                                                        <span className="line-clamp-2">
                                                            {referenceByCode.get(code)?.text ?? ""}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </td>
                    </tr>
                )}
                {hasChildren && isExpanded && children.map(child => renderRows(child, depth + 1))}
            </Fragment>
        );
    };

    return (
        <div className="overflow-hidden rounded-card border border-fog bg-paper">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fog px-4 py-3">
                <p className="text-[13px] text-graphite">{t.nutrientsDropdown.perPortion(grams)}</p>
                {parentIds.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setExpanded(allExpanded ? new Set() : new Set(parentIds))}
                        className="text-[13px] font-medium text-brand hover:underline"
                    >
                        {allExpanded ? t.nutrientsDropdown.collapseAll : t.nutrientsDropdown.expandAll}
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-[14px]">
                    <thead>
                        <tr className="text-left text-[12px] font-medium uppercase tracking-wide text-ash">
                            <th className="py-2.5 pl-4 pr-3 font-medium">{t.nutrientsDropdown.nutrient}</th>
                            <th className="py-2.5 px-3 text-right font-medium">{t.nutrientsDropdown.value}</th>
                            <th className="py-2.5 px-3 text-right font-medium">{t.nutrientsDropdown.deviation}</th>
                            <th className="py-2.5 px-3 font-medium">{t.nutrientsDropdown.unit}</th>
                            <th className="py-2.5 pl-3 pr-4">
                                <span className="sr-only">{t.nutrientsDropdown.details}</span>
                            </th>
                        </tr>
                    </thead>
                    {nutrientCategories.map(category => {
                        const nodes = measurementSection(measurements, category);
                        if (nodes.length === 0) return null;
                        const collapsed = collapsedSections.has(category);

                        return (
                            <tbody key={category} className="border-t border-fog">
                                <tr className="bg-linen">
                                    <th colSpan={5} className="p-0 text-left">
                                        <button
                                            type="button"
                                            onClick={() => setCollapsedSections(prev => toggle(prev, category))}
                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-[13px]
                                            font-semibold text-carbon hover:bg-mist"
                                            aria-expanded={!collapsed}
                                        >
                                            {collapsed ? <ChevronRight size={16}/> : <ChevronDown size={16}/>}
                                            <span className={`size-2 rounded-full ${categoryDot[category]}`}/>
                                            {categoryLabel(t, category)}
                                            <span className="font-normal text-ash">({nodes.length})</span>
                                        </button>
                                    </th>
                                </tr>
                                {!collapsed && nodes.map(node => renderRows(node, 0))}
                            </tbody>
                        );
                    })}
                </table>
            </div>
        </div>
    );
}
