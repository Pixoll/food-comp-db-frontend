import useFetch from "../../../hooks/useFetch"
type Type ={
    id: number,
    code: string,
    name: string,
}

const useTypes = ()=>{
 return useFetch<Type[]>("/types")
}

export default useTypes;