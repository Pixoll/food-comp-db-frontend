import useFetch from "../../../hooks/useFetch"
export type Type ={
    id: number,
    code: string,
    name: string,
}

const useTypes = ()=>{
 return useFetch<Type[]>("/types")
}

export default useTypes;