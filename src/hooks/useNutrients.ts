"use client";

import type { GroupedNutrients } from "@/api";
import { type CatalogNutrient, flattenCatalog } from "@/utils/nutrients";
import { useMemo } from "react";
import { FetchStatus, useApi } from "./useApi";

export type { CatalogNutrient } from "@/utils/nutrients";

type UseNutrients = {
    status: FetchStatus;
    /** Catálogo tal como lo entrega el backend (macronutrientes en árbol). */
    grouped: GroupedNutrients | null;
    /** Catálogo aplanado en orden de visualización, con profundidad y padre. */
    list: CatalogNutrient[];
    byId: Map<number, CatalogNutrient>;
    forceReload: () => void;
};

export function useNutrients(): UseNutrients {
    const result = useApi([], (api) => api.getNutrients());
    const grouped = result.status === FetchStatus.Success ? result.data : null;

    const list = useMemo(() => grouped ? flattenCatalog(grouped) : [], [grouped]);
    const byId = useMemo(() => new Map(list.map(n => [n.id, n])), [list]);

    const forceReload = (): void => {
        if (result.status !== FetchStatus.Loading) {
            result.forceReload();
        }
    };

    return { status: result.status, grouped, list, byId, forceReload };
}
