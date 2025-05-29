'use client'

import {useState, Dispatch, SetStateAction, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    useOrigins,
    useReferences,
    useScientificNames,
    useSubspecies,
    useLanguages,
    useLangualCodes,
    useNutrients,
    useGroups,
    useTypes,
    useForm,
    FormState, AnyNutrient, MacroNutrient
} from "@/hooks";
import {
    NewGeneralData, NewLangualCode,
    NewMacronutrientWithComponent,
    NewNutrients,
    NewReferences,
    PreviewDataForm
} from "@/core/components/adminPage";
import Origins from "./components/add-remove-origins/Origins"

enum TypeOfHandle {
    GENERAL_DATA = 1,
    ENERGY_DATA = 2,
    MAIN_NUTRIENTS_DATA = 3,
    VITAMINS_DATA = 4,
    MINERALS_DATA = 5,
    ORIGINS_DATA = 6,
}


export type NutrientMeasurementForm = {
    nutrientId: number;
    average?: number;
    deviation?: number;
    min?: number;
    max?: number;
    sampleSize?: number;
    dataType?: "analytic" | "calculated" | "assumed" | "borrowed";
    referenceCodes: number[];
};

export type NutrientMeasurementWithComponentsForm = NutrientMeasurementForm & {
    components: NutrientMeasurementForm[];
};

export type FoodForm = {
    code: string;
    strain?: string | null;
    brand?: string | null;
    observation?: string | null;
    scientificNameId?: number;
    subspeciesId?: number;
    groupId?: number;
    typeId?: number;
    commonName: Record<"es", string> &
        Partial<Record<"en" | "pt", string | null>>;
    ingredients: Partial<Record<"es" | "en" | "pt", string | null>>;
    origins: number[];
    langualCodes: number[];
    nutrientsValueForm: {
        energy: NutrientMeasurementForm[];
        mainNutrients: NutrientMeasurementWithComponentsForm[];
        micronutrients: {
            vitamins: NutrientMeasurementForm[];
            minerals: NutrientMeasurementForm[];
        };
    };
};

function selectHandle<T extends object>(
    partialData: Partial<FoodForm>,
    i: TypeOfHandle,
    setFormState: Dispatch<SetStateAction<FormState<T>>>
) {

    switch (i) {
        case TypeOfHandle.GENERAL_DATA:
            return setFormState((prev) => ({
                ...prev,
                ...(partialData.code !== undefined && {code: partialData.code}),
                ...(partialData.strain !== undefined && {strain: partialData.strain}),
                ...(partialData.brand !== undefined && {brand: partialData.brand}),
                ...(partialData.observation !== undefined && {observation: partialData.observation}),
                ...(partialData.scientificNameId !== undefined && {scientificNameId: partialData.scientificNameId}),
                ...(partialData.subspeciesId !== undefined && {subspeciesId: partialData.subspeciesId}),
                ...(partialData.groupId !== undefined && {groupId: partialData.groupId}),
                ...(partialData.typeId !== undefined && {typeId: partialData.typeId}),
                ...(partialData.commonName !== undefined && {commonName: partialData.commonName}),
                ...(partialData.ingredients !== undefined && {ingredients: partialData.ingredients}),
                ...(partialData.origins !== undefined && {origins: partialData.origins}),
                ...(partialData.langualCodes !== undefined && {langualCodes: partialData.langualCodes}),
            }));
        case TypeOfHandle.ENERGY_DATA:
            return setFormState((prev) => {
                if (!partialData.nutrientsValueForm?.energy) {
                    return prev;
                }
                const prevForm = prev as Partial<FoodForm>;
                return {
                    ...prev,
                    nutrientsValueForm: {
                        ...(prevForm.nutrientsValueForm || {}),
                        energy: partialData.nutrientsValueForm.energy
                    }
                };
            });
        case TypeOfHandle.MAIN_NUTRIENTS_DATA:
            return setFormState((prev) =>
                partialData.nutrientsValueForm?.mainNutrients
                    ? {
                        ...prev,
                        nutrientsValueForm: {
                            ...((prev as unknown as Partial<FoodForm>).nutrientsValueForm || {}),
                            mainNutrients: partialData.nutrientsValueForm.mainNutrients.map(nutrient => ({
                                ...nutrient,
                                components: nutrient.components || []
                            }))
                        }
                    }
                    : prev
            );
        case TypeOfHandle.VITAMINS_DATA:
            return setFormState((prev) =>
                partialData.nutrientsValueForm?.micronutrients?.vitamins
                    ? {
                        ...prev,
                        nutrientsValueForm: {
                            ...((prev as Partial<FoodForm>).nutrientsValueForm || {}),
                            micronutrients: {
                                ...((prev as Partial<FoodForm>).nutrientsValueForm?.micronutrients || {}),
                                vitamins: partialData.nutrientsValueForm.micronutrients.vitamins
                            }
                        }
                    }
                    : prev
            );
        case TypeOfHandle.MINERALS_DATA:
            return setFormState((prev) =>
                partialData.nutrientsValueForm?.micronutrients?.minerals
                    ? {
                        ...prev,
                        nutrientsValueForm: {
                            ...((prev as Partial<FoodForm>).nutrientsValueForm || {}),
                            micronutrients: {
                                ...((prev as Partial<FoodForm>).nutrientsValueForm?.micronutrients || {}),
                                vitamins: partialData.nutrientsValueForm.micronutrients.minerals
                            }
                        }
                    }
                    : prev
            );
        case TypeOfHandle.ORIGINS_DATA:
            return setFormState((prev) => ({
                ...prev,
                origins: [...new Set(partialData.origins)]
            }))
        default:
            return setFormState;
    }
}

