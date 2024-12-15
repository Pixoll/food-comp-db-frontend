import useFetch, { FetchStatus } from '../../../hooks/useFetch';
import { Group } from '../../../types/option';
import { Collection } from '../../../utils/collection';

export default function useGroups() {
  const result = useFetch<Group[]>("/groups");

  const collectionGroups = new Collection<string, string>();
  if (result.status === FetchStatus.Success) {
    result.data.forEach((group) => {
      collectionGroups.set(group.id.toString(), group.name);
    });
  }
  return { collectionGroups };
}
