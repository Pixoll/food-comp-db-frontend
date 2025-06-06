"use client";

import { LangualCode } from "@/api";
import { Collection } from "@/utils/collection";
import { useState } from "react";
import { FetchStatus, useApi } from "./useApi";

export function useLangualCodes() {
    const result = useApi([], (api) => api.getLangualCodesV1());
    const [langualCodes, setLangualCodes] = useState(new Collection<string, LangualCode>());

    if (result.status === FetchStatus.Success && langualCodes.size === 0) {
        result.data.forEach((langualCode) => {
            langualCodes.set(langualCode.id.toString(), langualCode);
        });
        setLangualCodes(langualCodes.clone());
    }

    return langualCodes;
}
