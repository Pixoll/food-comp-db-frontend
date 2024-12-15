import useFetch from "../../../hooks/useFetch";

export type ScientificName = {
  id: number;
  name: string;
};

export default function useScientificNames() {
  return useFetch<ScientificName[]>("/scientific_names");
}
