interface NutrientComponent {
    type: string;
    amount: number | null;
}

export interface MainNutrient {
    nutrient: string;
    amount: number;
    deviation: null | number;
    min: null | number;
    max: null | number;
    type: string;
    components?: NutrientComponent[];
}

export interface Energy {
    unit: string;
    amount: number;
    deviation: null | number;
    min: null | number;
    max: null | number;
    type: string;
}

export interface Vitamin {
    vitamin: string;
    unit: string;
    amount: number;
    deviation: null | number;
    min: null | number;
    max: null | number;
    type: string;
}

export interface Mineral {
    mineral: string;
    unit: string;
    amount: number;
    deviation: null | number;
    min: null | number;
    max: null | number;
    type: string;
}

export interface Micronutrients {
    vitamins: Vitamin[];
    minerals: Mineral[];
}

export default interface nutritionalValue {
    energy: Energy[];
    main_nutrients: MainNutrient[];
    micronutrients: Micronutrients;
}
