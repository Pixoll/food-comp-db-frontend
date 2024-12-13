import useFetch from "../../../hooks/useFetch";

export type Subspecies = {
    id: number;
    name: string;
};

const useSubspecies = () =>{
    return useFetch<Subspecies[]>(`/subspecies`)
}
export default useSubspecies