import useFetch from "../../../hooks/useFetch"
type Type ={
    id: number,
    code: string,
    name: string,
}

const useTypes = ()=>{

 const{data, loading, error} = useFetch<Type[]>("http://localhost:3000/api/v1/types")

 return {data, loading, error}
}

export default useTypes;