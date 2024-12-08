import useFetch, { FetchStatus } from '../../../hooks/useFetch';
import { Region } from '../../../types/option';
import { Collection } from '../../../utils/collection';
const GetRegions = () => {
  const result = useFetch<Region[]>("/origins");
  const collectionRegions = new Collection<string,string>()
  if (result.status === FetchStatus.Success) {
    result.data.forEach((region)=>{
      collectionRegions.set(region.id.toString(), region.name)
    })
  }
  return { collectionRegions };
};

export default GetRegions;
