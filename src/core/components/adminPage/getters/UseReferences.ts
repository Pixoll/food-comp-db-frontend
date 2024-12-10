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
export type Citie = {
    id: number;
    name: string;
}
export type Journal = {
    id: number;
    name: string;
}
export type JournalVolume = {
    id: number;
    name: string;
}
export type Volume = {
    id: number;
    volumeId: number;
    pageStart: number;
    pageEnd:number
}

const useReferences = () => {
    const referencesResult = useFetch<Reference[]>("/references");
    const authorsResult = useFetch<Author[]>("/references/authors");
    const citiesResult = useFetch<Citie[]>("/references/cities");
    const journalsResult = useFetch<Journal[]>("/references/journals");
    const journalsVolumesResult = useFetch<JournalVolume[]>("/references/journal_volumes");
    const volumesResult = useFetch<Volume[]>("/references/volumes");
  
    return {
      references: referencesResult.status === FetchStatus.Success ? referencesResult.data : null,
      authors: authorsResult.status === FetchStatus.Success ? authorsResult.data : null,
      cities: citiesResult.status === FetchStatus.Success ? citiesResult.data : null,
      journals: journalsResult.status === FetchStatus.Success ? journalsResult.data : null,
      journalVolumes: journalsVolumesResult.status === FetchStatus.Success ? journalsVolumesResult.data : null,
      volumes: volumesResult.status === FetchStatus.Success ? volumesResult.data : null,
    };
  };
  
  export default useReferences;