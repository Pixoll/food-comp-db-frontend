import useFetch from "../../../hooks/useFetch";

type Province = {
    id: number;
    name: string;
};

const ProvincesOrigin = (regionId: number) => {
    const { data: provinces } = useFetch<Province[]>(
        `http://localhost:3000/api/v1/origins/${regionId}/provinces`
    );

    return provinces; 
};

export default ProvincesOrigin;
