import useFetch, { FetchStatus } from "../../../hooks/useFetch";

export type Reference = {
  code: number;
  type: "report" | "thesis" | "article" | "website" | "book";
  title: string;
  authors: string[];
  year?: number;
  volume?: number;
  issue?: number;
  volumeYear?: number;
  journalName?: string;
  pageStart?: number;
  pageEnd?: number;
  city?: string;
  other?: string;
};

export type Author = {
  id: number;
  name: string;
};

export type City = {
  id: number;
  name: string;
};

export type Journal = {
  id: number;
  name: string;
};

export type JournalVolume = {
  id: number;
  journalId: number;
  volume: number;
  issue: number;
  year: number;
};

export type Article = {
  id: number;
  volumeId: number;
  pageStart: number;
  pageEnd: number;
};

export default function useReferences() {
  const referencesResult = useFetch<Reference[]>("/references");
  const authorsResult = useFetch<Author[]>("/references/authors");
  const citiesResult = useFetch<City[]>("/references/cities");
  const journalsResult = useFetch<Journal[]>("/references/journals");
  const journalsVolumesResult = useFetch<JournalVolume[]>("/references/journal_volumes");
  const articlesResult = useFetch<Article[]>("/references/articles");

  const forceReload = () => {
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
};
