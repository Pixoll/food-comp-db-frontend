"use client";

import { PageContainer } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useApi } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { type JSX, Suspense, useEffect, useMemo, useState } from "react";
import FilterBody, { emptyFilters, type Filters, type Operator } from "./components/FilterBody";
import FoodResultsTable from "./components/nutrient-table/FoodResultsTable";

function Search(): JSX.Element {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const paramFoodName = searchParams.get("foodName") ?? "";
    const paramGroups = searchParams.get("groups") ?? "";

    const [filters, setFilters] = useState<Filters>(() => ({
        ...emptyFilters(),
        groups: parseGroups(paramGroups),
    }));
    const [name, setName] = useState(paramFoodName);
    const [debouncedName, setDebouncedName] = useState(paramFoodName);

    const [syncedParams, setSyncedParams] = useState({ name: paramFoodName, groups: paramGroups });

    // si cambia la URL (por ejemplo, desde la página principal), se aplican sus parámetros
    if (syncedParams.name !== paramFoodName || syncedParams.groups !== paramGroups) {
        if (syncedParams.name !== paramFoodName) {
            setName(paramFoodName);
            setDebouncedName(paramFoodName);
        }
        if (syncedParams.groups !== paramGroups) {
            setFilters(prev => ({ ...prev, groups: parseGroups(paramGroups) }));
        }
        setSyncedParams({ name: paramFoodName, groups: paramGroups });
    }

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedName(name), 300);
        return () => clearTimeout(timeout);
    }, [name]);

    // solo los filtros de nutrientes completos y válidos se envían al backend
    const query = useMemo(() => {
        const nutrients: number[] = [];
        const operators: Operator[] = [];
        const values: number[] = [];

        for (const filter of filters.nutrients) {
            const value = Number(filter.value.replace(",", "."));
            if (filter.id && filter.value.trim() !== "" && Number.isFinite(value) && value >= 0) {
                nutrients.push(filter.id);
                operators.push(filter.op);
                values.push(value);
            }
        }

        return {
            name: debouncedName.trim(),
            groups: filters.groups,
            nutrients,
            operators,
            values,
        };
    }, [debouncedName, filters]);

    const queryKey = JSON.stringify(query);

    const foodsResult = useApi([queryKey], (api, key) => api.getFoods({ query: JSON.parse(key) as typeof query }));

    const reset = (): void => {
        setFilters(emptyFilters());
        setName("");
    };

    return (
        <PageContainer width="xl">
            <h1 className="sr-only">{t.foodResults.title}</h1>
            <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="rounded-card border border-fog bg-paper p-5 lg:sticky lg:top-6">
                    <FilterBody filters={filters} onChange={setFilters} onReset={reset}/>
                </aside>
                <FoodResultsTable result={foodsResult} name={name} onNameChange={setName}/>
            </div>
        </PageContainer>
    );
}

function parseGroups(param: string): number[] {
    return param.split(",").map(g => +g.trim()).filter(g => Number.isInteger(g) && g > 0);
}

export default function SearchPage(): JSX.Element {
    return (
        <Suspense>
            <Search/>
        </Suspense>
    );
}
