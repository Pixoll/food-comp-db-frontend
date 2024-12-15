import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type Language = {
  id: number;
  code: "es" | "en" | "pt";
  name: string;
};

export function useLanguages() {
  const result = useFetch<Language[]>("/languages");
  const languages = new Collection<number, Language>();

  if (result.status === FetchStatus.Success) {
    result.data.forEach((language) => {
      languages.set(language.id, language);
    });
  }

  return languages;
}
