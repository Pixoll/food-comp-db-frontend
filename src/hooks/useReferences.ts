"use client";

import type { Article, Author, City, Journal, JournalVolume, Reference } from "@/api";
import { FetchStatus, useApi } from "./useApi";

type UseReferences = {
    references: Reference[] | null;
    authors: Author[] | null;
    cities: City[] | null;
    journals: Journal[] | null;
    journalVolumes: JournalVolume[] | null;
    articles: Article[] | null;
    forceReload: () => void;
};

export function useReferences(): UseReferences {
    const referencesResult = useApi([], (api) => api.getReferences());
    const authorsResult = useApi([], (api) => api.getAuthors());
    const citiesResult = useApi([], (api) => api.getCities());
    const journalsResult = useApi([], (api) => api.getJournals());
    const journalsVolumesResult = useApi([], (api) => api.getJournalVolumes());
    const articlesResult = useApi([], (api) => api.getArticles());

    const forceReload = (): void => {
        if (referencesResult.status !== FetchStatus.Loading) {
            referencesResult.forceReload();
        }
        if (authorsResult.status !== FetchStatus.Loading) {
            authorsResult.forceReload();
        }
        if (citiesResult.status !== FetchStatus.Loading) {
            citiesResult.forceReload();
        }
        if (journalsResult.status !== FetchStatus.Loading) {
            journalsResult.forceReload();
        }
        if (journalsVolumesResult.status !== FetchStatus.Loading) {
            journalsVolumesResult.forceReload();
        }
        if (articlesResult.status !== FetchStatus.Loading) {
            articlesResult.forceReload();
        }
    };

    return {
        references: referencesResult.status === FetchStatus.Success ? referencesResult.data : null,
        authors: authorsResult.status === FetchStatus.Success ? authorsResult.data : null,
        cities: citiesResult.status === FetchStatus.Success ? citiesResult.data : null,
        journals: journalsResult.status === FetchStatus.Success ? journalsResult.data : null,
        journalVolumes: journalsVolumesResult.status === FetchStatus.Success ? journalsVolumesResult.data : null,
        articles: articlesResult.status === FetchStatus.Success ? articlesResult.data : null,
        forceReload,
    };
}
