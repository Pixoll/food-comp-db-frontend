import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type LangualCode = {
  id: number;
  code: string;
  descriptor: string;
};

export function useLangualCodes() {
  const result = useFetch<LangualCode[]>("/langual_codes");
  const langualCodes = new Collection<string, LangualCode>();

  if (result.status === FetchStatus.Success) {
    result.data.forEach((langualCode) => {
      langualCodes.set(langualCode.id.toString(), langualCode);
    });
  }

  return langualCodes;
}
