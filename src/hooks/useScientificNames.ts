"use client";

import type { ScientificName } from "@/api";
import { Collection } from "@/utils/collection";
import { useState } from "react";
import { FetchStatus, useApi } from "./useApi";

type UseScientificNames = {
    idToObject: Collection<number, ScientificName>;
    idToName: Collection<string, string>;
    nameToId: Collection<string, number>;
    forceReload: () => void;
};

export function useScientificNames(): UseScientificNames {
    const result = useApi([], (api) => api.getScientificNames());
    const [idToObject, setIdToObject] = useState(new Collection<number, ScientificName>());
    const [idToName, setIdToName] = useState(new Collection<string, string>());
    const [nameToId, setNameToId] = useState(new Collection<string, number>());

    if (result.status === FetchStatus.Success && idToObject.size === 0 && idToName.size === 0 && idToName.size === 0) {
        result.data.forEach((scientificName) => {
            idToObject.set(scientificName.id, scientificName);
            idToName.set(scientificName.id.toString(), scientificName.name);
            nameToId.set(scientificName.name, scientificName.id);
        });
        setIdToObject(idToObject.clone());
        setIdToName(idToName.clone());
        setNameToId(nameToId.clone());
    }

    const forceReload = (): void => {
        if (result.status !== FetchStatus.Loading) {
            result.forceReload();
            idToObject.clear();
            idToName.clear();
            nameToId.clear();
            setIdToObject(new Collection());
            setIdToName(new Collection());
            setNameToId(new Collection());
        }
    };

    return { idToObject, idToName, nameToId, forceReload };
}