function getAllData() {
    const {regions, provinces, communes, locations} = useOrigins();
    const {references, cities, authors, journals} = useReferences();
    const {nutrients, energy, macronutrients, vitamins, minerals} = useNutrients();
    const groups = useGroups();
    const types = useTypes();
    const scientificNames = useScientificNames();
    const subspecies = useSubspecies();
    const languages = useLanguages();
    const langualCodes = useLangualCodes();

    return {
        nutrients,
        energy,
        macronutrients,
        vitamins,
        minerals,
        regions,
        provinces,
        communes,
        references,
        cities,
        authors,
        journals,
        locations,
        groups,
        types,
        scientificNames,
        subspecies,
        languages,
        langualCodes
    }
}

export default function AddFoodPage() {

    const {t} = useTranslation();
    const [activeSection, setActiveSection] = useState<number>(1);

    const {
        nutrients,
        energy,
        macronutrients,
        vitamins,
        minerals,
        regions,
        provinces,
        communes,
        references,
        cities,
        authors,
        journals,
        locations,
        groups,
        types,
        scientificNames,
        subspecies,
        languages,
        langualCodes
    } = getAllData()

    const {formState, setFormState, onInputChange} = useForm<FoodForm>({
        code: "",
        commonName: {es: ""},
        ingredients: {},
        scientificNameId: undefined,
        subspeciesId: undefined,
        groupId: undefined,
        typeId: undefined,
        origins: [],
        langualCodes: [],
        nutrientsValueForm: {
            energy: Array.from(energy.values()).map((nutrient) => ({
                nutrientId: +nutrient.id,
                referenceCodes: []
            })),
            mainNutrients: [],
            micronutrients: {
                vitamins: [],
                minerals: [],
            },
        },
    })
    useEffect(() => {
        const initialFormData: FoodForm = {
            code: "",
            commonName: {es: ""},
            ingredients: {},
            scientificNameId: undefined,
            subspeciesId: undefined,
            groupId: undefined,
            typeId: undefined,
            origins: [],
            langualCodes: [],
            nutrientsValueForm: {
                energy: energy.map((energy: AnyNutrient) => ({
                    nutrientId: +energy.id,
                    referenceCodes: [],
                })),
                mainNutrients: [],
                micronutrients: {
                    vitamins: vitamins.map((vitamin: AnyNutrient) => ({
                        nutrientId: +vitamin.id,
                        referenceCodes: [],
                    })),
                    minerals: minerals.map((mineral: AnyNutrient) => ({
                        nutrientId: +mineral.id,
                        referenceCodes: [],
                    })),
                },
            },
        };

        setFormState(initialFormData);
        // eslint-disable-next-line
    }, [energy.size, macronutrients.size, vitamins.size, minerals.size]);

    console.log(formState.origins);
    const renderSection = () => {
        switch (activeSection) {
            case 1:
                return (
                    <NewGeneralData
                        data={{
                            code: formState.code,
                            strain: formState.strain,
                            brand: formState.brand,
                            observation: formState.observation,
                            groupId: formState.groupId,
                            typeId: formState.typeId,
                            commonName: formState.commonName,
                            ingredients: formState.ingredients,
                            scientificNameId: formState.scientificNameId,
                            subspeciesId: formState.subspeciesId
                        }}
                        onUpdate={(generalData) => {
                            selectHandle({...formState, ...generalData}, TypeOfHandle.GENERAL_DATA, setFormState);
                        }}
                        groups={groups.idToObject.map((o) => o)}
                        languages={languages.map((o) => o)}
                        scientificNames={scientificNames.idToObject.map((o) => o)}
                        subspecies={subspecies.idToObject.map((o) => o)}
                        types={types.idToObject.map((o) => o)}
                    />
                );

            case 2:
                return (
                    <NewNutrients
                        nutrients={formState.nutrientsValueForm.energy}
                        onNutrientUpdate={(updatedNutrient) => {
                            const updatedEnergyArray = formState.nutrientsValueForm.energy.map(item =>
                                item.nutrientId === updatedNutrient.nutrientId
                                    ? updatedNutrient
                                    : item
                            );
                            selectHandle(
                                {
                                    nutrientsValueForm: {
                                        energy: updatedEnergyArray,
                                        mainNutrients: formState.nutrientsValueForm.mainNutrients,
                                        micronutrients: formState.nutrientsValueForm.micronutrients
                                    }
                                },
                                TypeOfHandle.ENERGY_DATA,
                                setFormState
                            );
                        }}
                        nameAndIdNutrients={nutrients.map<{
                            id: number,
                            name: string,
                            measurementUnit: string
                        }>((n) => n)}
                    />
                );
            case 3:
                return (
                    <NewMacronutrientWithComponent
                        macronutrientsWithComponents={formState.nutrientsValueForm.mainNutrients.filter(
                            (n) => n.components?.length > 0
                        )}
                        onMacronutrientUpdate={(nutrientMeasurementForm) => selectHandle({...formState, ...nutrientMeasurementForm}, TypeOfHandle.MAIN_NUTRIENTS_DATA, setFormState)}
                        nameAndIdNutrients={nutrients.map<{
                            id: number,
                            name: string,
                            measurementUnit: string
                        }>((n) => n)}
                    />
                );
            case 4:
                return (
                    <NewNutrients
                        nutrients={formState.nutrientsValueForm.mainNutrients.filter(
                            (n) => n.components?.length === 0
                        )}
                        onNutrientUpdate={(nutrientMeasurementForm) => selectHandle({...formState, ...nutrientMeasurementForm}, TypeOfHandle.MAIN_NUTRIENTS_DATA, setFormState)}
                        nameAndIdNutrients={nutrients.map<{
                            id: number,
                            name: string,
                            measurementUnit: string
                        }>((n) => n)}
                    />
                );
            case 5:
                return (
                    <NewNutrients
                        nutrients={formState.nutrientsValueForm.micronutrients.vitamins}
                        onNutrientUpdate={(nutrientMeasurementForm) => selectHandle({...formState, ...nutrientMeasurementForm}, TypeOfHandle.VITAMINS_DATA, setFormState)}
                        nameAndIdNutrients={nutrients.map<{
                            id: number,
                            name: string,
                            measurementUnit: string
                        }>((n) => n)}
                    />
                );
            case 6:
                return (
                    <NewNutrients
                        nutrients={formState.nutrientsValueForm.micronutrients.minerals}
                        onNutrientUpdate={(nutrientMeasurementForm) => selectHandle({...formState, ...nutrientMeasurementForm}, TypeOfHandle.MINERALS_DATA, setFormState)}
                        nameAndIdNutrients={nutrients.map<{
                            id: number,
                            name: string,
                            measurementUnit: string
                        }>((n) => n)}
                    />
                );
            case 7: // Origines
                 return (
                     <Origins
                         originsForm={formState.origins}
                         data={{regions, provinces, communes, locations}}
                         updateOrigins={(origins) =>
                             selectHandle(
                                 {
                                     ...formState,
                                     origins: origins
                                 },
                                 TypeOfHandle.ORIGINS_DATA,
                                 setFormState
                             )
                         }
                     />
                 );
             /*case 8:
                 return (
                     <NewReferences
                         references={references || []}
                         nutrientValueForm={formState.nutrientsValueForm}
                         nameAndIdNutrients={nameAndIdNutrients}
                         onSelectReferenceForNutrients={handleReferences}
                         cities={cities || []}
                         authors={authors || []}
                         journals={journals || []}
                     />
                 );
             case 9:
                 return (
                     <NewLangualCode
                         langualCodes={langualCodes.map((v) => v)}
                         onLangualCodesChange={handleLangualCodes}
                         selectedLangualCodes={formState.langualCodes}
                     />
                 );
             case 10:
                 return (
                     <PreviewDataForm
                         data={formState}
                         nameAndIdNutrients={nameAndIdNutrients}
                         origins={formState.origins?.map((o) => o.name) || []}
                         types={types.idToObject.map((o) => o)}
                         groups={groups.idToObject.map((o) => o)}
                         langualCodes={langualCodes.map((v) => v)}
                         scientificNames={scientificNames.idToObject.map((o) => o)}
                         subspecies={subspecies.idToObject.map((o) => o)}
                     />
                 );*/
            default:
                return null;
        }
    };

    const sectionNames = [
        t("AdminPage.sectionNames.data"),
        t("AdminPage.sectionNames.value"),
        t("AdminPage.sectionNames.compound"),
        t("AdminPage.sectionNames.non_compounded"),
        t("AdminPage.sectionNames.vitamins"),
        t("AdminPage.sectionNames.minerals"),
        t("AdminPage.sectionNames.origins"),
        t("AdminPage.sectionNames.references"),
        t("AdminPage.sectionNames.codes"),
        t("AdminPage.sectionNames.view"),
    ];

    return (
        <>
            <div className="left-column">
                <h3 className="subtitle">{t("AdminPage.title")}</h3>
                {sectionNames.map((name, index) => (
                    <button
                        key={`manual-${index}`}
                        className={`pagination-button ${
                            activeSection === index + 1 ? "active" : ""
                        }`}
                        onClick={() => setActiveSection(index + 1)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <div className="content-container">
                <h2 className="title">{t("AdminPage.enter")}</h2>
                {renderSection()}
            </div>
        </>
    )
}
