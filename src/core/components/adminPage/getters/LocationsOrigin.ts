import useFetch from "../../../hooks/useFetch";

type Location = {
    id: number;
    name: string;
    type: "city" | "town";
};

const LocationsOrigin = (communeId: number) => {
    const { data: locations } = useFetch<Location[]>(
        `http://localhost:3000/api/v1/origins/${communeId}/locations`
    );
    const transformedLocations = locations?.map((location) =>({id: location.id, name:location.name}))
    return transformedLocations;
};

export default LocationsOrigin;
