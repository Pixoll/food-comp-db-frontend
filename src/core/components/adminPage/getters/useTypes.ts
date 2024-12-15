import useFetch from "../../../hooks/useFetch";

export type Type = {
  id: number;
  code: string;
  name: string;
};

export default function useTypes() {
  return useFetch<Type[]>("/types");
}
