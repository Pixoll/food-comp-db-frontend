import type {
    Food,
    FoodUpdateDto,
    NewFoodDto,
    NewNutrientMeasurementDto,
    NutrientMeasurementUpdateDto,
} from "@/api";
import type { I18nObject } from "@/context/I18nContext";
import { indexMeasurements } from "@/utils/nutrients";

/** Valores de una medición tal como se editan (texto, para permitir campos vacíos y coma decimal). */
export type MeasurementDraft = {
    average: string;
    deviation: string;
    referenceCodes: number[];
};

export type FoodFormValues = {
    code: string;
    foodName: string;
    commonName: string;
    groupId?: number;
    scientificNameId?: number;
    portionQuantity: string;
    observation: string;
    others: string;
    /** Mediciones por id de nutriente. Solo se envían las que tienen promedio. */
    measurements: Record<number, MeasurementDraft>;
    /** Referencias elegidas a nivel de alimento; se copian a las mediciones con "aplicar". */
    foodReferences: number[];
};

export type FoodFormMode = "create" | "edit";

export type FoodFormErrors = {
    code?: string;
    name?: string;
    groupId?: string;
    portionQuantity?: string;
    foodName?: string;
    commonName?: string;
    observation?: string;
    others?: string;
    measurementsGeneral?: string;
    measurements: Record<number, { average?: string; deviation?: string }>;
};

export const LIMITS = {
    name: 255,
    observation: 200,
    others: 1000,
} as const;

const CODE_PATTERN = /^[a-z0-9]{1,8}$/i;

export function emptyFormValues(): FoodFormValues {
    return {
        code: "",
        foodName: "",
        commonName: "",
        portionQuantity: "",
        observation: "",
        others: "",
        measurements: {},
        foodReferences: [],
    };
}

export function formValuesFromFood(
    code: string,
    food: Food,
    groupId: number | undefined,
    scientificNameId: number | undefined
): FoodFormValues {
    const measurements: Record<number, MeasurementDraft> = {};

    for (const [nutrientId, measurement] of indexMeasurements(food.nutrientMeasurements)) {
        measurements[nutrientId] = {
            average: measurement.average.toString(),
            deviation: measurement.deviation?.toString() ?? "",
            referenceCodes: [...measurement.referenceCodes ?? []],
        };
    }

    return {
        code,
        foodName: food.foodName ?? "",
        commonName: food.commonName ?? "",
        groupId,
        scientificNameId,
        portionQuantity: food.portionQuantity?.toString() ?? "",
        observation: food.observation ?? "",
        others: food.others ?? "",
        measurements,
        foodReferences: food.references.map(r => r.code),
    };
}

/** Convierte el texto de un campo numérico. `undefined` si está vacío, `NaN` si no es válido. */
export function parseDecimal(text: string): number | undefined {
    const trimmed = text.trim();
    if (trimmed === "") return undefined;
    const value = Number(trimmed.replace(",", "."));
    return Number.isFinite(value) ? value : Number.NaN;
}

function isFilled(draft: MeasurementDraft | undefined): draft is MeasurementDraft {
    return !!draft && (draft.average.trim() !== "" || draft.deviation.trim() !== "");
}

export function filledMeasurementIds(values: FoodFormValues): number[] {
    return Object.entries(values.measurements)
        .filter(([, draft]) => isFilled(draft))
        .map(([id]) => +id);
}

export function validateFoodForm(
    values: FoodFormValues,
    mode: FoodFormMode,
    original: FoodFormValues | null,
    t: I18nObject
): FoodFormErrors {
    const f = t.foodForm;
    const errors: FoodFormErrors = { measurements: {} };

    if (mode === "create") {
        if (!values.code.trim()) {
            errors.code = f.codeRequired;
        } else if (!CODE_PATTERN.test(values.code.trim())) {
            errors.code = f.codeInvalid;
        }
    }

    if (!values.foodName.trim() && !values.commonName.trim()) {
        errors.name = f.nameRequired;
    }

    if (values.foodName.trim().length > LIMITS.name) errors.foodName = f.tooLong(LIMITS.name);
    if (values.commonName.trim().length > LIMITS.name) errors.commonName = f.tooLong(LIMITS.name);
    if (values.observation.trim().length > LIMITS.observation) errors.observation = f.tooLong(LIMITS.observation);
    if (values.others.trim().length > LIMITS.others) errors.others = f.tooLong(LIMITS.others);

    if (!values.groupId) {
        errors.groupId = f.groupRequired;
    }

    const portion = parseDecimal(values.portionQuantity);
    if (portion !== undefined && (!Number.isInteger(portion) || portion < 1)) {
        errors.portionQuantity = f.portionInvalid;
    }

    const ids = new Set([
        ...Object.keys(values.measurements).map(Number),
        ...Object.keys(original?.measurements ?? {}).map(Number),
    ]);

    let filled = 0;

    for (const id of ids) {
        const draft = values.measurements[id] ?? { average: "", deviation: "", referenceCodes: [] };
        const saved = original?.measurements[id];
        const average = parseDecimal(draft.average);
        const deviation = parseDecimal(draft.deviation);
        const rowErrors: { average?: string; deviation?: string } = {};

        if (average === undefined) {
            if (saved) {
                rowErrors.average = f.savedCannotBeEmpty;
            } else if (deviation !== undefined) {
                rowErrors.average = f.deviationWithoutAverage;
            }
        } else if (Number.isNaN(average) || average < 0) {
            rowErrors.average = f.invalidNumber;
        }

        if (deviation !== undefined && (Number.isNaN(deviation) || deviation < 0)) {
            rowErrors.deviation = f.invalidNumber;
        }

        if (average !== undefined) filled++;
        if (rowErrors.average || rowErrors.deviation) errors.measurements[id] = rowErrors;
    }

    if (mode === "create" && filled === 0) {
        errors.measurementsGeneral = f.measurementsRequired;
    }

    return errors;
}

