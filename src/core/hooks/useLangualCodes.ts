import { useState } from "react";
import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type LangualCode = {
  id: number;
  code: string;
  descriptor: string;
};

export function useLangualCodes() {
  const result = useFetch<LangualCode[]>("/langual_codes");
  const [langualCodes, setLangualCodes] = useState(new Collection<string, LangualCode>());

  if (result.status === FetchStatus.Success && langualCodes.size === 0) {
    result.data.forEach((langualCode) => {
      langualCodes.set(langualCode.id.toString(), langualCode);
    });
    setLangualCodes(langualCodes.clone());
  }

  return langualCodes;
}
