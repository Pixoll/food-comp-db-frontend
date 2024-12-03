import useFetch from "../../../hooks/useFetch"
type Type ={
    id: number,
    code: string,
    name: string,
}

const useTypes = ()=>{
 return useFetch<Type[]>("http://localhost:3000/api/v1/types")
}

export default useTypes;