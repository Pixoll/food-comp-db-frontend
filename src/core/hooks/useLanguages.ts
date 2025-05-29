'use client'
import { useState } from "react";
import { Collection } from "@/core/utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type Language = {
  id: number;
  code: "es" | "en" | "pt";
  name: string;
};

export function useLanguages() {
  const result = useFetch<Language[]>("/languages");
  const [languages, setLanguages] = useState(new Collection<number, Language>());

  if (result.status === FetchStatus.Success && languages.size === 0) {
    result.data.forEach((language) => {
      languages.set(language.id, language);
    });
    setLanguages(languages.clone());
  }

  return languages;
}
