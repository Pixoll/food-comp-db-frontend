"use client";

import { Collection } from "@/utils/collection";
import { useState } from "react";
import { FetchStatus, useApi } from "./useApi";

export type MacroNutrient = AnyNutrient & {
    components?: AnyNutrient[];
};

export type AnyNutrient = {
    id: number;
    name: string;
    measurementUnit: string;
    standardized: boolean;
    note?: string;
};

export function useNutrients() {
    const result = useApi([], (api) => api.getNutrients());
    const [nutrients, setNutrients] = useState(new Collection<string, AnyNutrient>());
    const [energy, setEnergy] = useState(new Collection<string, AnyNutrient>());
    const [macronutrients, setMacronutrients] = useState(new Collection<string, MacroNutrient>());
    const [vitamins, setVitamins] = useState(new Collection<string, AnyNutrient>());
    const [minerals, setMinerals] = useState(new Collection<string, AnyNutrient>());

    if (result.status === FetchStatus.Success
        && nutrients.size === 0
        && energy.size === 0
        && macronutrients.size === 0
        && vitamins.size === 0
        && minerals.size === 0
    ) {
        result.data.energy.forEach((energyN) => {
            energy.set(energyN.id.toString(), energyN);
            nutrients.set(energyN.id.toString(), energyN);
        });

        result.data.macronutrients.forEach((macro) => {
            nutrients.set(macro.id.toString(), macro);
            macronutrients.set(macro.id.toString(), macro);
            if (macro.components) {
                macro.components.forEach((component) => nutrients.set(component.id.toString(), component));
            }
        });

        result.data.micronutrients.vitamins.forEach((vitamin) => {
            vitamins.set(vitamin.id.toString(), vitamin);
            nutrients.set(vitamin.id.toString(), vitamin);
        });

        result.data.micronutrients.minerals.forEach((mineral) => {
            minerals.set(mineral.id.toString(), mineral);
            nutrients.set(mineral.id.toString(), mineral);
        });

        setNutrients(nutrients.clone());
        setEnergy(energy.clone());
        setMacronutrients(macronutrients.clone());
        setVitamins(vitamins.clone());
        setMinerals(minerals.clone());
    }

    return { nutrients, energy, macronutrients, vitamins, minerals };
}
