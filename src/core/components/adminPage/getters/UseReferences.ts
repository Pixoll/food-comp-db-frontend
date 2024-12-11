import useFetch from "../../../hooks/useFetch"
import { FetchStatus } from "../../../hooks/useFetch";

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
}
export type City = {
    id: number;
    name: string;
}
//articulo depende del
export type Journal = {
    id: number;
    name: string;
}
export type JournalVolume = {
    id: number;
    journalId: number;
    volume: number;
    issue: number;
    year: number;
}
export type Article = {
    id: number;
    volumeId: number;
    pageStart: number;
    pageEnd: number;
};

const useReferences = () => {
    const referencesResult = useFetch<Reference[]>("/references");
    const authorsResult = useFetch<Author[]>("/references/authors");
    const citiesResult = useFetch<City[]>("/references/cities");
    const journalsResult = useFetch<Journal[]>("/references/journals");
    const journalsVolumesResult = useFetch<JournalVolume[]>("/references/journal_volumes");
    const articlesResult = useFetch<Article[]>("/references/articles");
  
    return {
      references: referencesResult.status === FetchStatus.Success ? referencesResult.data : null,
      authors: authorsResult.status === FetchStatus.Success ? authorsResult.data : null,
      cities: citiesResult.status === FetchStatus.Success ? citiesResult.data : null,
      journals: journalsResult.status === FetchStatus.Success ? journalsResult.data : null,
      journalVolumes: journalsVolumesResult.status === FetchStatus.Success ? journalsVolumesResult.data : null,
      articles: articlesResult.status === FetchStatus.Success ? articlesResult.data : null,
    };
  };
  
  export default useReferences;