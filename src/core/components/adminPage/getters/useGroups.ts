import useFetch from "../../../hooks/useFetch";

export type Group = {
  id: number;
  code: string;
  name: string;
};

export default function useGroups() {
  return useFetch<Group[]>("/groups");
}
