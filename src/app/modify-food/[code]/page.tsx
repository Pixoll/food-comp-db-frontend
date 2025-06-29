"use client";

import { type Food, type Language, type NutrientMeasurementUpdateDto } from "@/api";
import { useTranslation } from "@/context/I18nContext";
import { useToast } from "@/context/ToastContext";
import {
    FetchStatus,
    type Region,
    useApi,
    useForm,
    useGroups,
    useOrigins,
    useScientificNames,
    useSubspecies,
    useTypes,
} from "@/hooks";
import type { LangualCode, NutrientMeasurement, NutrientsValue, Origin } from "@/types/SingleFoodResult";
import type { Require } from "@/types/util";
import { Collection } from "@/utils/collection";
import { useParams } from "next/navigation";
import { type FormEvent, type JSX, useEffect } from "react";
import TextField from "../../components/Fields/TextField";
import Tab from "../../components/Tabs/Tab";
import TabItem from "../../components/Tabs/TabItem";
import Origins from "../components/add-remove-origins/Origins";
import ModifyCompositionDropdown from "../components/ModifyCompositionDropdown";

type FoodForm = {
    commonName: Record<Language["code"], string | undefined>;
    ingredients: Record<Language["code"], string | undefined>;
    scientificNameId?: number;
    subspeciesId?: number;
    groupId?: number;
    typeId?: number;
    strain?: string;
    brand?: string;
    observation?: string;
    originIds?: number[];
    nutrientMeasurements: NutrientMeasurementForm[];
    langualCodes?: number[];
};

type NutrientMeasurementForm = Require<NutrientMeasurementUpdateDto, "nutrientId" | "dataType">;

function stringToNumberOrUndefined(value: string | undefined): number | undefined {
    if (!value?.trim()) return undefined;

    const parsedNumber = +value.replace(",", ".");
    return isNaN(parsedNumber) ? undefined : parsedNumber;
}

function normalizeNutrientMeasurement(nutrient: NutrientMeasurement): NutrientMeasurementForm {
    return {
        nutrientId: nutrient.nutrientId,
        average: stringToNumberOrUndefined(nutrient.average?.toString()),
        deviation: stringToNumberOrUndefined(nutrient.deviation?.toString()),
        min: stringToNumberOrUndefined(nutrient.min?.toString()),
        max: stringToNumberOrUndefined(nutrient.max?.toString()),
        sampleSize: stringToNumberOrUndefined(nutrient.sampleSize?.toString()),
        dataType: nutrient.dataType,
        referenceCodes: nutrient.referenceCodes,
    };
}

// function getUniqueIds(items: { id: number }[] | undefined): number[] | undefined {
//     if (!items || items.length === 0) return undefined;
//
//     return [...new Set(items.map(item => item.id))];
// }

function getUniqueRegionIds(origins: Origin[] | undefined, allRegionIds: number[]): number[] | undefined {
    if (!origins || origins.length === 0) return undefined;

    return [...new Set(
        origins.flatMap(origin => origin.id !== 0 ? origin.id : allRegionIds)
    )];
}

function getUniqueLangualCodeIds(langualCodes: LangualCode[] | undefined): number[] | undefined {
    if (!langualCodes || langualCodes.length === 0) return undefined;

    return [...new Set(
        langualCodes.flatMap(langualCode => [
            langualCode.id,
            ...langualCode.children.map(child => child.id),
        ])
    )];
}

function normalizeAllNutrientMeasurements(nutrientValues: NutrientsValue): NutrientMeasurementForm[] {
    return [
        ...nutrientValues.energy.map(normalizeNutrientMeasurement),

        ...nutrientValues.macronutrients.flatMap(mainNutrient => [
            normalizeNutrientMeasurement(mainNutrient),
            ...(mainNutrient.components
                ? mainNutrient.components.map(normalizeNutrientMeasurement)
                : []),
        ]),
        ...nutrientValues.micronutrients.minerals.map(normalizeNutrientMeasurement),
        ...nutrientValues.micronutrients.vitamins.map(normalizeNutrientMeasurement),
    ];
}

function normalizeFoodFormForApi(
    data: Food,
    collections: {
        scientificNames: { idToName: Collection<string, string>; nameToId: Collection<string, number> };
        groups: { idToName: Collection<string, string>; codeToId: Collection<string, number> };
        types: { idToName: Collection<string, string>; codeToId: Collection<string, number> };
        subspecies: Collection<string, number>;
        regions: Collection<number, Region>;
    }
): FoodForm {
    return {
        commonName: data.commonName as Record<Language["code"], string | undefined>,
        ingredients: data.ingredients as Record<Language["code"], string | undefined>,
        scientificNameId: collections.scientificNames.nameToId.get(data.scientificName || ""),
        subspeciesId: collections.subspecies.get(data.subspecies || ""),
        groupId: collections.groups.codeToId.get(data.group.code || ""),
        typeId: collections.types.codeToId.get(data.type.code || ""),
        strain: data.strain?.trim() || undefined,
        brand: data.brand?.trim() || undefined,
        observation: data.observation?.trim() || undefined,
        originIds: getUniqueRegionIds(data.origins, [...collections.regions.keys()] as number[]),
        langualCodes: getUniqueLangualCodeIds(data.langualCodes),
        nutrientMeasurements: normalizeAllNutrientMeasurements(data.nutrientMeasurements),
    };
}

