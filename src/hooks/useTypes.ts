"use client";

import type { FoodType } from "@/api";
import { Collection } from "@/utils/collection";
import { useState } from "react";
import { FetchStatus, useApi } from "./useApi";

export type UseTypes = {
    idToObject: Collection<number, FoodType>;
    idToName: Collection<string, string>;
    codeToId: Collection<string, number>;
    forceReload: () => void;
};

export function useTypes(): UseTypes {
    const result = useApi([], (api) => api.getFoodTypes());
    const [idToObject, setIdToObject] = useState(new Collection<number, FoodType>());
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

    const forceReload = (): void => {
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
