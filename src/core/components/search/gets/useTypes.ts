import useFetch, { FetchStatus } from '../../../hooks/useFetch';
import { TypeFood } from '../../../types/option';
import { Collection } from '../../../utils/collection';

export default function useTypes() {
  const result = useFetch<TypeFood[]>("/types");
  const collectionTypes = new Collection<string, string>();
  if (result.status === FetchStatus.Success) {
    result.data.forEach((type) => {
      collectionTypes.set(type.id.toString(), type.name);
    });
  }
  return { collectionTypes };
}
