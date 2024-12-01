import useFetch from '../../../hooks/useFetch';
import { Region } from '../../../types/option';
import { Collection } from '../../../utils/collection';
const GetRegions = () => {
  const { data, error, loading } = useFetch<Region[]>("http://localhost:3000/api/v1/origins");
  const collectionRegions = new Collection<string,string>()
  if(data){
    data
    .forEach((region)=>{
      collectionRegions.set(region.id.toString(), region.name)
    })
  }
  return { data, error, loading, collectionRegions };
};

export default GetRegions;
