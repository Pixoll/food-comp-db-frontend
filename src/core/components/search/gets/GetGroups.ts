import useFetch, { FetchStatus } from '../../../hooks/useFetch';
import { Group } from '../../../types/option';
import { Collection } from '../../../utils/collection';
const GetGroups = () => {
  const result = useFetch<Group[]>("http://localhost:3000/api/v1/groups");

  const collectionGroups = new Collection<string, string>();
  if (result.status === FetchStatus.Success) {
    result.data.forEach((group) => {
      collectionGroups.set(group.id.toString(), group.name);
    });
  }
  return { collectionGroups };
};

export default GetGroups;
