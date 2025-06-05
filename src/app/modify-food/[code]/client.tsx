"use client";

import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
    FetchStatus,
    Region,
    useFetch,
    useForm,
    useGroups,
    useOrigins,
    useScientificNames,
    useSubspecies,
    useTypes
} from "@/hooks";
import { LangualCode, NutrientMeasurement, NutrientsValue, Origin, SingleFoodResult } from "@/types/SingleFoodResult";
import { Collection } from "@/utils/collection";
import { FormEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TextField from "../../components/Fields/TextField";
import Tab from "../../components/Tabs/Tab";
import TabItem from "../../components/Tabs/TabItem";
import Origins from "../components/add-remove-origins/Origins";
import ModifyCompositionDropdown from "../components/ModifyCompositionDropdown";

type FoodForm = {
    commonName: Record<"es" | "en" | "pt", string | undefined>;
    ingredients: Record<"es" | "en" | "pt", string | undefined>;
    scientificNameId?: number;
    subspeciesId?: number;
    groupId?: number;
    typeId?: number;
    strain?: string;
    brand?: string;
    observation?: string;
    originIds?: number[];
    nutrientMeasurements: nutrientMeasurementForm[]
    langualCodes?: number[];
}
type nutrientMeasurementForm = {
    nutrientId: number
    average?: number;
    deviation?: number;
    min?: number;
    max?: number;
    sampleSize?: number;
    dataType: "analytic" | "calculated" | "assumed" | "borrowed";
    referencesCodes?: number[];
}

function normalizeStringValue(value: string | undefined): string | undefined {
    return value?.trim() === "" ? undefined : value?.trim();
}

function stringToNumberOrUndefined(value: string | undefined): number | undefined {
    if (!value?.trim()) return undefined;

    const parsedNumber = +value.replace(",", ".");
    return isNaN(parsedNumber) ? undefined : parsedNumber;
}

function normalizeNutrientMeasurement(nutrient: NutrientMeasurement): nutrientMeasurementForm {
    return {
        nutrientId: nutrient.nutrientId,
        average: stringToNumberOrUndefined(nutrient.average?.toString()),
        deviation: stringToNumberOrUndefined(nutrient.deviation?.toString()),
        min: stringToNumberOrUndefined(nutrient.min?.toString()),
        max: stringToNumberOrUndefined(nutrient.max?.toString()),
        sampleSize: stringToNumberOrUndefined(nutrient.sampleSize?.toString()),
        dataType: nutrient.dataType,
        referencesCodes: nutrient.referenceCodes,
    };
}

function getUniqueIds(items: { id: number }[] | undefined): number[] | undefined {
    if (!items || items.length === 0) return undefined;

    return [...new Set(items.map(item => item.id))];
}

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
            ...langualCode.children.map(child => child.id)
        ])
    )];
}

function normalizeAllNutrientMeasurements(nutrientValues: NutrientsValue): nutrientMeasurementForm[] {
    return [
        ...nutrientValues.energy.map(normalizeNutrientMeasurement),

        ...nutrientValues.macronutrients.flatMap(mainNutrient => [
            normalizeNutrientMeasurement(mainNutrient),
            ...(mainNutrient.components
                ? mainNutrient.components.map(normalizeNutrientMeasurement)
                : [])
        ]),
        ...nutrientValues.micronutrients.minerals.map(normalizeNutrientMeasurement),
        ...nutrientValues.micronutrients.vitamins.map(normalizeNutrientMeasurement)
    ];
}

