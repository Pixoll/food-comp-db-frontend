"use client";

import type { ScientificName } from "@/api";
import { Collection } from "@/utils/collection";
import { useMemo } from "react";
import { FetchStatus, useApi } from "./useApi";

type UseScientificNames = {
    status: FetchStatus;
    idToObject: Collection<number, ScientificName>;
    idToName: Collection<string, string>;
    nameToId: Collection<string, number>;
    forceReload: () => void;
};

export function useScientificNames(): UseScientificNames {
    const result = useApi([], (api) => api.getScientificNames());
    const data = result.status === FetchStatus.Success ? result.data : null;

    // derivado de la respuesta: al recargar se recalcula solo (antes quedaban datos viejos)
    const collections = useMemo(() => {
        const names = data ?? [];
        return {
            idToObject: new Collection(names.map(n => [n.id, n] as const)),
            idToName: new Collection(names.map(n => [n.id.toString(), n.name] as const)),
            nameToId: new Collection(names.map(n => [n.name, n.id] as const)),
        };
    }, [data]);

    const forceReload = (): void => {
        if (result.status !== FetchStatus.Loading) {
            result.forceReload();
        }
    };

    return { status: result.status, ...collections, forceReload };
}
