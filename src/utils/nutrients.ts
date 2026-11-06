import type {
    GroupedNutrientMeasurements,
    GroupedNutrients,
    Macronutrient,
    MacronutrientMeasurement,
    Nutrient,
    NutrientMeasurement,
} from "@/api";

/**
 * Categorías en las que el backend agrupa nutrientes y mediciones.
 * Los macronutrientes forman un árbol (components), el resto son listas planas.
 */
export type NutrientCategory = "energy" | "macronutrients" | "vitamins" | "minerals";

export const nutrientCategories: readonly NutrientCategory[] = ["energy", "macronutrients", "vitamins", "minerals"];

/** Un nodo de árbol: el nutriente o medición con sus componentes (si tiene). */
export type TreeNode<T> = T & { components?: Array<TreeNode<T>> };

export type CatalogNutrient = Nutrient & {
    category: NutrientCategory;
    depth: number;
    parentId?: number;
    childIds: number[];
};

/** Recorre el catálogo de nutrientes en orden de visualización (padre antes que sus componentes). */
export function flattenCatalog(grouped: GroupedNutrients): CatalogNutrient[] {
    const result: CatalogNutrient[] = [];

    const visit = (node: TreeNode<Nutrient>, category: NutrientCategory, depth: number, parentId?: number): void => {
        const { components = [], ...nutrient } = node as Macronutrient;
        result.push({
            ...nutrient,
            category,
            depth,
            parentId,
            childIds: components.map(c => c.id),
        });
        for (const child of components) {
            visit(child, category, depth + 1, nutrient.id);
        }
    };

    for (const category of nutrientCategories) {
        for (const node of catalogSection(grouped, category)) {
            visit(node, category, 0);
        }
    }

    return result;
}

export function catalogSection(grouped: GroupedNutrients, category: NutrientCategory): Array<TreeNode<Nutrient>> {
    switch (category) {
        case "energy":
            return grouped.energy;
        case "macronutrients":
            return grouped.macronutrients;
        case "vitamins":
            return grouped.micronutrients.vitamins;
        case "minerals":
            return grouped.micronutrients.minerals;
    }
}

export function measurementSection(
    grouped: GroupedNutrientMeasurements,
    category: NutrientCategory
): Array<TreeNode<NutrientMeasurement>> {
    switch (category) {
        case "energy":
            return grouped.energy;
        case "macronutrients":
            return grouped.macronutrients;
        case "vitamins":
            return grouped.micronutrients.vitamins;
        case "minerals":
            return grouped.micronutrients.minerals;
    }
}

/** Todas las mediciones de un alimento indexadas por id de nutriente, incluidas las anidadas. */
export function indexMeasurements(grouped: GroupedNutrientMeasurements): Map<number, NutrientMeasurement> {
    const index = new Map<number, NutrientMeasurement>();

    const visit = (node: TreeNode<NutrientMeasurement>): void => {
        index.set(node.nutrientId, node);
        for (const child of (node as MacronutrientMeasurement).components ?? []) {
            visit(child);
        }
    };

    for (const category of nutrientCategories) {
        measurementSection(grouped, category).forEach(visit);
    }

    return index;
}

export function countMeasurements(grouped: GroupedNutrientMeasurements): number {
    return indexMeasurements(grouped).size;
}

/** Valor por porción: las mediciones vienen expresadas por cada 100 g. */
export function scaleValue(value: number, grams: number): number {
    return value * grams / 100;
}

const formatters = new Map<string, Intl.NumberFormat>();

export function formatNumber(value: number | undefined | null, language: string, maxDecimals = 3): string {
    if (value === undefined || value === null || Number.isNaN(value)) {
        return "—";
    }

    const key = `${language}-${maxDecimals}`;
    let formatter = formatters.get(key);

    if (!formatter) {
        formatter = new Intl.NumberFormat(language === "es" ? "es-CL" : "en-US", {
            maximumFractionDigits: maxDecimals,
        });
        formatters.set(key, formatter);
    }

    return formatter.format(value);
}

/** Nombre a mostrar de un alimento: nombre del alimento, si no el nombre común, si no el código. */
export function foodDisplayName(food: { foodName?: string; commonName?: string }, fallback = ""): string {
    return food.foodName?.trim() || food.commonName?.trim() || fallback;
}
