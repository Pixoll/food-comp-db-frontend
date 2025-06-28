"use client";

import type { Language } from "@/api";
import { FetchStatus, useApi } from "@/hooks/useApi";
import { Collection } from "@/utils/collection";
import { useState } from "react";

export function useLanguages(): Collection<number, Language> {
    const result = useApi([], (api) => api.getLanguages());
    const [languages, setLanguages] = useState(new Collection<number, Language>());

    if (result.status === FetchStatus.Success && languages.size === 0) {
        result.data.forEach((language) => {
            languages.set(language.id, language);
        });
        setLanguages(languages.clone());
    }

    return languages;
}
