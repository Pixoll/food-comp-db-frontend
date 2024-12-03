import useFetch from "../../../hooks/useFetch"

type Group ={
    id: number,
    code: string,
    name: string,
}

const useGroups = ()=>{
 return useFetch<Group[]>("http://localhost:3000/api/v1/groups")
}

export default useGroups;