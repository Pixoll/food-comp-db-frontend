import useFetch, { FetchStatus } from '../../../hooks/useFetch';
import { Language } from '../../../types/option';
import { Collection } from '../../../utils/collection';

export default function useLanguages() {
  const result = useFetch<Language[]>("/languages");
  const collectionLanguages = new Collection<string, string>();
  if (result.status === FetchStatus.Success) {
    result.data.forEach((language) => {
      collectionLanguages.set(language.id.toString(), language.name);
    });
  }
  return { collectionLanguages };
}
