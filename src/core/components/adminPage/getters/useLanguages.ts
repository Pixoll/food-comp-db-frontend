import useFetch from "../../../hooks/useFetch"
type Language ={
    id: number,
    code: "es" | "en" | "pt",
    name: string,
}

const useLanguages = ()=>{

 const{data, loading, error} = useFetch<Language[]>("http://localhost:3000/api/v1/languages")

 return {data, loading, error}
}

export default useLanguages;