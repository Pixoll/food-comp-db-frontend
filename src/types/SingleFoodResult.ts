export type SingleFoodResult = {
  commonName: Partial<Record<"es" | "en" | "pt", string>>;
  ingredients: Partial<Record<"es" | "en" | "pt", string>>;
  group: {
    code: string;
    name: string;
  };
  type: {
    code: string;
    name: string;
  };
  scientificName?: string;
  subspecies?: string;
  strain?: string;
  brand?: string;
  observation?: string;
  nutrientMeasurements: {
    energy: NutrientMeasurement[];
    macronutrients: NutrientMeasurementWithComponents[];
    micronutrients: {
      vitamins: NutrientMeasurement[];
      minerals: NutrientMeasurement[];
    };
  };
  origins?: Origin[];
  langualCodes: LangualCode[];
  references: Reference[];
};

export type NutrientsValue = {
  energy: NutrientMeasurement[];
  macronutrients: NutrientMeasurementWithComponents[];
  micronutrients: {
    vitamins: NutrientMeasurement[];
    minerals: NutrientMeasurement[];
  };
};

export type Origin = {
  id: number;
  name: string;
}

export type NutrientMeasurement = {
  nutrientId: number;
  name: string;
  measurementUnit: string;
  average: number;
  deviation?: number;
  min?: number;
  max?: number;
  sampleSize?: number;
  standardized: boolean;
  dataType: "analytic" | "calculated" | "assumed" | "borrowed";
  note?: string;
  referenceCodes?: number[];
};

export type NutrientMeasurementWithComponents = NutrientMeasurement & {
  components: NutrientMeasurement[];
};

export type LangualCode = {
  id: number;
  code: string;
  descriptor: string;
  children: Array<{
    id: number;
    code: string;
    descriptor: string;
  }>;
};

export type Reference = {
  code: number;
  type: "report" | "thesis" | "article" | "website" | "book";
  title: string;
  authors: string[];
  other?: string;
  refYear?: number;
  cityName?: string;
  pageStart?: number;
  pageEnd?: number;
  volume?: number;
  issue?: number;
  volumeYear?: number;
  journalName?: string;
};
