import useFetch, { FetchStatus } from '../../../hooks/useFetch';
import { Language } from '../../../types/option';
import { Collection } from '../../../utils/collection';

const GetLanguages = () => {
  const result = useFetch<Language[]>("http://localhost:3000/api/v1/languages");
  const collectionLanguages = new Collection<string,string>()
  if (result.status === FetchStatus.Success) {
    result.data.forEach((language)=>{
      collectionLanguages.set(language.id.toString(), language.name)
    })
  }
  return { collectionLanguages };
};

export default GetLanguages;