export default function ModifyFoodPage(): JSX.Element {
    const params = useParams();
    const code = params.code as string;
    const { t } = useTranslation();
    const { addToast } = useToast();

    const result = useApi([code], (api, code) => api.getFood({
        path: {
            code,
        },
    }));
    const data = result.status === FetchStatus.Success ? result.data : null;
    const groups = useGroups();
    const types = useTypes();
    const scientificNames = useScientificNames();
    const subspecies = useSubspecies();
    const { regions, provinces, communes, locations } = useOrigins();

    const collectionsForNormalized = {
        scientificNames: {
            idToName: scientificNames.idToName,
            nameToId: scientificNames.nameToId,
        },
        groups: {
            idToName: groups.idToName,
            codeToId: groups.codeToId,
        },
        types: {
            idToName: types.idToName,
            codeToId: types.codeToId,
        },
        subspecies: subspecies.nameToId,
        regions: regions,
    };

    const { formState, setFormState, onInputChange } = useForm<FoodForm>(
        data ? normalizeFoodFormForApi(data, collectionsForNormalized) : {
            commonName: { es: "", en: "", pt: "" },
            ingredients: { es: "", en: "", pt: "" },
            nutrientMeasurements: [],
        }
    );

    // const handleScientificName = async () => {
    //     const scientificNameId = formState.scientificNameId;
    //
    //     const payload = {
    //         scientificNameId: scientificNameId,
    //         scientificName: !scientificNameId
    //             ? normalizeStringValue(scientificNames.idToName.get(formState.scientificNameId?.toString() ?? ""))
    //             : undefined,
    //     };
    //
    //     if (!payload.scientificNameId && payload.scientificName) {
    //         const name = payload.scientificName;
    //
    //         try {
    //             const result = await api.createScientificName({
    //                 body: {
    //                     name,
    //                 },
    //             });
    //
    //             if (result.error) {
    //                 console.error("Error al actualizar:", result.error);
    //                 return;
    //             }
    //
    //             scientificNames.forceReload();
    //             setFormState((prev) => ({
    //                 ...prev,
    //                 scientificNameId: scientificNames.nameToId.get(name)
    //             }));
    //         } catch (error) {
    //             console.error("Error al actualizar:", error);
    //         }
    //     } else if (payload.scientificNameId && payload.scientificName) {
    //         setFormState((prev) => ({
    //             ...prev,
    //             scientificNameId: payload.scientificNameId
    //         }));
    //     }
    // };
    //
    // const handleSubspecies = async () => {
    //     const subspeciesId = formState.subspeciesId;
    //
    //     const payload = {
    //         subspeciesId: subspeciesId,
    //         subspecies: !subspeciesId
    //             ? normalizeStringValue(subspecies.idToName.get(formState.subspeciesId?.toString() ?? ""))
    //             : undefined,
    //     };
    //
    //     if (!payload.subspeciesId && payload.subspecies) {
    //         const name = payload.subspecies;
    //
    //         try {
    //             const result = await api.createSubspecies({
    //                 body: {
    //                     name,
    //                 },
    //             });
    //
    //             if (result.error) {
    //                 console.error("Error al actualizar:", result.error);
    //                 return;
    //             }
    //
    //             subspecies.forceReload();
    //             setFormState((prev) => ({
    //                 ...prev,
    //                 subspeciesId: subspecies.nameToId.get(name)
    //             }));
    //         } catch (error) {
    //             console.error("Error al actualizar:", error);
    //         }
    //     }
    // };

    useEffect(() => {
        if (data) {
            const updatedDataForm = normalizeFoodFormForApi(data, collectionsForNormalized);
            setFormState(updatedDataForm);
        }
        // eslint-disable-next-line
    }, [data]);

    if (!data) {
        return <h2>{t.foodDetail.loading}</h2>;
    }

    /*const handleUpdateNutrients = (updatedData: NutrientsValue) => {
     setNutrientValue(updatedData);
     };

     const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
     const {name, value} = e.target;

     const processValue = (value: string) =>
     value.trim() === "" ? undefined : value;

     if (name.startsWith("commonName.") || name.startsWith("ingredients.")) {
     const [field, lang] = name.split(".");
     setNamesAndIngredients((prevState) => ({
     ...prevState,
     [field]: {
     ...prevState[field as keyof typeof prevState],
     [lang]: processValue(value),
     },
     }));
     } else {
     setGeneralData((prevState) => ({
     ...prevState,
     [name]: processValue(value),
     }));
     }
     };*/

    const handleSubmit2 = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        console.log(formState);
        addToast({
            message: t.modifyFood.successToastMessage,
            title: t.modifyFood.successToastTitle,
            type: "Success",
            position: "top-end",
        });
    };

    // const handleSubmit = async (e: FormEvent) => {
    //     e.preventDefault();
    //     const payload = normalizeFoodFormForApi(data, collectionsForNormalized);
    //
    //     try {
    //         const result = await api.updateFood({
    //             path: {
    //                 code,
    //             },
    //             body: payload,
    //         });
    //
    //         if (result.error) {
    //             /*addToast({
    //              type: "Danger",
    //              message:
    //              error.response?.data?.message ||
    //              error.message ||
    //              "A ocurrido un error",
    //              title: "Error",
    //              position: "middle-center",
    //              duration: 5000,
    //              });*/
    //             console.error("Error en la solicitud:", result.error);
    //             return;
    //         }
    //
    //         /*addToast({
    //          type: "Success",
    //          message:
    //          response.data.message ||
    //          "Los cambios fueron realizados exitosamente",
    //          title: "Éxito",
    //          position: "middle-center",
    //          duration: 3000,
    //          });*/
    //     } catch (error) {
    //         console.error("Error en la solicitud:", error);
    //     }
    // };

    return (
        <div className="w-full h-full bg-[#effce8] rounded-t-[2px]">
            <h2 className="text-center">{t.modifyFood.title} {code}</h2>
            <Tab defaultTab={0}>
                <TabItem label={t.modifyFood.modifyGeneralInfo}>
                    <div
                        className="
                        flex
                        flex-col
                        mt-[10px]
                        border-[1px]
                        rounded-[4px]
                        shadow-[0_4px_10px_rgba(0,0,0,0.2)]
                        bg-[white]
                        "
                    >
                        <div>
                            {Object.entries(formState.commonName).map(([lang, value]) => (
                                <TextField
                                    key={`commonName.${lang}`}
                                    label={`${t.modifyFood.commonName} (${lang.toUpperCase()})`}
                                    name={`commonName.${lang}`}
                                    value={value || ""}
                                    onChange={onInputChange}
                                    fullWidth
                                />
                            ))}
                        </div>
                        <div>
                            {Object.entries(formState.ingredients).map(([lang, value]) => (
                                <TextField
                                    key={`ingredients.${lang}`}
                                    label={`${t.modifyFood.ingredients} (${lang.toUpperCase()})`}
                                    name={`ingredients.${lang}`}
                                    value={value || ""}
                                    onChange={onInputChange}
                                    fullWidth
                                />
                            ))}
                        </div>
                        <TextField
                            label={t.modifyFood.observation}
                            name="observation"
                            value={formState.observation || ""}
                            onChange={onInputChange}
                            fullWidth
                        />
                        <TextField
                            label={t.modifyFood.brand}
                            name="brand"
                            value={formState.brand || ""}
                            onChange={onInputChange}
                            fullWidth
                        />
                        <TextField
                            label={t.modifyFood.strain}
                            name="strain"
                            value={formState.strain || ""}
                            onChange={onInputChange}
                            fullWidth
                        />
                    </div>
                </TabItem>
                <TabItem label={t.modifyFood.modifyOrigins}>
                    <div
                        className="
                        flex
                        flex-col
                        mt-[10px]
                        border-[1px]
                        rounded-[4px]
                        shadow-[0_4px_10px_rgba(0,0,0,0.2)]
                        bg-[white] p-[16px]
                        "
                    >
                        <h3 className="text-[18px] font-[600] mb-[16px]">
                            {t.modifyFood.origins}
                        </h3>
                        <Origins
                            originsForm={data.origins || []}
                            data={{
                                regions: regions,
                                provinces: provinces,
                                communes: communes,
                                locations: locations,
                            }}
                            updateOrigins={(updatedOrigins) => {
                                setFormState(prev => ({
                                    ...prev,
                                    originIds: [...new Set(updatedOrigins?.map(origin => origin.id))],
                                }));
                            }}
                        />
                    </div>
                </TabItem>
                <TabItem label={t.modifyFood.modifyNutrients}>
                    <div
                        className="
                        flex
                        flex-col
                        mt-[10px]
                        border-[1px]
                        rounded-[4px]
                        shadow-[0_4px_10px_rgba(0,0,0,0.2)]
                        bg-[white]
                        p-[16px]
                        "
                    >
                        <h3 className="text-[18px] font-[600] mb-[16px]">
                            {t.modifyFood.nutritionalInfo}
                        </h3>
                        <ModifyCompositionDropdown
                            nutrientData={data.nutrientMeasurements ?? []}
                            formState={formState}
                            onUpdateFormState={setFormState}
                            isEditable={true}
                        />
                    </div>
                </TabItem>
                <TabItem label={t.modifyFood.modifyReferences}>

                </TabItem>
            </Tab>
            <button onClick={handleSubmit2}>{t.modifyFood.saveAndSend}</button>
        </div>
    );
}
