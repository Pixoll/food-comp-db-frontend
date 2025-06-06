"use client";

import { Collection } from "@/utils/collection";
import { useState } from "react";
import { FetchStatus, useApi } from "./useApi";

export type Type = {
    id: number;
    code: string;
    name: string;
};

export function useTypes() {
    const result = useApi([], (api) => api.getFoodTypesV1());
    const [idToObject, setIdToObject] = useState(new Collection<number, Type>());
    const [idToName, setIdToName] = useState(new Collection<string, string>());
    const [codeToId, setCodeToId] = useState(new Collection<string, number>());

    if (result.status === FetchStatus.Success && idToObject.size === 0 && idToName.size === 0 && codeToId.size === 0) {
        result.data.forEach((type) => {
            idToObject.set(type.id, type);
            idToName.set(type.id.toString(), type.name);
            codeToId.set(type.code, type.id);
        });
        setIdToObject(idToObject.clone());
        setIdToName(idToName.clone());
        setCodeToId(codeToId.clone());
    }

    const forceReload = () => {
        if (result.status !== FetchStatus.Loading) {
            result.forceReload();
            idToObject.clear();
            idToName.clear();
            codeToId.clear();
            setIdToObject(new Collection());
            setIdToName(new Collection());
            setCodeToId(new Collection());
        }
    };

    return { idToObject, idToName, codeToId, forceReload };
}
