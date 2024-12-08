import useFetch from "../../../hooks/useFetch"

export type GroupedNutrients = {
  macronutrients: MacroNutrient[];
  micronutrients: {
    vitamins: AnyNutrient[];
    minerals: AnyNutrient[];
  };
};

export type MacroNutrient = AnyNutrient & {
  isEnergy?: boolean;
  components?: AnyNutrient[];
};

export type AnyNutrient = {
  id: number;
  name: string;
  measurementUnit: string;
  standardized: boolean;
  note?: string;
};

export const useNutrients = () => {
  return useFetch<GroupedNutrients>("/nutrients");
};

export default useNutrients;
