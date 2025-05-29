import {useState} from "react";
import {useTranslation} from "react-i18next";
import {
    NutrientMeasurementForm,
    NutrientSummary,
} from "@/pages/AdminPage";
import { Ellipsis, AlertCircle } from "lucide-react";
import NumericField from "@/app/components/NumericField";
import ToolTip from "@/app/components/ToolTip";


const getNutrientNameById = (
    id: number,
    nameAndIdNutrients: NutrientSummary[]
): string => {

    const nutrient = nameAndIdNutrients.find((nutrient) => nutrient.id === id);

    return `${nutrient?.name} (${nutrient?.measurementUnit})`;
};
export type NutrientMeasurementFormOnlyNumbers = {
    [K in keyof NutrientMeasurementForm as NutrientMeasurementForm[K] extends number | undefined
        ? K
        : never]: NutrientMeasurementForm[K];
}
type NewNutrientsProps = {
    nutrients: NutrientMeasurementForm[];
    onNutrientUpdate: (updatedNutrient: NutrientMeasurementForm) => void;
    nameAndIdNutrients: NutrientSummary[];
};
export default function NewNutrients({
                                         nutrients,
                                         onNutrientUpdate,
                                         nameAndIdNutrients,
                                     }: NewNutrientsProps) {
    const [editingNutrientId, setEditingNutrientId] = useState<number | undefined>(undefined);
    const [formData, setFormData] = useState<NutrientMeasurementForm | undefined>(
        undefined
    );
    const {t} = useTranslation();


    const startEditing = (nutrient: NutrientMeasurementForm) => {
        setEditingNutrientId(nutrient.nutrientId);
        setFormData({...nutrient});
    };

    const handleInputChange = (
        field: keyof NutrientMeasurementForm,
        value: any
    ) => {
        if (formData) {
            setFormData({...formData, [field]: value});
        }
    };

    const isValueDefined = <K extends keyof NutrientMeasurementForm>(key: K) => {
        const value = formData?.[key];
        return typeof value !== "undefined" && (typeof value === "string" ? value !== "" : true);
    };
    const isValueLessThan = <K extends keyof NutrientMeasurementFormOnlyNumbers>(key: K, comp: number) => {
        return (formData?.[key] ?? 0) < comp;
    };
    const isValueNotInteger = <K extends keyof NutrientMeasurementFormOnlyNumbers>(key: K) => {
        return !Number.isSafeInteger(formData?.[key] ?? 0);
    };

    const isAverageInvalid = (isValueDefined("average") || isValueDefined("dataType"))
        && (!isValueDefined("average") || isValueLessThan("average", 0));
    const isDeviationInvalid = isValueDefined("deviation") && isValueLessThan("deviation", 0);
    const isMinInvalid = isValueDefined("min") && isValueLessThan("min", 0);
    const isMaxInvalid = isValueDefined("max") && isValueLessThan("max", formData?.min ?? 0);
    const isSampleSizeInvalid = isValueDefined("sampleSize")
        && (isValueLessThan("sampleSize", 1) || isValueNotInteger("sampleSize"));
    const isDataTypeInvalid = (isValueDefined("average") || isValueDefined("dataType")) && !formData?.dataType;

    const saveChanges = () => {
        if (isAverageInvalid
            || isDeviationInvalid
            || isMinInvalid
            || isMaxInvalid
            || isSampleSizeInvalid
            || isDataTypeInvalid
        ) {
            return;
        }

        // Proceed with update if validation passes
        if (formData && editingNutrientId !== undefined) {
            onNutrientUpdate(formData);
            setEditingNutrientId(undefined);
            setFormData(undefined);
        }
    };

    const cancelEditing = () => {
        setEditingNutrientId(undefined);
        setFormData(undefined);
    };

    return (
        <div className="p-[20px] rounded-[8px] font-['Poppins',_sans-serif] text-[14px]">
            <div className="overflow-x-auto">
                <table className="w-full border-[1px] border-[#dee2e6] rounded-[5px] table-fixed">
                    <colgroup>
                        <col className="w-[20%]" />
                        <col className="w-[10%]" />
                        <col className="w-[10%]" />
                        <col className="w-[10%]" />
                        <col className="w-[10%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                        <col className="w-[10%]" />
                    </colgroup>
                    <thead>
                    <tr className="bg-[#8fbc8f] rounded-[5px]">
                        <th className="bg-[white] text-[black] font-[700] p-[8px] text-left">
                            {t("NewMacronutrient.name")}
                        </th>
                        <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.mean")}
                        </th>
                        <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.Deviation")}
                        </th>
                        <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.min")}
                        </th>
                        <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.max")}
                        </th>
                        <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.Size")}
                        </th>
                        <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.type")}
                        </th>
                        <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.Action")}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {nutrients.map((nutrient, index) => (
                        <tr
                            key={nutrient.nutrientId}
                            className={`${
                                index % 2 === 0 ? "bg-[#f2f2f2]" : "bg-[white]"
                            } h-[60px] transition-all duration-200`}
                        >
                            {editingNutrientId === nutrient.nutrientId ? (
                                <>
                                    <td className="p-[8px] align-middle">
                                        <div className="text-[14px]">
                                            {getNutrientNameById(
                                                nutrient.nutrientId,
                                                nameAndIdNutrients
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                        <div className="flex flex-row">
                                            <NumericField
                                                value={formData?.average}
                                                error={isAverageInvalid}
                                                errorMessage=""
                                                onChange={(value) => handleInputChange("average", value)}
                                                allowDecimals={true}
                                                min={0}
                                                fullWidth={true}
                                            />
                                            {isAverageInvalid && (
                                                <ToolTip
                                                    content={!isValueDefined("average")
                                                        ? "Ingrese el promedio."
                                                        : "Promedio debe ser al menos 0."}
                                                >
                                                    <AlertCircle className="absolute right-[4px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]" />
                                                </ToolTip>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                        <div className="flex flex-row">
                                            <NumericField
                                                value={formData?.deviation}
                                                error={isDeviationInvalid}
                                                errorMessage=""
                                                onChange={(value) => handleInputChange("deviation", value)}
                                                allowDecimals={true}
                                                min={0}
                                                fullWidth={true}
                                            />
                                            {isDeviationInvalid && (
                                                <ToolTip content="Desviación debe ser al menos 0.">
                                                    <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px text-[#ef4444]"/>
                                                </ToolTip>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                        <div className="flex flex-row">
                                            <NumericField
                                                value={formData?.min}
                                                error={isMinInvalid}
                                                errorMessage=""
                                                onChange={(value) => handleInputChange("min", value)}
                                                allowDecimals={true}
                                                min={0}
                                                className="w-full"
                                            />
                                            {isMinInvalid && (
                                                <ToolTip content="Mínimo debe ser al menos 0.">
                                                    <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px text-[#ef4444]"/>
                                                </ToolTip>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                        <div className="flex flex-row">
                                            <NumericField
                                                value={formData?.max}
                                                error={isMaxInvalid}
                                                errorMessage=""
                                                onChange={(value) => handleInputChange("max", value)}
                                                allowDecimals={true}
                                                min={formData?.min ?? 0}
                                                className="w-full"
                                            />
                                            {isMaxInvalid && (
                                                <ToolTip
                                                    content={
                                                        isValueLessThan("max", 0)
                                                            ? "Máximo debe ser al menos 0."
                                                            : "Máximo debe ser mayor o igual al mínimo"
                                                    }
                                                >
                                                    <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px text-[#ef4444]"/>
                                                </ToolTip>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                        <div className="flex flex-row">
                                            <NumericField
                                                value={formData?.sampleSize}
                                                error={isSampleSizeInvalid}
                                                errorMessage=""
                                                onChange={(value) => handleInputChange("sampleSize", value)}
                                                allowDecimals={false}
                                                min={1}
                                                className="w-full"
                                            />
                                            {isSampleSizeInvalid && (
                                                <ToolTip
                                                    content={
                                                        isValueLessThan("sampleSize", 1)
                                                            ? "Tamaño de muestra debe ser al menos 1."
                                                            : "Tamaño de muestra debe ser un entero."
                                                    }
                                                >
                                                    <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px text-[#ef4444]"/>
                                                </ToolTip>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                        <div className="flex flex-row">
                                            <select
                                                value={formData?.dataType || ""}
                                                className={`w-full p-[8px] rounded-[4px] border ${
                                                    isDataTypeInvalid
                                                        ? "border-[#ef4444]"
                                                        : "border-[#d1d5db]"
                                                }`}
                                                onChange={(e) => handleInputChange("dataType", e.target.value)}
                                            >
                                                <option value="">Ninguna</option>
                                                <option value="analytic">
                                                    {t("NewMacronutrient.Analytical")}
                                                </option>
                                                <option value="calculated">
                                                    {t("NewMacronutrient.Calculated")}
                                                </option>
                                                <option value="assumed">
                                                    {t("NewMacronutrient.Taken")}
                                                </option>
                                                <option value="borrowed">
                                                    {t("NewMacronutrient.Borrowed")}
                                                </option>
                                            </select>
                                            {isDataTypeInvalid && (
                                                <ToolTip content="Ingrese el tipo de dato.">
                                                    <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px text-[#ef4444]"/>
                                                </ToolTip>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-[8px] text-center">
                                        <div className="flex flex-col space-y-[8px] justify-center">
                                            <button
                                                className="bg-[#3cb371] hover:bg-[#2e8b57] text-[white] py-[4px] px-[12px] rounded-[4px] transition-colors w-full"
                                                onClick={saveChanges}
                                            >
                                                {t("NewMacronutrient.save")}
                                            </button>
                                            <button
                                                className="bg-[#cd5c5c] hover:bg-[#b22222] text-[white] py-[4px] px-[12px] rounded-[4px] transition-colors w-full"
                                                onClick={cancelEditing}
                                            >
                                                {t("NewMacronutrient.cancel")}
                                            </button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="p-[8px] align-middle">
                                        {getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                        {nutrient.average ?? (
                                            <div className="flex justify-center">
                                                <Ellipsis size={24} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                        {nutrient.deviation ?? (
                                            <div className="flex justify-center">
                                                <Ellipsis size={24} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                        {nutrient.min ?? (
                                            <div className="flex justify-center">
                                                <Ellipsis size={24} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                        {nutrient.max ?? (
                                            <div className="flex justify-center">
                                                <Ellipsis size={24} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                        {nutrient.sampleSize ?? (
                                            <div className="flex justify-center">
                                                <Ellipsis size={24} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                        {nutrient.dataType ? (
                                            nutrient.dataType.charAt(0).toUpperCase() +
                                            nutrient.dataType.slice(1)
                                        ) : (
                                            <div className="flex justify-center">
                                                <Ellipsis size={24} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-[8px] text-center align-middle">
                                        <button
                                            className="bg-[#6b8e23] hover:bg-[#556b2f] text-[white] py-[4px] px-[12px] rounded-[4px] transition-colors"
                                            onClick={() => startEditing(nutrient)}
                                        >
                                            {t("NewMacronutrient.Edit")}
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
