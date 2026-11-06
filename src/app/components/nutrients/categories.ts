import type { I18nObject } from "@/context/I18nContext";
import type { NutrientCategory } from "@/utils/nutrients";
import type { BadgeTone } from "../ui/Badge";

/** Un color de acento por categoría de nutrientes (DESIGN.md: nunca mezclar acentos en un componente). */
export const categoryTone: Record<NutrientCategory, BadgeTone> = {
    energy: "amber",
    macronutrients: "brand",
    vitamins: "sky",
    minerals: "magenta",
};

/** Clases del punto de color que acompaña el nombre de la categoría. */
export const categoryDot: Record<NutrientCategory, string> = {
    energy: "bg-amber",
    macronutrients: "bg-brand",
    vitamins: "bg-sky",
    minerals: "bg-magenta",
};

export function categoryLabel(t: I18nObject, category: NutrientCategory): string {
    return t.nutrientsDropdown[category];
}