export function countErrors(errors: FoodFormErrors): number {
    const { measurements, ...rest } = errors;
    return Object.values(rest).filter(Boolean).length + Object.keys(measurements).length;
}

function optionalText(text: string): string | undefined {
    return text.trim() || undefined;
}

function sameCodes(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    const set = new Set(a);
    return b.every(code => set.has(code));
}

export function buildCreatePayload(values: FoodFormValues): NewFoodDto {
    const nutrientMeasurements: NewNutrientMeasurementDto[] = [];

    for (const id of filledMeasurementIds(values)) {
        const draft = values.measurements[id];
        const average = parseDecimal(draft.average);
        if (average === undefined) continue;
        const deviation = parseDecimal(draft.deviation);

        nutrientMeasurements.push({
            nutrientId: id,
            average,
            ...deviation !== undefined && { deviation },
            ...draft.referenceCodes.length > 0 && { referenceCodes: draft.referenceCodes },
        });
    }

    const portion = parseDecimal(values.portionQuantity);

    return {
        foodName: optionalText(values.foodName),
        commonName: optionalText(values.commonName),
        groupId: values.groupId!,
        scientificNameId: values.scientificNameId,
        observation: optionalText(values.observation),
        others: optionalText(values.others),
        portionQuantity: portion,
        nutrientMeasurements,
    };
}

/**
 * Arma el PATCH solo con lo que cambió. Los campos opcionales que se vacían se envían como `null`
 * (el backend los borra); las mediciones nuevas van completas y las existentes solo con lo modificado.
 */
export function buildUpdatePayload(values: FoodFormValues, original: FoodFormValues): FoodUpdateDto {
    const payload: FoodUpdateDto = {};

    const textFields = ["foodName", "commonName", "observation", "others"] as const;
    for (const field of textFields) {
        if (values[field].trim() !== original[field].trim()) {
            payload[field] = values[field].trim() || null;
        }
    }

    if (values.groupId !== original.groupId && values.groupId) {
        payload.groupId = values.groupId;
    }

    if (values.scientificNameId !== original.scientificNameId) {
        payload.scientificNameId = values.scientificNameId ?? null;
    }

    if (values.portionQuantity.trim() !== original.portionQuantity.trim()) {
        payload.portionQuantity = parseDecimal(values.portionQuantity) ?? null;
    }

    const measurementUpdates: NutrientMeasurementUpdateDto[] = [];

    for (const [key, draft] of Object.entries(values.measurements)) {
        const id = +key;
        const average = parseDecimal(draft.average);
        const deviation = parseDecimal(draft.deviation);
        const saved = original.measurements[id];

        if (!saved) {
            if (average === undefined) continue;
            measurementUpdates.push({
                nutrientId: id,
                average,
                ...deviation !== undefined && { deviation },
                ...draft.referenceCodes.length > 0 && { referenceCodes: draft.referenceCodes },
            });
            continue;
        }

        const update: NutrientMeasurementUpdateDto = { nutrientId: id };

        if (average !== undefined && average !== parseDecimal(saved.average)) {
            update.average = average;
        }

        if (deviation !== parseDecimal(saved.deviation)) {
            update.deviation = deviation ?? null;
        }

        if (!sameCodes(draft.referenceCodes, saved.referenceCodes)) {
            update.referenceCodes = draft.referenceCodes;
        }

        if (Object.keys(update).length > 1) {
            measurementUpdates.push(update);
        }
    }

    if (measurementUpdates.length > 0) {
        payload.nutrientMeasurements = measurementUpdates;
    }

    return payload;
}

/** Cantidad de cambios respecto a lo guardado (campos generales + mediciones distintas). */
export function countChanges(values: FoodFormValues, original: FoodFormValues): number {
    const payload = buildUpdatePayload(values, original);
    const { nutrientMeasurements = [], ...rest } = payload;
    return Object.keys(rest).length + nutrientMeasurements.length;
}
