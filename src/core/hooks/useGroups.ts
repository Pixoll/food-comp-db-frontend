import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type Group = {
  id: number;
  code: string;
  name: string;
};

export function useGroups() {
  const result = useFetch<Group[]>("/groups");
  const idToObject = new Collection<number, Group>();
  const idToName = new Collection<string, string>();
  const codeToId = new Collection<string, number>();

  if (result.status === FetchStatus.Success) {
    result.data.forEach((group) => {
      idToObject.set(group.id, group);
      idToName.set(group.id.toString(), group.name);
      codeToId.set(group.code, group.id);
    });
  }

  const forceReload = () => {
    if (result.status !== FetchStatus.Loading) {
      result.forceReload();
    }
  };

  return { idToObject, idToName, codeToId, forceReload };
}
