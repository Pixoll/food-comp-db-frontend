"use client";

import type { FoodGroup } from "@/api";
import { Collection } from "@/utils/collection";
import { useMemo } from "react";
import { FetchStatus, useApi } from "./useApi";

type UseGroups = {
    status: FetchStatus;
    idToObject: Collection<number, FoodGroup>;
    idToName: Collection<string, string>;
    codeToId: Collection<string, number>;
    forceReload: () => void;
};

export function useGroups(): UseGroups {
    const result = useApi([], (api) => api.getFoodGroups());
    const data = result.status === FetchStatus.Success ? result.data : null;

    // derivado de la respuesta: al recargar se recalcula solo (antes quedaban datos viejos)
    const collections = useMemo(() => {
        const groups = data ?? [];
        return {
            idToObject: new Collection(groups.map(g => [g.id, g] as const)),
            idToName: new Collection(groups.map(g => [g.id.toString(), g.name] as const)),
            codeToId: new Collection(groups.map(g => [g.code, g.id] as const)),
        };
    }, [data]);

    const forceReload = (): void => {
        if (result.status !== FetchStatus.Loading) {
            result.forceReload();
        }
    };

    return { status: result.status, ...collections, forceReload };
}
