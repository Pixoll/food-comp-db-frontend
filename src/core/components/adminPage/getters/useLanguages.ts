import useFetch from "../../../hooks/useFetch";

export type Language = {
  id: number;
  code: "es" | "en" | "pt";
  name: string;
};

export default function useLanguages() {
  return useFetch<Language[]>("/languages");
}
