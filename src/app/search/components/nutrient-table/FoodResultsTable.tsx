"use client";

import type { BaseFood } from "@/api";
import {
    Button,
    ButtonLink,
    buttonClass,
    EmptyState,
    ErrorState,
    Input,
    LoadingState,
    Select,
} from "@/app/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useComparison } from "@/context/ComparisonContext";
import { useTranslation } from "@/context/I18nContext";
import { type FetchResult, FetchStatus } from "@/hooks";
import { downloadCsv } from "@/utils/csv";
import { foodDisplayName } from "@/utils/nutrients";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, GitCompareArrows, Pencil, Plus, Search, SearchX }
    from "lucide-react";
import Link from "next/link";
import { type JSX, useMemo, useState } from "react";

type FoodResultsTableProps = {
    result: FetchResult<BaseFood[]>;
    name: string;
    onNameChange: (name: string) => void;
};

type SortKey = "code" | "name" | "scientificName";

const PAGE_SIZES = [10, 25, 50, 100];

export default function FoodResultsTable({ result, name, onNameChange }: FoodResultsTableProps): JSX.Element {
    const { t, language } = useTranslation();
    const r = t.foodResults;
    const { state } = useAuth();
    const { comparisonFoods, addToComparison, removeFromComparison } = useComparison();
    const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: "name", asc: true });
    const [pageSize, setPageSize] = useState(25);
    const [page, setPage] = useState(1);

    const foods = useMemo(() => result.status === FetchStatus.Success ? result.data : [], [result]);

    const sorted = useMemo(() => {
        const value = (food: BaseFood): string => {
            switch (sort.key) {
                case "code":
                    return food.code;
                case "name":
                    return foodDisplayName(food, "~").toLowerCase();
                case "scientificName":
                    return food.scientificName?.toLowerCase() ?? "~";
            }
        };

        return [...foods].sort((a, b) => {
            const comparison = value(a).localeCompare(value(b), language);
            return sort.asc ? comparison : -comparison;
        });
    }, [foods, sort, language]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const records = sorted.slice((page - 1) * pageSize, page * pageSize);
    const inComparison = new Set(comparisonFoods.map(f => f.code));
    const pageAllSelected = records.length > 0 && records.every(f => inComparison.has(f.code));

    const [pagedFoods, setPagedFoods] = useState(foods);

    // con resultados nuevos se vuelve a la primera página
    if (pagedFoods !== foods) {
        setPagedFoods(foods);
        setPage(1);
    }

    const toggleSort = (key: SortKey): void => {
        setSort(prev => prev.key === key ? { key, asc: !prev.asc } : { key, asc: true });
    };

    const toggleComparison = (food: BaseFood): void => {
        if (inComparison.has(food.code)) {
            removeFromComparison([food.code]);
        } else {
            addToComparison([{ code: food.code, name: foodDisplayName(food, food.code) }]);
        }
    };

    const togglePage = (): void => {
        if (pageAllSelected) {
            removeFromComparison(records.map(f => f.code));
        } else {
            addToComparison(records
                .filter(f => !inComparison.has(f.code))
                .map(f => ({ code: f.code, name: foodDisplayName(f, f.code) })));
        }
    };

    const exportCsv = (): void => {
        downloadCsv("alimentos.csv", [
            [r.table.code, t.foodDetail.foodName, t.foodDetail.commonName, r.table.scientificName],
            ...sorted.map(f => [f.code, f.foodName, f.commonName, f.scientificName]),
        ], language);
    };

    const sortHeader = (sortKey: SortKey, label: string): JSX.Element => (
        <button
            type="button"
            onClick={() => toggleSort(sortKey)}
            className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-carbon"
        >
            {label}
            {sort.key === sortKey && (sort.asc ? <ArrowUp size={12}/> : <ArrowDown size={12}/>)}
        </button>
    );

    return (
        <section className="min-w-0 rounded-card border border-fog bg-paper">
            <div className="flex flex-col gap-4 border-b border-fog p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-[20px] font-semibold text-carbon">
                        {r.title}
                        {result.status === FetchStatus.Success && (
                            <span className="ml-2 text-[14px] font-normal text-ash">{r.count(sorted.length)}</span>
                        )}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<Download size={14}/>}
                            onClick={exportCsv}
                            disabled={sorted.length === 0}
                        >
                            {r.export}
                        </Button>
                        <ButtonLink href="/compare" size="sm" icon={<GitCompareArrows size={14}/>}>
                            {r.goToCompare(comparisonFoods.length)}
                        </ButtonLink>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash"/>
                        <Input
                            value={name}
                            onChange={e => onNameChange(e.target.value)}
                            placeholder={r.search}
                            aria-label={r.search}
                            className="rounded-full pl-9"
                        />
                    </div>
                    <label className="flex items-center gap-2 whitespace-nowrap text-[13px] text-graphite">
                        {r.resultsPerPage}
                        <Select
                            value={pageSize}
                            onChange={e => {
                                setPageSize(+e.target.value);
                                setPage(1);
                            }}
                            className="w-[84px]"
                        >
                            {PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                        </Select>
                    </label>
                </div>
            </div>

            {result.status === FetchStatus.Loading && <LoadingState label={r.loading}/>}

            {result.status === FetchStatus.Failed && (
                <ErrorState
                    title={r.error}
                    description={result.error}
                    action={<Button variant="secondary" onClick={result.forceReload}>{r.retry}</Button>}
                />
            )}

            {result.status === FetchStatus.Success && sorted.length === 0 && (
                <EmptyState icon={<SearchX size={20}/>} title={r.noResults} description={r.recommendation}/>
            )}

            {result.status === FetchStatus.Success && sorted.length > 0 && (
                <>
                    <div className="relative overflow-x-auto">
                        <table className="w-full min-w-[640px] text-[14px]">
                            <thead>
                                <tr className="text-left text-[12px] font-medium text-ash">
                                    <th className="py-3 pl-5 pr-3 font-medium">
                                        {sortHeader("code", r.table.code)}
                                    </th>
                                    <th className="px-3 py-3 font-medium">
                                        {sortHeader("name", r.table.name)}
                                    </th>
                                    <th className="px-3 py-3 font-medium">
                                        {sortHeader("scientificName", r.table.scientificName)}
                                    </th>
                                    <th className="py-3 pl-3 pr-5 text-right font-medium">
                                        <button
                                            type="button"
                                            onClick={togglePage}
                                            className="uppercase tracking-wide text-brand hover:underline"
                                        >
                                            {pageAllSelected ? r.deselect : r.select}
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map(food => {
                                    const selected = inComparison.has(food.code);
                                    const displayName = foodDisplayName(food);
                                    return (
                                        <tr key={food.code} className="border-t border-fog hover:bg-linen">
                                            <td className="py-3 pl-5 pr-3 align-top">
                                                <Link
                                                    href={`/detail-food/${food.code}`}
                                                    className="font-mono text-[13px] text-graphite hover:text-brand"
                                                >
                                                    {food.code}
                                                </Link>
                                            </td>
                                            <td className="px-3 py-3 align-top">
                                                <Link
                                                    href={`/detail-food/${food.code}`}
                                                    className="font-medium text-carbon hover:text-brand"
                                                >
                                                    {displayName || <span className="text-ash">—</span>}
                                                </Link>
                                                {food.foodName && food.commonName && (
                                                    <p className="mt-0.5 line-clamp-1 text-[13px] text-ash">
                                                        {food.commonName}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 align-top italic text-graphite">
                                                {food.scientificName
                                                    ?? <span className="not-italic text-ash">—</span>}
                                            </td>
                                            <td className="py-2.5 pl-3 pr-5 align-top">
                                                <div className="flex justify-end gap-1.5">
                                                    {state.isAuthenticated && (
                                                        <Link
                                                            href={`/modify-food/${food.code}`}
                                                            className={buttonClass("ghost", "sm")}
                                                            title={r.table.modify}
                                                        >
                                                            <Pencil size={14}/>
                                                            <span className="sr-only">{r.table.modify}</span>
                                                        </Link>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant={selected ? "soft" : "secondary"}
                                                        onClick={() => toggleComparison(food)}
                                                        aria-pressed={selected}
                                                        title={selected
                                                            ? r.table.removeFromCompare
                                                            : r.table.addToCompare}
                                                        icon={selected
                                                            ? <GitCompareArrows size={14}/>
                                                            : <Plus size={14}/>}
                                                    >
                                                        {r.table.compare}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-fog px-5 py-3">
                        <p className="text-[13px] text-ash">{r.page(page, totalPages)}</p>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={<ChevronLeft size={14}/>}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                {r.previous}
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                {r.next}
                                <ChevronRight size={14}/>
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
