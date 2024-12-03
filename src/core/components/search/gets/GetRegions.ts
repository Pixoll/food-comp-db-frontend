import useFetch, { FetchStatus } from '../../../hooks/useFetch';
import { Region } from '../../../types/option';
import { Collection } from '../../../utils/collection';
const GetRegions = () => {
  const result = useFetch<Region[]>("http://localhost:3000/api/v1/origins");
  const collectionRegions = new Collection<string,string>()
  if (result.status === FetchStatus.Success) {
    result.data.forEach((region)=>{
      collectionRegions.set(region.id.toString(), region.name)
    })
  }
  return { collectionRegions };
};

export default GetRegions;
