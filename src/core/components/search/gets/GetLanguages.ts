import useFetch from '../../../hooks/useFetch';
import { Language } from '../../../types/option';
import { Collection } from '../../../utils/collection';

const GetLanguages = () => {
  const { data, error, loading } = useFetch<Language[]>("http://localhost:3000/api/v1/languages");
  const collectionLanguages = new Collection<string,string>()
  if(data){
    data.forEach((language)=>{
      collectionLanguages.set(language.id.toString(), language.name)
    })
  }
  return { data, error, loading, collectionLanguages};
};

export default GetLanguages;
