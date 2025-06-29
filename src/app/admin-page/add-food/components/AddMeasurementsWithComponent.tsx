"use client";

import { useTranslation } from "@/context/I18nContext";
import {
    getNutrientNameById,
    type NutrientMeasurementForm,
    type NutrientMeasurementWithComponentsForm,
    type NutrientSummary,
} from "@/types/nutrients";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type JSX, useState } from "react";
import AddNutrientRow from "./add-nutrients-measurements/AddNutrientRow";

type NewMacronutrientWithComponentProps = {
    macronutrientsWithComponents: NutrientMeasurementWithComponentsForm[];
    onMacronutrientUpdate: (
        updatedNutrient: NutrientMeasurementWithComponentsForm
    ) => void;
    nameAndIdNutrients: NutrientSummary[];
};

export default function AddMeasurementsWithComponent({
    macronutrientsWithComponents,
    onMacronutrientUpdate,
    nameAndIdNutrients,
}: NewMacronutrientWithComponentProps): JSX.Element {
    const [open, setOpen] = useState<Set<string>>(
        new Set(macronutrientsWithComponents.map((n) => n.nutrientId.toString()))
    );
    const [editingComponentId, setEditingComponentId] = useState<number | undefined>(undefined);
    const [formData, setFormData] = useState<NutrientMeasurementForm | undefined>(undefined);
    const { t } = useTranslation();

    const toggleCollapse = (id: string): void => {
        setOpen((prev) => {
            const newSet = new Set(prev);

            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }

            return newSet;
        });
    };

    const startEditing = (component: NutrientMeasurementForm): void => {
        setEditingComponentId(component.nutrientId);
        setFormData({ ...component });
    };

    const handleInputChange = (field: keyof NutrientMeasurementForm, value: unknown): void => {
        if (formData) {
            setFormData({ ...formData, [field]: value });
        }
    };

    const saveChanges = (shouldNotSave: boolean): void => {
        if (shouldNotSave) {
            return;
        }

        if (formData && editingComponentId !== undefined) {
            const updatedNutrients = macronutrientsWithComponents.map((nutrient) => {
                if (nutrient.nutrientId === editingComponentId) {
                    return { ...nutrient, ...formData };
                }

                const updatedComponents = nutrient.components.map((component) =>
                    component.nutrientId === editingComponentId
                        ? { ...component, ...formData }
                        : component
                );
                return { ...nutrient, components: updatedComponents };
            });

            const updatedNutrient = updatedNutrients.find(
                (nutrient) =>
                    nutrient.nutrientId === editingComponentId
                    || nutrient.components.some(
                        (component) => component.nutrientId === editingComponentId
                    )
            );

            if (updatedNutrient) {
                onMacronutrientUpdate(updatedNutrient);
            }

            setEditingComponentId(undefined);
            setFormData(undefined);
        }
    };

    const cancelEditing = (): void => {
        setEditingComponentId(undefined);
        setFormData(undefined);
    };

    return (
        <div className="p-[20px] rounded-[8px] font-['Poppins',_sans-serif] text-[14px]">
            {macronutrientsWithComponents.map((nutrient) => (
                <div
                    key={nutrient.nutrientId}
                    className="mb-[16px] border-[1px] border-[#dee2e6] rounded-[5px] overflow-hidden"
                >
                    <div
                        className="bg-[#8fbc8f] p-[12px] flex justify-between items-center cursor-pointer"
                        onClick={() => toggleCollapse(nutrient.nutrientId.toString())}
                    >
                        <div className="font-[700] text-[16px] text-[white]">
                            {getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}
                        </div>
                        <div>
                            {open.has(nutrient.nutrientId.toString())
                                ? <ChevronUp className="text-[white]"/>
                                : <ChevronDown className="text-[white]"/>
                            }
                        </div>
                    </div>

                    {open.has(nutrient.nutrientId.toString()) && (
                        <div className="p-[12px]">
                            <div className="overflow-x-auto">
                                <table className="w-full border-[1px] border-[#dee2e6] rounded-[5px] table-fixed">
                                    <colgroup>
                                        <col className="w-[20%]"/>
                                        <col className="w-[10%]"/>
                                        <col className="w-[10%]"/>
                                        <col className="w-[10%]"/>
                                        <col className="w-[10%]"/>
                                        <col className="w-[15%]"/>
                                        <col className="w-[15%]"/>
                                        <col className="w-[10%]"/>
                                    </colgroup>
                                    <thead>
                                        <tr className="bg-[#8fbc8f] rounded-[5px]">
                                            <th className="bg-[white] text-[black] font-[700] p-[8px] text-left">
                                                {t.newMacronutrient.name}
                                            </th>
                                            <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                                                {t.newMacronutrient.average}
                                            </th>
                                            <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                                                {t.newMacronutrient.deviation}
                                            </th>
                                            <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                                                {t.newMacronutrient.min}
                                            </th>
                                            <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                                                {t.newMacronutrient.max}
                                            </th>
                                            <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                                                {t.newMacronutrient.sampleSize}
                                            </th>
                                            <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                                                {t.newMacronutrient.type}
                                            </th>
                                            <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                                                {t.newMacronutrient.action}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nutrient.components?.map((component, index) => (
                                            <AddNutrientRow
                                                key={component.nutrientId}
                                                nutrient={component}
                                                nutrientName={getNutrientNameById(
                                                    nutrient.nutrientId,
                                                    nameAndIdNutrients
                                                )}
                                                index={index}
                                                formData={formData}
                                                isParent={false}
                                                isEditing={editingComponentId === component.nutrientId}
                                                startEditing={startEditing}
                                                handleInputChange={handleInputChange}
                                                saveChanges={saveChanges}
                                                cancelEditing={cancelEditing}
                                            />
                                        ))}

                                        <AddNutrientRow
                                            nutrient={nutrient}
                                            nutrientName={getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}
                                            formData={formData}
                                            index={0}
                                            isParent={true}
                                            isEditing={editingComponentId === nutrient.nutrientId}
                                            startEditing={startEditing}
                                            handleInputChange={handleInputChange}
                                            saveChanges={saveChanges}
                                            cancelEditing={cancelEditing}
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
