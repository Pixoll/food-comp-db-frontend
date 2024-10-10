import useFetch from '../../../hooks/useFetch';
import { Group } from '../../../types/option';
import { Collection } from '../../../utils/collection';
const GetGroups = () => {
  const { data, error, loading } = useFetch<Group[]>("http://localhost:3000/api/v1/groups");

  const collectionGroups = new Collection<string, string>();
  if (data) {
    data.forEach((group) => {
      collectionGroups.set(group.id.toString(), group.name);
    });
  }
  return { data, error, loading,collectionGroups};
};

export default GetGroups;
