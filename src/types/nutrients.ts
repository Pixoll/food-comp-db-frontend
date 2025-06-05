export type NutrientSummary = {
  id: number;
  name: string;
  measurementUnit: string;
};

export const getNutrientNameById = (
  id: number,
  nameAndIdNutrients: NutrientSummary[]
): string => {
  const nutrient = nameAndIdNutrients.find((nutrient) => nutrient.id === id);
  return `${nutrient?.name} (${nutrient?.measurementUnit})`;
};

export type NutrientMeasurementForm = {
  nutrientId: number;
  average?: number;
  deviation?: number;
  min?: number;
  max?: number;
  sampleSize?: number;
  dataType?: "analytic" | "calculated" | "assumed" | "borrowed";
  referenceCodes: number[];
};

export type NutrientMeasurementWithComponentsForm = NutrientMeasurementForm & {
  components: NutrientMeasurementForm[];
};
