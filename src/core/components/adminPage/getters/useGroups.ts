import useFetch from "../../../hooks/useFetch"
type Group ={
    id: number,
    code: string,
    name: string,
}

const useGroups = ()=>{

 const{data, loading, error} = useFetch<Group[]>("http://localhost:3000/api/v1/groups")

 return {data, loading, error}
}

export default useGroups;