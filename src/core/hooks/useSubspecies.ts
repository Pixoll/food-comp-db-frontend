import { useState } from "react";
import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type Subspecies = {
  id: number;
  name: string;
};

export function useSubspecies() {
  const result = useFetch<Subspecies[]>("/subspecies");
  const [idToObject, setIdToObject] = useState(new Collection<number, Subspecies>());
  const [idToName, setIdToName] = useState(new Collection<string, string>());
  const [nameToId, setNameToId] = useState(new Collection<string, number>());

  if (result.status === FetchStatus.Success && idToObject.size === 0 && idToName.size === 0 && idToName.size === 0) {
    result.data.forEach((scientificName) => {
      idToObject.set(scientificName.id, scientificName);
      idToName.set(scientificName.id.toString(), scientificName.name);
      nameToId.set(scientificName.name, scientificName.id);
    });
    setIdToObject(idToObject.clone());
    setIdToName(idToName.clone());
    setNameToId(nameToId.clone());
  }

  const forceReload = () => {
    if (result.status !== FetchStatus.Loading) {
      result.forceReload();
      idToObject.clear();
      idToName.clear();
      nameToId.clear();
      setIdToObject(new Collection());
      setIdToName(new Collection());
      setNameToId(new Collection());
    }
  };

  return { idToObject, idToName, nameToId, forceReload };
}
