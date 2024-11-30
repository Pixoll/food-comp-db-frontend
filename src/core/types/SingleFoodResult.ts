type BigIntString = `${number}`;

export type SingleFoodResult = {
    id: BigIntString;
    code: string;
    strain?: string;
    brand?: string;
    observation?: string;
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
    commonName: Partial<Record<"es" | "en" | "pt", string>>;
    ingredients: Partial<Record<"es" | "en" | "pt", string>>;
    nutrientMeasurements: {
        energy: NutrientMeasurement[];
        mainNutrients: NutrientMeasurementWithComponents[];
        micronutrients: {
            vitamins: NutrientMeasurement[];
            minerals: NutrientMeasurement[];
        };
    };
    langualCodes: LangualCode[];
    references: Reference[];
};
export type NutrientsValue = {
    energy: NutrientMeasurement[];
    mainNutrients: NutrientMeasurementWithComponents[];
    micronutrients: {
        vitamins: NutrientMeasurement[];
        minerals: NutrientMeasurement[];
    };
};
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
    note?: string;
    referenceCodes?: number[];
};

export type NutrientMeasurementWithComponents = NutrientMeasurement & {
    components: NutrientMeasurement[];
};

export type LangualCode = {
    descriptor: string;
    children: Array<{
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