import useFetch from '../../../hooks/useFetch';
import { TypeFood } from '../../../types/option';
import { Collection } from '../../../utils/collection';
const GetTypes = () => {
  const {data, error, loading} = useFetch<TypeFood[]>("http://localhost:3000/api/v1/types");
  const collectionTypes = new Collection<string,string>()
  if(data){
    data.forEach((type)=>{
      collectionTypes.set(type.id.toString(), type.name)
    })
  }
  return {data, error, loading, collectionTypes};
};

export default GetTypes;
