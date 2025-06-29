"use client";

import type { FoodGroup } from "@/api";
import { Collection } from "@/utils/collection";
import { useState } from "react";
import { FetchStatus, useApi } from "./useApi";

type UseGroups = {
    idToObject: Collection<number, FoodGroup>;
    idToName: Collection<string, string>;
    codeToId: Collection<string, number>;
    forceReload: () => void;
};

export function useGroups(): UseGroups {
    const result = useApi([], (api) => api.getFoodGroups());
    const [idToObject, setIdToObject] = useState(new Collection<number, FoodGroup>());
    const [idToName, setIdToName] = useState(new Collection<string, string>());
    const [codeToId, setCodeToId] = useState(new Collection<string, number>());

    if (result.status === FetchStatus.Success && idToObject.size === 0 && idToName.size === 0 && codeToId.size === 0) {
        result.data.forEach((group) => {
            idToObject.set(group.id, group);
            idToName.set(group.id.toString(), group.name);
            codeToId.set(group.code, group.id);
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
