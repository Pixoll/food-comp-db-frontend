export type Language = {
  id: number;
  code: string;
  name: string;
};

export type Group = {
  id: number;
  code: string;
  name: string;
};

export type Region = {
  id: number;
  name: string;
  number: number;
  place: number;
};

export type TypeFood = {
  id: number;
  code: string;
  name: string;
};

export type FoodResult = {
  code: string;
  commonName: {
    es: string | null;
    en: string | null;
    pt: string | null;
  }
  scientificName?: string;
  subspecies?: string;
};

export type GroupedNutrients = {
  macronutrients: MacroNutrient[];
  micronutrients: {
    vitamins: AnyNutrient[];
    minerals: AnyNutrient[];
  };
};

export type MacroNutrient = AnyNutrient & {
  isEnergy: boolean;
  components?: AnyNutrient[];
};

export type AnyNutrient = Omit<Nutrient, "measurement_unit" | "note" | "type"> & {
  measurementUnit: string;
  note?: string;
};

export type Nutrient = {

  id: number;
  type: "energy" | "macronutrient" | "component" | "micronutrient";
  name: string;
  measurementUnit: string;
  standardized: boolean;
  note?: string | null;
};
  
