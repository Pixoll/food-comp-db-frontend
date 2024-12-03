import useFetch from "../../../hooks/useFetch";

type Region = {
  id: number;
  name: string;
  number: number;
  place: number;
};

const RegionsOrigin = () => {
  const { data: regions } = useFetch<Region[]>(
    `http://localhost:3000/api/v1/origins/`
  );

  const transformedRegions = regions?.map((region) => ({ id: region.id, name: region.name }));

  return transformedRegions;
};

export default RegionsOrigin;
