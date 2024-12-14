import useFetch from "../../../hooks/useFetch"
export type Language ={
    id: number,
    code: "es" | "en" | "pt",
    name: string,
}

const useLanguages = ()=>{
 return useFetch<Language[]>("/languages")
}

export default useLanguages;