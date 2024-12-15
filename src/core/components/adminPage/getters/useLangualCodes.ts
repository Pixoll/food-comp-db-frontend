import useFetch from "../../../hooks/useFetch";

export type LangualCode = {
  id: number;
  code: string;
  descriptor: string;
};

export default function useLangualCodes() {
  return useFetch<LangualCode[]>("/langual_codes");
}
