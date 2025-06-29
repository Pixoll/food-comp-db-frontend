import { useTranslation } from "@/context/I18nContext";
import type { NutrientMeasurementForm, NutrientSummary } from "@/types/nutrients";
import { type JSX, useState } from "react";
import AddNutrientRow from "./add-nutrients-measurements/AddNutrientRow";

export type NutrientMeasurementFormOnlyNumbers = {
    [K in keyof NutrientMeasurementForm as NutrientMeasurementForm[K] extends number | undefined
        ? K
        : never]: NutrientMeasurementForm[K];
};

type NewNutrientsProps = {
    nutrients: NutrientMeasurementForm[];
    onNutrientUpdate: (updatedNutrient: NutrientMeasurementForm) => void;
    nameAndIdNutrients: NutrientSummary[];
};

export default function AddNutrientsMeasurements({
    nutrients,
    onNutrientUpdate,
    nameAndIdNutrients,
}: NewNutrientsProps): JSX.Element {
    const [editingNutrientId, setEditingNutrientId] = useState<number | undefined>(undefined);
    const [formData, setFormData] = useState<NutrientMeasurementForm | undefined>(
        undefined
    );
    const { t } = useTranslation();

    const startEditing = (nutrient: NutrientMeasurementForm): void => {
        setEditingNutrientId(nutrient.nutrientId);
        setFormData({ ...nutrient });
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

        // Proceed with update if validation passes
        if (formData && editingNutrientId !== undefined) {
            onNutrientUpdate(formData);
            setEditingNutrientId(undefined);
            setFormData(undefined);
        }
    };

    const cancelEditing = (): void => {
        setEditingNutrientId(undefined);
        setFormData(undefined);
    };

    return (
        <div className="p-[20px] rounded-[8px] font-['Poppins',_sans-serif] text-[14px]">
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
                        {nutrients.map((nutrient, index) => (
                            <AddNutrientRow
                                key={nutrient.nutrientId}
                                nutrient={nutrient}
                                nutrientName={getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}
                                index={index}
                                formData={formData}
                                isParent={false}
                                isEditing={editingNutrientId === nutrient.nutrientId}
                                startEditing={startEditing}
                                handleInputChange={handleInputChange}
                                saveChanges={saveChanges}
                                cancelEditing={cancelEditing}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function getNutrientNameById(id: number, nameAndIdNutrients: NutrientSummary[]): string {
    const nutrient = nameAndIdNutrients.find((nutrient) => nutrient.id === id);

    return `${nutrient?.name} (${nutrient?.measurementUnit})`;
}
