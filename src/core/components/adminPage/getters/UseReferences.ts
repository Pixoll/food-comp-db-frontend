import useFetch from "../../../hooks/useFetch"

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
const useReferences = ()=>{
    return useFetch<Reference[]>("/references")
}
export default useReferences