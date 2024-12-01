import useFetch from "../../../hooks/useFetch";

type Commune = {
  id: number;
  name: string;
};

const CommunesOrigin = (provinceId: number | null) => {
  const { data: communes } = useFetch<Commune[]>(
    `http://localhost:3000/api/v1/origins/${provinceId}/communes`
  );

  return communes || [];
};

export default CommunesOrigin;
