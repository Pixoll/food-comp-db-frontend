import useFetch from "../../../hooks/useFetch"

export type LangualCode = {
    id: number;
    code: string;
    descriptor: string;
};

const useLangualCodes = () => {
  return useFetch<LangualCode[]>("/langual_codes")
}
export default useLangualCodes;