import useFetch from '../../../hooks/useFetch';
import { GroupedNutrients } from '../../../types/option';
import { Collection } from '../../../utils/collection';


const GetNutrients = () => {
  const { data, error, loading } = useFetch<GroupedNutrients>("http://localhost:3000/api/v1/nutrients");
  const collectionNutrients = new Collection<string,string>()
  if(data){

  }
  return { data, error, loading, collectionNutrients};
};

export default GetNutrients;
