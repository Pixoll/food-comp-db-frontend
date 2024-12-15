import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type Subspecies = {
  id: number;
  name: string;
};

export function useSubspecies() {
  const result = useFetch<Subspecies[]>("/subspecies");
  const idToObject = new Collection<number, Subspecies>();
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