function normalizeFoodFormForApi(
    data: SingleFoodResult,
    collections: {
        scientificNames: { idToName: Collection<string, string>, nameToId: Collection<string, number> }
        groups: { idToName: Collection<string, string>, codeToId: Collection<string, number> }
        types: { idToName: Collection<string, string>, codeToId: Collection<string, number> }
        subspecies: Collection<string, number>;
        regions: Collection<number, Region>
    }
): FoodForm {
    return {
        commonName: data.commonName as Record<"es" | "en" | "pt", string | undefined>,
        ingredients: data.ingredients as Record<"es" | "en" | "pt", string | undefined>,
        scientificNameId: collections.scientificNames.nameToId.get(data.scientificName || ""),
        subspeciesId: collections.subspecies.get(data.subspecies || ""),
        groupId: collections.groups.codeToId.get(data.group.code || ""),
        typeId: collections.types.codeToId.get(data.type.code || ""),
        strain: normalizeStringValue(data.strain),
        brand: normalizeStringValue(data.brand),
        observation: normalizeStringValue(data.observation),
        originIds: getUniqueRegionIds(data.origins, [...collections.regions.keys()] as number[]),
        langualCodes: getUniqueLangualCodeIds(data.langualCodes),
        nutrientMeasurements: normalizeAllNutrientMeasurements(data.nutrientMeasurements)
    };
}

function getAllTypeData(code: string) {
    const result = useFetch<SingleFoodResult>(`/foods/${code}`);
    const data = result.status === FetchStatus.Success ? result.data : null;
    const groups = useGroups();
    const types = useTypes();
    const scientificNames = useScientificNames();
    const subspecies = useSubspecies();
    const { regions, provinces, communes, locations } = useOrigins();
    return { data, groups, types, scientificNames, subspecies, regions, provinces, communes, locations };
}

