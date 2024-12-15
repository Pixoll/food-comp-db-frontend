import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type ScientificName = {
  id: number;
  name: string;
};

export function useScientificNames() {
  const result = useFetch<ScientificName[]>("/scientific_names");
  const idToObject = new Collection<number, ScientificName>();
  const idToName = new Collection<string, string>();
  const nameToId = new Collection<string, number>();

  if (result.status === FetchStatus.Success) {
    result.data.forEach((scientificName) => {
      idToObject.set(scientificName.id, scientificName);
      idToName.set(scientificName.id.toString(), scientificName.name);
      nameToId.set(scientificName.name, scientificName.id);
    });
  }

  const forceReload = () => {
    if (result.status !== FetchStatus.Loading) {
      result.forceReload();
    }
  };

  return { idToObject, idToName, nameToId, forceReload };
}
