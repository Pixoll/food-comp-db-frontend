import api, { NewFoodDto } from "@/api";
import {
    searchGroupNameById,
    searchScientificNameById,
    searchSubspeciesNameById,
    searchTypeNameById,
} from "@/app/admin-page/add-food/components/FoodGeneralData";
import { FoodForm } from "@/app/admin-page/add-food/page";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
// TODO some really horrible shit 2
// @ts-expect-error
import { Group, LangualCode, ScientificName, Subspecies, Type, } from "@/hooks";
import {
    getNutrientNameById,
    NutrientMeasurementForm,
    NutrientMeasurementWithComponentsForm,
    NutrientSummary,
} from "@/types/nutrients";
import { CodeIcon, Database, Info, Leaf, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

type PreviewDataFormProps = {
    data: FoodForm;
    nameAndIdNutrients: NutrientSummary[];
    types: Type[];
    groups: Group[];
    scientificNames: ScientificName[];
    langualCodes: LangualCode[];
    subspecies: Subspecies[];
    origins: number[];
};

export default function PreviewDataForm({
    data,
    nameAndIdNutrients,
    origins,
    scientificNames,
    groups,
    langualCodes,
    subspecies,
    types,
}: PreviewDataFormProps) {
    console.log(data);
    const { t } = useTranslation();
    const { state } = useAuth();
    const { addToast } = useToast();
    const hasValidData = <T extends NutrientMeasurementForm>(
        nutrient: T
        // @ts-expect-error
    ): nutrient is Omit<T, "average" | "dataType"> &
        Required<Pick<T, "average" | "dataType">> => {
        return (
            typeof nutrient.average !== "undefined" &&
            typeof nutrient.dataType !== "undefined"
        );
    };

    const handleSubmit = async () => {
        const payload: NewFoodDto = {
            commonName: {
                es: data.commonName.es,
                en: data.commonName.en || undefined,
                pt: data.commonName.pt || undefined,
            },
            ingredients: {
                es: data.ingredients.es || undefined,
                en: data.ingredients.en || undefined,
                pt: data.ingredients.pt || undefined,
            },
            scientificNameId: data.scientificNameId,
            subspeciesId: data.subspeciesId,
            groupId: data.groupId || -1,
            typeId: data.typeId || -1,
            langualCodes: data.langualCodes,
            nutrientMeasurements: [
                ...data.nutrientsValueForm.energy
                    .filter(hasValidData)
                    .map((energy) => ({
                        nutrientId: energy.nutrientId,
                        average: energy.average,
                        deviation: energy.deviation ?? undefined,
                        min: energy.min ?? undefined,
                        max: energy.max ?? undefined,
                        sampleSize: energy.sampleSize ?? undefined,
                        dataType: energy.dataType,
                        referenceCodes:
                            energy.referenceCodes.length > 0
                                ? energy.referenceCodes
                                : undefined,
                    })),
                ...data.nutrientsValueForm.mainNutrients
                    .filter(hasValidData)
                    .map((mainNutrient) => ({
                        nutrientId: mainNutrient.nutrientId,
                        average: mainNutrient.average,
                        deviation: mainNutrient.deviation ?? undefined,
                        min: mainNutrient.min ?? undefined,
                        max: mainNutrient.max ?? undefined,
                        sampleSize: mainNutrient.sampleSize ?? undefined,
                        dataType: mainNutrient.dataType,
                        referenceCodes:
                            mainNutrient.referenceCodes.length > 0
                                ? mainNutrient.referenceCodes
                                : undefined,
                    })),
                ...data.nutrientsValueForm.mainNutrients.flatMap((mainNutrient) =>
                    mainNutrient.components.filter(hasValidData).map((component) => ({
                        nutrientId: component.nutrientId,
                        average: component.average,
                        deviation: component.deviation ?? undefined,
                        min: component.min ?? undefined,
                        max: component.max ?? undefined,
                        sampleSize: component.sampleSize ?? undefined,
                        dataType: component.dataType,
                        referenceCodes:
                            component.referenceCodes.length > 0
                                ? component.referenceCodes
                                : undefined,
                    }))
                ),
                ...data.nutrientsValueForm.micronutrients.minerals
                    .filter(hasValidData)
                    .map((mineral) => ({
                        nutrientId: mineral.nutrientId,
                        average: mineral.average,
                        deviation: mineral.deviation ?? undefined,
                        min: mineral.min ?? undefined,
                        max: mineral.max ?? undefined,
                        sampleSize: mineral.sampleSize ?? undefined,
                        dataType: mineral.dataType,
                        referenceCodes:
                            mineral.referenceCodes.length > 0
                                ? mineral.referenceCodes
                                : undefined,
                    })),
                ...data.nutrientsValueForm.micronutrients.vitamins
                    .filter(hasValidData)
                    .map((vitamin) => ({
                        nutrientId: vitamin.nutrientId,
                        average: vitamin.average,
                        deviation: vitamin.deviation ?? undefined,
                        min: vitamin.min ?? undefined,
                        max: vitamin.max ?? undefined,
                        sampleSize: vitamin.sampleSize ?? undefined,
                        dataType: vitamin.dataType,
                        referenceCodes:
                            vitamin.referenceCodes.length > 0
                                ? vitamin.referenceCodes
                                : undefined,
                    })),
            ],
            brand: data.brand || undefined,
            observation: data.observation || undefined,
            originIds: data.origins,
            strain: data.strain || undefined,
        };

        try {
            const result = await api.createFoodV1({
                path: {
                    code: data.code,
                },
                auth: state.token ?? "",
                body: payload,
            });

            if (result.error) {
                console.error(result.error);
                addToast({
                    message: result.error.message,
                    title: "Fallo",
                    type: "Danger",
                });
                return;
            }

            addToast({
                message: "Se creo exitosamente",
                title: "Éxito",
                type: "Success",
            });
        } catch (error) {
            console.error(error);
            addToast({
                message: (error as Error)?.message ?? "Error",
                title: "Fallo",
                type: "Danger",
            });
        }
    };
    type DataRender = {
        parentSelected: LangualCode;
        childrenSelecteds: LangualCode[];
    };

    function searchLangualCodes(
        childrenIds: number[],
        langualCodes: LangualCode[]
    ): DataRender[] | null {
        if (childrenIds.length === 0) {
            return null;
        }
        const childrenInfo = childrenIds
            .map((childId) => langualCodes.find((code) => code.id === childId))
            .filter((child): child is LangualCode => child !== undefined);

        const uniqueParentIds = Array.from(
            new Set(
                childrenInfo
                    .map((child) => child.parentId)
                    .filter((id): id is number => id !== null)
            )
        );

        const parentsInfo = uniqueParentIds
            .map((parentId) => langualCodes.find((code) => code.id === parentId))
            .filter((parent): parent is LangualCode => parent !== undefined);

        const result: DataRender[] = parentsInfo.map((parent) => ({
            parentSelected: parent,
            childrenSelecteds: childrenInfo.filter(
                (child) => child.parentId === parent.id
            ),
        }));

        return result;
    }

    const langualCodesInfo = searchLangualCodes(
        data.langualCodes,
        langualCodes
    );

    const renderNutrientTable = (
        title: string,
        nutrients: NutrientMeasurementForm[]
    ) => {
        const validNutrients = nutrients.filter(hasValidData);
        if (validNutrients.length === 0) return null;

        return (
            <div className="mb-[24px]">
                <div className="flex items-center mb-[16px]">
                    <Zap className="mr-[12px] text-[#3b82f6]" size={24}/>
                    <h5 className="text-[18px] font-[600] m-[0]">{title}</h5>
                </div>
                <div
                    className="overflow-x-auto rounded-[8px] border-[1px] border-[#e5e7eb] shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                >
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                        <tr className="bg-[#f9fafb]">
                            <th className="py-[12px] px-[16px] text-left font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Nombre
                                                                                                                                                del
                                                                                                                                                nutriente
                            </th>
                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Promedio</th>
                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Desviación</th>
                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Mínimo</th>
                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Máximo</th>
                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Tamaño
                                                                                                                                                  de
                                                                                                                                                  muestra
                            </th>
                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Tipo
                                                                                                                                                  de
                                                                                                                                                  dato
                            </th>
                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Códigos
                                                                                                                                                  de
                                                                                                                                                  referencias
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {validNutrients.map((nutrient, index) => (
                            <tr key={index} className="border-b-[1px] border-[#e5e7eb] hover:bg-[#f9fafb]">
                                <td className="py-[12px] px-[16px] font-[500] text-[14px] text-[#111827]">
                                    {getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}
                                </td>
                                <td className="py-[12px] px-[16px] text-center">
                  <span
                      className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                  >
                    {nutrient.average.toString()}
                  </span>
                                </td>
                                <td className="py-[12px] px-[16px] text-center">
                  <span
                      className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                  >
                    {nutrient.deviation?.toString() || "N/A"}
                  </span>
                                </td>
                                <td className="py-[12px] px-[16px] text-center">
                  <span
                      className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                  >
                    {nutrient.min?.toString() || "N/A"}
                  </span>
                                </td>
                                <td className="py-[12px] px-[16px] text-center">
                  <span
                      className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                  >
                    {nutrient.max?.toString() || "N/A"}
                  </span>
                                </td>
                                <td className="py-[12px] px-[16px] text-center">
                  <span
                      className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                  >
                    {nutrient.sampleSize?.toString() || "N/A"}
                  </span>
                                </td>
                                <td className="py-[12px] px-[16px] text-center">
                  <span
                      className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                  >
                    {nutrient.dataType}
                  </span>
                                </td>
                                <td className="py-[12px] px-[16px] text-center">
                  <span
                      className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                  >
                    {nutrient.referenceCodes}
                  </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderMainNutrientTables = (
        mainNutrients: NutrientMeasurementWithComponentsForm[]
    ) => {
        const nutrientsWithComponents = mainNutrients.filter(
            (nutrient) =>
                nutrient.components && nutrient.components.some(hasValidData)
        );

        const nutrientsWithoutComponents = mainNutrients.filter(
            (nutrient) =>
                (!nutrient.components || nutrient.components.length === 0) &&
                hasValidData(nutrient)
        );

        return (
            <>
                {nutrientsWithComponents.length > 0 && (
                    <>
                        <div className="flex items-center mb-[16px]">
                            <Leaf className="mr-[12px] text-[#10b981]" size={24}/>
                            <h5 className="text-[18px] font-[600] m-[0]">Nutrientes con componentes</h5>
                        </div>
                        {nutrientsWithComponents.map((mainNutrient, index) => (
                            <div key={index} className="mb-[24px]">
                                <h6 className="flex items-center text-[16px] font-[600] mb-[12px]">
                                    <Database className="mr-[8px] text-[#3b82f6]" size={18}/>
                                    {getNutrientNameById(
                                        mainNutrient.nutrientId,
                                        nameAndIdNutrients
                                    )}{" "}
                                    (Total)
                                </h6>
                                <div
                                    className="overflow-x-auto rounded-[8px] border-[1px] border-[#e5e7eb] shadow-[0_2px_4px_rgba(0,0,0,0.05)] mb-[16px]"
                                >
                                    <table className="w-full min-w-[800px] border-collapse">
                                        <thead>
                                        <tr className="bg-[#f9fafb]">
                                            <th className="py-[12px] px-[16px] text-left font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Nombre
                                                                                                                                                                del
                                                                                                                                                                componente
                                            </th>
                                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Promedio</th>
                                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Desviación</th>
                                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Mínimo</th>
                                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Máximo</th>
                                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Tamaño
                                                                                                                                                                  de
                                                                                                                                                                  muestra
                                            </th>
                                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Tipo
                                                                                                                                                                  de
                                                                                                                                                                  dato
                                            </th>
                                            <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Códigos
                                                                                                                                                                  de
                                                                                                                                                                  referencias
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {mainNutrient.components
                                            ?.filter(hasValidData)
                                            .map((component, compIndex) => (
                                                <tr
                                                    key={compIndex}
                                                    className="border-b-[1px] border-[#e5e7eb] hover:bg-[#f9fafb]"
                                                >
                                                    <td className="py-[12px] px-[16px] font-[500] text-[14px] text-[#111827]">
                                                        {getNutrientNameById(
                                                            component.nutrientId,
                                                            nameAndIdNutrients
                                                        )}
                                                    </td>
                                                    <td className="py-[12px] px-[16px] text-center">
                            <span
                                className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                            >
                              {component.average?.toString() || "N/A"}
                            </span>
                                                    </td>
                                                    <td className="py-[12px] px-[16px] text-center">
                            <span
                                className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                            >
                              {component.deviation?.toString() || "N/A"}
                            </span>
                                                    </td>
                                                    <td className="py-[12px] px-[16px] text-center">
                            <span
                                className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                            >
                              {component.min?.toString() || "N/A"}
                            </span>
                                                    </td>
                                                    <td className="py-[12px] px-[16px] text-center">
                            <span
                                className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                            >
                              {component.max?.toString() || "N/A"}
                            </span>
                                                    </td>
                                                    <td className="py-[12px] px-[16px] text-center">
                            <span
                                className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                            >
                              {component.sampleSize?.toString() || "N/A"}
                            </span>
                                                    </td>
                                                    <td className="py-[12px] px-[16px] text-center">
                            <span
                                className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                            >
                              {component.dataType}
                            </span>
                                                    </td>
                                                    <td className="py-[12px] px-[16px] text-center text-[12px] text-[#6b7280]">
                                                        {component.referenceCodes}
                                                    </td>
                                                </tr>
                                            ))}
                                        <tr className="bg-[#f3f4f6]">
                                            <td className="py-[12px] px-[16px] font-[600] text-[14px] text-[#111827]">
                                                {getNutrientNameById(
                                                    mainNutrient.nutrientId,
                                                    nameAndIdNutrients
                                                )}{" "}
                                                (Total)
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#dbeafe] text-[#2563eb] rounded-[16px] text-[12px] font-[500]"
                        >
                          {mainNutrient.average?.toString() || "N/A"}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#dbeafe] text-[#2563eb] rounded-[16px] text-[12px] font-[500]"
                        >
                          {mainNutrient.deviation?.toString() || "N/A"}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#dbeafe] text-[#2563eb] rounded-[16px] text-[12px] font-[500]"
                        >
                          {mainNutrient.min?.toString() || "N/A"}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#dbeafe] text-[#2563eb] rounded-[16px] text-[12px] font-[500]"
                        >
                          {mainNutrient.max?.toString() || "N/A"}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#dbeafe] text-[#2563eb] rounded-[16px] text-[12px] font-[500]"
                        >
                          {mainNutrient.sampleSize?.toString() || "N/A"}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#dbeafe] text-[#2563eb] rounded-[16px] text-[12px] font-[500]"
                        >
                          {mainNutrient.dataType}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center text-[12px] text-[#6b7280]">
                                                {mainNutrient.referenceCodes}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {nutrientsWithoutComponents.length > 0 && (
                    <>
                        <div className="flex items-center mb-[16px]">
                            <Database className="mr-[12px] text-[#6b7280]" size={24}/>
                            <h5 className="text-[18px] font-[600] m-[0]">Nutrientes sin componentes</h5>
                        </div>
                        <div
                            className="overflow-x-auto rounded-[8px] border-[1px] border-[#e5e7eb] shadow-[0_2px_4px_rgba(0,0,0,0.05)] mb-[24px]"
                        >
                            <table className="w-full min-w-[800px] border-collapse">
                                <thead>
                                <tr className="bg-[#f9fafb]">
                                    <th className="py-[12px] px-[16px] text-left font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Nombre
                                                                                                                                                        del
                                                                                                                                                        nutriente
                                    </th>
                                    <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Promedio</th>
                                    <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Desviación</th>
                                    <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Mínimo</th>
                                    <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Máximo</th>
                                    <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Tamaño
                                                                                                                                                          de
                                                                                                                                                          muestra
                                    </th>
                                    <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Tipo
                                                                                                                                                          de
                                                                                                                                                          dato
                                    </th>
                                    <th className="py-[12px] px-[16px] text-center font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb]">Códigos
                                                                                                                                                          de
                                                                                                                                                          referencias
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {nutrientsWithoutComponents
                                    ?.filter(hasValidData)
                                    .map((nutrient, index) => (
                                        <tr key={index} className="border-b-[1px] border-[#e5e7eb] hover:bg-[#f9fafb]">
                                            <td className="py-[12px] px-[16px] font-[500] text-[14px] text-[#111827]">
                                                {getNutrientNameById(
                                                    nutrient.nutrientId,
                                                    nameAndIdNutrients
                                                )}
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                        >
                          {nutrient.average.toString()}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                        >
                          {nutrient.deviation?.toString() || "N/A"}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                        >
                          {nutrient.min?.toString() || "N/A"}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                        >
                          {nutrient.max?.toString() || "N/A"}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                        >
                          {nutrient.sampleSize?.toString() || "N/A"}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                        >
                          {nutrient.dataType}
                        </span>
                                            </td>
                                            <td className="py-[12px] px-[16px] text-center">
                        <span
                            className="inline-block py-[4px] px-[8px] bg-[#e5e7eb] text-[#374151] rounded-[16px] text-[12px] font-[500]"
                        >
                          {nutrient.referenceCodes}
                        </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </>
        );
    };

    return (
        <div className="p-[24px] max-w-[1200px] mx-auto">
            <div
                className="mb-[32px] rounded-[8px] border-[1px] border-[#e5e7eb] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden"
            >
                <div className="flex items-center bg-[#f9fafb] p-[16px] border-b-[1px] border-[#e5e7eb]">
                    <div className="text-[#3b82f6] mr-[12px]">
                        <Info size={24}/>
                    </div>
                    <h4 className="text-[20px] font-[600] m-[0]">{t("PreviewDataFrom.General")}</h4>
                </div>
                <div className="p-[24px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[24px]">
                        <div className="col-span-1">
                            <span className="font-[600] text-[14px] text-[#374151]">{t("PreviewDataFrom.Code")}</span>
                        </div>
                        <div className="col-span-1 text-[14px] text-[#4b5563]">{data.code}</div>
                        <div className="col-span-1">
                            <span className="font-[600] text-[14px] text-[#374151]">{t("PreviewDataFrom.Scientific")}</span>
                        </div>
                        <div className="col-span-1 text-[14px] text-[#4b5563]">
                            {searchScientificNameById(data.scientificNameId, scientificNames)}
                        </div>
                        <div className="col-span-1">
                            <span className="font-[600] text-[14px] text-[#374151]">Tipo de alimento:</span>
                        </div>
                        <div
                            className="col-span-1 text-[14px] text-[#4b5563]"
                        >{searchTypeNameById(data.typeId, types)}</div>
                        <div className="col-span-1">
                            <span className="font-[600] text-[14px] text-[#374151]">Grupo alimentario:</span>
                        </div>
                        <div
                            className="col-span-1 text-[14px] text-[#4b5563]"
                        >{searchGroupNameById(data.groupId, groups)}</div>
                        <div className="col-span-1">
                            <span className="font-[600] text-[14px] text-[#374151]">Subespecie:</span>
                        </div>
                        <div className="col-span-1 text-[14px] text-[#4b5563]">
                            {searchSubspeciesNameById(data.subspeciesId, subspecies)}
                        </div>
                        <div className="col-span-1">
                            <span className="font-[600] text-[14px] text-[#374151]">Observación:</span>
                        </div>
                        <div className="col-span-1 text-[14px] text-[#4b5563]">{data.observation}</div>
                        <div className="col-span-1">
                            <span className="font-[600] text-[14px] text-[#374151]">Marca:</span>
                        </div>
                        <div className="col-span-1 text-[14px] text-[#4b5563]">{data.brand}</div>
                        <div className="col-span-1">
                            <span className="font-[600] text-[14px] text-[#374151]">Variante:</span>
                        </div>
                        <div className="col-span-1 text-[14px] text-[#4b5563]">{data.strain}</div>
                    </div>

                    {/* Ingredients and Common Names Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                        <div className="mb-[16px]">
                            <div
                                className="rounded-[8px] border-[1px] border-[#e5e7eb] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                            >
                                <div className="bg-[#f9fafb] p-[12px] border-b-[1px] border-[#e5e7eb]">
                                    <h5 className="text-[16px] font-[600] m-[0]">Ingredientes</h5>
                                </div>
                                <div className="p-[16px]">
                                    <div className="grid grid-cols-2 gap-[12px] mb-[12px]">
                                        <div className="col-span-1">
                                            <span className="font-[600] text-[14px] text-[#374151]">Nombre en español</span>
                                        </div>
                                        <div className="col-span-1 text-[14px] text-[#4b5563]">{data.ingredients.es || "N/A"}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-[12px] mb-[12px]">
                                        <div className="col-span-1">
                                            <span className="font-[600] text-[14px] text-[#374151]">Nombre en inglés</span>
                                        </div>
                                        <div className="col-span-1 text-[14px] text-[#4b5563]">{data.ingredients.en || "N/A"}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-[12px]">
                                        <div className="col-span-1">
                                            <span className="font-[600] text-[14px] text-[#374151]">Nombre en Portugués</span>
                                        </div>
                                        <div className="col-span-1 text-[14px] text-[#4b5563]">{data.ingredients.pt || "N/A"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-[16px]">
                            <div
                                className="rounded-[8px] border-[1px] border-[#e5e7eb] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                            >
                                <div className="bg-[#f9fafb] p-[12px] border-b-[1px] border-[#e5e7eb]">
                                    <h5 className="text-[16px] font-[600] m-[0]">Nombres Comunes</h5>
                                </div>
                                <div className="p-[16px]">
                                    <div className="grid grid-cols-2 gap-[12px] mb-[12px]">
                                        <div className="col-span-1">
                        <span
                            className="font-[600] text-[14px] text-[#374151]"
                        >{t("PreviewDataFrom.Common")} (ES)</span>
                                        </div>
                                        <div className="col-span-1 text-[14px] text-[#4b5563]">{data.commonName.es || "N/A"}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-[12px] mb-[12px]">
                                        <div className="col-span-1">
                        <span
                            className="font-[600] text-[14px] text-[#374151]"
                        >{t("PreviewDataFrom.Common")} (EN)</span>
                                        </div>
                                        <div className="col-span-1 text-[14px] text-[#4b5563]">{data.commonName.en || "N/A"}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-[12px]">
                                        <div className="col-span-1">
                        <span
                            className="font-[600] text-[14px] text-[#374151]"
                        >{t("PreviewDataFrom.Common")} (PT)</span>
                                        </div>
                                        <div className="col-span-1 text-[14px] text-[#4b5563]">{data.commonName.pt || "N/A"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="mb-[32px] rounded-[8px] border-[1px] border-[#e5e7eb] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden"
            >
                <div className="p-[24px]">
                    <h4 className="flex items-center mb-[24px] text-[20px] font-[600]">
                        <Leaf className="mr-[12px] text-[#10b981]" size={28}/>
                        {t("PreviewDataFrom.Nutritional")}
                    </h4>

                    {renderNutrientTable(
                        t("PreviewDataFrom.Energy"),
                        data.nutrientsValueForm.energy
                    )}

                    {renderMainNutrientTables(data.nutrientsValueForm.mainNutrients)}

                    {renderNutrientTable(
                        t("PreviewDataFrom.Vitamins"),
                        data.nutrientsValueForm.micronutrients.vitamins
                    )}

                    {renderNutrientTable(
                        t("PreviewDataFrom.Minerals"),
                        data.nutrientsValueForm.micronutrients.minerals
                    )}
                </div>
            </div>

            {origins && origins.length > 0 && (
                <div
                    className="mb-[32px] rounded-[8px] border-[1px] border-[#e5e7eb] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden"
                >
                    <div className="flex items-center bg-[#f9fafb] p-[16px] border-b-[1px] border-[#e5e7eb]">
                        <div className="text-[#0ea5e9] mr-[12px]">
                            <Database size={24}/>
                        </div>
                        <h5 className="text-[18px] font-[600] m-[0]">Orígenes</h5>
                    </div>
                    <div className="p-[16px]">
                        <div className="overflow-x-auto rounded-[8px] border-[1px] border-[#e5e7eb]">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-[#f9fafb]">
                                    <th className="py-[12px] px-[16px] text-left font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb] w-[10%]">Número</th>
                                    <th className="py-[12px] px-[16px] text-left font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb] w-[90%]">Descripción</th>
                                </tr>
                                </thead>
                                <tbody>
                                {origins.map((origin, index) => (
                                    <tr key={index} className="border-b-[1px] border-[#e5e7eb] hover:bg-[#f9fafb]">
                                        <td className="py-[12px] px-[16px] text-[14px] text-[#4b5563]">{index + 1}</td>
                                        <td className="py-[12px] px-[16px] text-[14px] text-[#4b5563]">{origin}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {langualCodesInfo && data.langualCodes.length > 0 && (
                <div
                    className="mb-[32px] rounded-[8px] border-[1px] border-[#e5e7eb] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden"
                >
                    <div className="flex items-center bg-[#f9fafb] p-[16px] border-b-[1px] border-[#e5e7eb]">
                        <div className="text-[#0ea5e9] mr-[12px]">
                            <CodeIcon size={24}/>
                        </div>
                        <h5 className="text-[18px] font-[600] m-[0]">Códigos languales</h5>
                    </div>
                    <div className="p-[16px]">
                        {langualCodesInfo.map((parentGroup, parentIndex) => (
                            <div
                                key={parentGroup.parentSelected.id}
                                className={parentIndex > 0 ? "mt-[24px]" : ""}
                            >
                                <h6 className="text-[16px] font-[600] mb-[16px]">
                                    {parentGroup.parentSelected.code} -{" "}
                                    {parentGroup.parentSelected.descriptor}
                                </h6>
                                <div className="overflow-x-auto rounded-[8px] border-[1px] border-[#e5e7eb]">
                                    <table className="w-full border-collapse">
                                        <thead>
                                        <tr className="bg-[#f9fafb]">
                                            <th className="py-[12px] px-[16px] text-left font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb] w-[10%]">Código</th>
                                            <th className="py-[12px] px-[16px] text-left font-[600] text-[14px] text-[#374151] border-b-[1px] border-[#e5e7eb] w-[90%]">Descriptor</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {parentGroup.childrenSelecteds.map((child) => (
                                            <tr
                                                key={child.id}
                                                className="border-b-[1px] border-[#e5e7eb] hover:bg-[#f9fafb]"
                                            >
                                                <td className="py-[12px] px-[16px] text-[14px] text-[#4b5563]">{child.code}</td>
                                                <td className="py-[12px] px-[16px] text-[14px] text-[#4b5563]">{child.descriptor}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={handleSubmit}
                className="py-[12px] px-[24px] bg-[#10b981] hover:bg-[#059669] text-white font-[600] text-[16px] rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-colors duration-[200ms] border-[0px] cursor-pointer"
            >
                Validar y enviar
            </button>

            <div className="text-[12px] text-[#6b7280] mt-[16px] text-right">
            </div>
        </div>
    );
}
