import useFetch from "../../../hooks/useFetch"
type Language ={
    id: number,
    code: "es" | "en" | "pt",
    name: string,
}

const useLanguages = ()=>{
 return useFetch<Language[]>("http://localhost:3000/api/v1/languages")
}

export default useLanguages;