import useFetch from "../../../hooks/useFetch";

type ScientificName = {
    id: number;
    name: string;
};

const useScientificNames = () =>{
    return useFetch<ScientificName[]>(`/scientific_names`)
}
export default useScientificNames