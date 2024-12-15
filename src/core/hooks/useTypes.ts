import { TypeFood } from "../types/option";
import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type Type = {
  id: number;
  code: string;
  name: string;
};

export function useTypes() {
  const result = useFetch<TypeFood[]>("/types");
  const idToObject = new Collection<number, Type>();
  const idToName = new Collection<string, string>();
  const codeToId = new Collection<string, number>();

  if (result.status === FetchStatus.Success) {
    result.data.forEach((type) => {
      idToObject.set(type.id, type);
      idToName.set(type.id.toString(), type.name);
      codeToId.set(type.code, type.id);
    });
  }

  const forceReload = () => {
    if (result.status !== FetchStatus.Loading) {
      result.forceReload();
    }
  };

  return { idToObject, idToName, codeToId, forceReload };
}
