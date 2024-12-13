import useFetch from "../../../hooks/useFetch";

export type ScientificName = {
    id: number;
    name: string;
};

const useScientificNames = () =>{
    return useFetch<ScientificName[]>(`/scientific_names`)
}
export default useScientificNames