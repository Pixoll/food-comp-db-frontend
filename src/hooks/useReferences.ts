"use client";

import type { Reference } from "@/api";
import { useMemo } from "react";
import { FetchStatus, useApi } from "./useApi";

type UseReferences = {
    status: FetchStatus;
    references: Reference[];
    byCode: Map<number, Reference>;
    /** Siguiente código libre (el backend exige que el cliente elija el código). */
    nextCode: number;
    forceReload: () => void;
};

export function useReferences(): UseReferences {
    const result = useApi([], (api) => api.getReferences());
    const data = result.status === FetchStatus.Success ? result.data : null;

    const references = useMemo(() => [...(data ?? [])].sort((a, b) => a.code - b.code), [data]);
    const byCode = useMemo(() => new Map(references.map(r => [r.code, r])), [references]);
    const nextCode = useMemo(() => references.reduce((max, r) => Math.max(max, r.code), 0) + 1, [references]);

    const forceReload = (): void => {
        if (result.status !== FetchStatus.Loading) {
            result.forceReload();
        }
    };

    return { status: result.status, references, byCode, nextCode, forceReload };
}
