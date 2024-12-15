import useFetch from "../../../hooks/useFetch";

export type Subspecies = {
  id: number;
  name: string;
};

export default function useSubspecies() {
  return useFetch<Subspecies[]>("/subspecies");
}
