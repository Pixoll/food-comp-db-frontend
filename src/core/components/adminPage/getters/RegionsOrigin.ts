import useFetch from "../../../hooks/useFetch";

type Region = {
    id: number;
    name: string;
    number: number;
    place: number;
};

const RegionsOrigin = () => {
    const { data: regions } = useFetch<Region[]>(
        `http://localhost:3000/api/v1/origins/regions`
    );

    return regions; 
};

export default RegionsOrigin;
