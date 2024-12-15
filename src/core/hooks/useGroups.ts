import { useState } from "react";
import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type Group = {
  id: number;
  code: string;
  name: string;
};

export function useGroups() {
  const result = useFetch<Group[]>("/groups");
  const [idToObject, setIdToObject] = useState(new Collection<number, Group>());
  const [idToName, setIdToName] = useState(new Collection<string, string>());
  const [codeToId, setCodeToId] = useState(new Collection<string, number>());

  if (result.status === FetchStatus.Success && idToObject.size === 0 && idToName.size === 0 && codeToId.size === 0) {
    result.data.forEach((group) => {
      idToObject.set(group.id, group);
      idToName.set(group.id.toString(), group.name);
      codeToId.set(group.code, group.id);
    });
    setIdToObject(idToObject.clone());
    setIdToName(idToName.clone());
    setCodeToId(codeToId.clone());
  }

  const forceReload = () => {
    if (result.status !== FetchStatus.Loading) {
      result.forceReload();
      idToObject.clear();
      idToName.clear();
      codeToId.clear();
      setIdToObject(new Collection());
      setIdToName(new Collection());
      setCodeToId(new Collection());
    }
  };

  return { idToObject, idToName, codeToId, forceReload };
}
