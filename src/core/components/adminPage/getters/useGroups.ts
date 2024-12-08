import useFetch from "../../../hooks/useFetch"

type Group ={
    id: number,
    code: string,
    name: string,
}

const useGroups = ()=>{
 return useFetch<Group[]>("/groups")
}

export default useGroups;