export default function ModifyFoodPage({ code }: { code: string }) {
    const { t } = useTranslation();
    const { state } = useAuth();
    const { addToast } = useToast();

    const token = state.token;

    const {
        data,
        groups,
        types,
        scientificNames,
        subspecies,
        regions,
        provinces,
        communes,
        locations
    } = getAllTypeData(code);

    const collectionsForNormalized = {
        scientificNames: {
            idToName: scientificNames.idToName,
            nameToId: scientificNames.nameToId
        },
        groups: {
            idToName: groups.idToName,
            codeToId: groups.codeToId
        },
        types: {
            idToName: types.idToName,
            codeToId: types.codeToId
        },
        subspecies: subspecies.nameToId,
        regions: regions
    };

    const { formState, setFormState, onInputChange } = useForm<FoodForm>(
        data ? normalizeFoodFormForApi(data, collectionsForNormalized) : {
            commonName: { es: "", en: "", pt: "" },
            ingredients: { es: "", en: "", pt: "" },
            nutrientMeasurements: []
        }
    );

    const handleScientificName = async () => {
        const scientificNameId = formState.scientificNameId;

        const payload = {
            scientificNameId: scientificNameId,
            scientificName: !scientificNameId
                ? normalizeStringValue(scientificNames.idToName.get(formState.scientificNameId?.toString() ?? ""))
                : undefined,
        };

        if (!payload.scientificNameId && payload.scientificName) {
            const name = payload.scientificName;

            try {
                const result = await api.createScientificNameV1({
                    auth: state.token ?? "",
                    body: {
                        name,
                    },
                });

                if (result.error) {
                    console.error("Error al actualizar:", result.error);
                    return;
                }

                scientificNames.forceReload();
                setFormState((prev) => ({
                    ...prev,
                    scientificNameId: scientificNames.nameToId.get(name)
                }));
            } catch (error) {
                console.error("Error al actualizar:", error);
            }
        } else if (payload.scientificNameId && payload.scientificName) {
            setFormState((prev) => ({
                ...prev,
                scientificNameId: payload.scientificNameId
            }));
        }
    };

    const handleSubspecies = async () => {
        const subspeciesId = formState.subspeciesId;

        const payload = {
            subspeciesId: subspeciesId,
            subspecies: !subspeciesId
                ? normalizeStringValue(subspecies.idToName.get(formState.subspeciesId?.toString() ?? ""))
                : undefined,
        };

        if (!payload.subspeciesId && payload.subspecies) {
            const name = payload.subspecies;

            try {
                const result = await api.createSubspeciesV1({
                    auth: state.token ?? "",
                    body: {
                        name,
                    },
                });

                if (result.error) {
                    console.error("Error al actualizar:", result.error);
                    return;
                }

                subspecies.forceReload();
                setFormState((prev) => ({
                    ...prev,
                    subspeciesId: subspecies.nameToId.get(name)
                }));
            } catch (error) {
                console.error("Error al actualizar:", error);
            }
        }
    };

    useEffect(() => {
        if (data) {
            const updatedDataFomr = normalizeFoodFormForApi(data, collectionsForNormalized);
            setFormState(updatedDataFomr);
        }
        // eslint-disable-next-line
    }, [data]);

    if (!data) {
        return <h2>{t("DetailFood.loading")}</h2>;
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
    const handleSubmit2 = async (e: FormEvent) => {
        e.preventDefault();
        console.log(formState);
        addToast({
            message: "se agrego con exito",
            title: "Modify",
            type: "Success",
            position: "top-end"
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const payload = normalizeFoodFormForApi(data, collectionsForNormalized);

        try {
            const result = await api.updateFoodV1({
                path: {
                    code,
                },
                auth: token ?? "",
                body: payload,
            });

            if (result.error) {
                /*addToast({
                 type: "Danger",
                 message:
                 error.response?.data?.message ||
                 error.message ||
                 "A ocurrido un error",
                 title: "Error",
                 position: "middle-center",
                 duration: 5000,
                 });*/
                console.error("Error en la solicitud:", result.error);
                return;
            }

            /*addToast({
             type: "Success",
             message:
             response.data.message ||
             "Los cambios fueron realizados exitosamente",
             title: "Éxito",
             position: "middle-center",
             duration: 3000,
             });*/
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    return (
        <div className="w-full h-full bg-[#effce8] rounded-t-[2px]">
            <h2 className="text-center">{"Modificar alimento"} {code}</h2>
            <Tab defaultTab={0}>
                <TabItem label={"Modificar información general"}>
                    <div
                        className="flex flex-col mt-[10px] border-[1px] rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] bg-[white]"
                    >
                        <div>
                            {Object.entries(formState.commonName).map(([lang, value]) => (
                                <TextField
                                    key={`commonName.${lang}`}
                                    label={`Nombre común (${lang.toUpperCase()})`}
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
                                    label={`Ingrediente(${lang.toUpperCase()})`}
                                    name={`ingredients.${lang}`}
                                    value={value || ""}
                                    onChange={onInputChange}
                                    fullWidth
                                />
                            ))}
                        </div>
                        <TextField
                            label="Observación"
                            name="observation"
                            value={formState.observation || ""}
                            onChange={onInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Marca"
                            name="brand"
                            value={formState.brand || ""}
                            onChange={onInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Marca"
                            name="strain"
                            value={formState.strain || ""}
                            onChange={onInputChange}
                            fullWidth
                        />
                    </div>
                </TabItem>
                <TabItem label={"Modificar origines"}>
                    <div
                        className="flex flex-col mt-[10px] border-[1px] rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] bg-[white] p-[16px]"
                    >
                        <h3 className="text-[18px] font-[600] mb-[16px]">Origines</h3>
                        <Origins
                            originsForm={data.origins || []}
                            data={{
                                regions: regions,
                                provinces: provinces,
                                communes: communes,
                                locations: locations
                            }}
                            updateOrigins={(updatedOrigins) => {
                                setFormState(prev => ({
                                    ...prev,
                                    originIds: [...new Set(updatedOrigins?.map(origin => origin.id))]
                                }));
                            }}
                        />
                    </div>
                </TabItem>
                <TabItem label={"Modificar información nutricional"}>
                    <div
                        className="flex flex-col mt-[10px] border-[1px] rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] bg-[white] p-[16px]"
                    >
                        <h3 className="text-[18px] font-[600] mb-[16px]">Información nutricional</h3>

                        <ModifyCompositionDropdown
                            nutrientData={data.nutrientMeasurements ?? []}
                            formState={formState}
                            onUpdateFormState={setFormState}
                            isEditable={true}
                        />
                    </div>
                </TabItem>
                <TabItem label={"Agregar y/o quitar referencias"}>

                </TabItem>
            </Tab>
            <button onClick={handleSubmit2}>Guardar y enviar</button>
        </div>
    );
}
