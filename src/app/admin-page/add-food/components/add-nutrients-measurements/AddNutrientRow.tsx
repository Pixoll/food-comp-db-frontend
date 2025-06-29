import NumericField from "@/app/components/Fields/NumericField";
import ToolTip from "@/app/components/ToolTip";
import { useTranslation } from "@/context/I18nContext";
import type { NutrientMeasurementForm } from "@/types/nutrients";
import { AlertCircle, Ellipsis } from "lucide-react";
import type { JSX } from "react";
import type { NutrientMeasurementFormOnlyNumbers } from "../AddNutrientsMeasurements";

type NutrientRowProps = {
    nutrient: NutrientMeasurementForm;
    nutrientName: string;
    index: number;
    formData: NutrientMeasurementForm | undefined;
    isParent: boolean;
    isEditing: boolean;
    startEditing: (nutrient: NutrientMeasurementForm) => void;
    handleInputChange: (field: keyof NutrientMeasurementForm, value: unknown) => void;
    saveChanges: (shouldNotSave: boolean) => void;
    cancelEditing: () => void;
};

export default function AddNutrientRow({
    nutrient,
    nutrientName,
    index,
    formData,
    isParent,
    isEditing,
    startEditing,
    handleInputChange,
    saveChanges,
    cancelEditing,
}: NutrientRowProps): JSX.Element {
    const { t } = useTranslation();

    const isValueDefined = <K extends keyof NutrientMeasurementForm>(key: K): boolean => {
        const value = formData?.[key];
        return typeof value !== "undefined" && (typeof value === "string" ? value !== "" : true);
    };
    const isValueLessThan = <K extends keyof NutrientMeasurementFormOnlyNumbers>(key: K, comp: number): boolean => {
        return (formData?.[key] ?? 0) < comp;
    };
    const isValueNotInteger = <K extends keyof NutrientMeasurementFormOnlyNumbers>(key: K): boolean => {
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

    return !isEditing ? (
        <tr
            className={`
            ${isParent
                ? "bg-[#e6f0e6]"
                : index % 2 === 0
                    ? "bg-[#f2f2f2]"
                    : "bg-[white]"
            }
            h-[60px]
            transition-all
            duration-200
            ${isParent ? "font-[600]" : ""}
            `}
        >
            <td className={`p-[8px] align-middle ${isParent ? "font-[600]" : ""}`}>
                {nutrientName}
            </td>
            <td className="text-center p-[8px] align-middle">
                {nutrient.average ?? (
                    <div className="flex justify-center">
                        <Ellipsis size={24}/>
                    </div>
                )}
            </td>
            <td className="text-center p-[8px] align-middle">
                {nutrient.deviation ?? (
                    <div className="flex justify-center">
                        <Ellipsis size={24}/>
                    </div>
                )}
            </td>
            <td className="text-center p-[8px] align-middle">
                {nutrient.min ?? (
                    <div className="flex justify-center">
                        <Ellipsis size={24}/>
                    </div>
                )}
            </td>
            <td className="text-center p-[8px] align-middle">
                {nutrient.max ?? (
                    <div className="flex justify-center">
                        <Ellipsis size={24}/>
                    </div>
                )}
            </td>
            <td className="text-center p-[8px] align-middle">
                {nutrient.sampleSize ?? (
                    <div className="flex justify-center">
                        <Ellipsis size={24}/>
                    </div>
                )}
            </td>
            <td className="text-center p-[8px] align-middle">
                {nutrient.dataType ? (
                    nutrient.dataType.charAt(0).toUpperCase()
                    + nutrient.dataType.slice(1)
                ) : (
                    <div className="flex justify-center">
                        <Ellipsis size={24}/>
                    </div>
                )}
            </td>
            <td className="p-[8px] text-center align-middle">
                <button
                    className="
                    bg-[#6b8e23]
                    hover:bg-[#556b2f]
                    text-[white]
                    py-[4px]
                    px-[12px]
                    rounded-[4px]
                    transition-colors
                    "
                    onClick={() => startEditing(nutrient)}
                >
                    {t.newMacronutrient.edit}
                </button>
            </td>
        </tr>
    ) : (
        <tr
            className={`
            ${isParent
                ? "bg-[#e6f0e6]"
                : index % 2 === 0
                    ? "bg-[#f2f2f2]"
                    : "bg-[white]"
            }
            h-[60px]
            transition-all
            duration-200
            ${isParent ? "font-[600]" : ""}
            `}
        >
            <td className="p-[8px] align-middle">
                <div className="text-[14px] font-[600]">
                    {nutrientName}
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
                                ? t.newMacronutrient.enterAverage
                                : t.atLeast(t.newMacronutrient.average, 0)
                            }
                        >
                            <AlertCircle
                                className="
                                absolute
                                right-[4px]
                                top-[50%]
                                -translate-y-[50%]
                                h-[16px]
                                w-[16px]
                                text-[#ef4444]
                                "
                            />
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
                        <ToolTip content={t.atLeast(t.newMacronutrient.deviation, 0)}>
                            <AlertCircle
                                className="
                                absolute
                                right-[8px]
                                top-[50%]
                                -translate-y-[50%]
                                h-[16px]
                                w-[16px]
                                text-[#ef4444]
                                "
                            />
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
                        <ToolTip content={t.atLeast(t.newMacronutrient.min, 0)}>
                            <AlertCircle
                                className="
                                absolute
                                right-[8px]
                                top-[50%]
                                -translate-y-[50%]
                                h-[16px]
                                w-[16px]
                                text-[#ef4444]
                                "
                            />
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
                                    ? t.atLeast(t.newMacronutrient.max, 0)
                                    : t.greaterThanOrEqual(t.newMacronutrient.max, t.newMacronutrient.min.toLowerCase())
                            }
                        >
                            <AlertCircle
                                className="
                                absolute
                                right-[8px]
                                top-[50%]
                                -translate-y-[50%]
                                h-[16px]
                                w-[16px]
                                text-[#ef4444]
                                "
                            />
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
                                    ? t.atLeast(t.newMacronutrient.sampleSize, 1)
                                    : t.mustBeInteger(t.newMacronutrient.sampleSize)
                            }
                        >
                            <AlertCircle
                                className="
                                absolute
                                right-[8px]
                                top-[50%]
                                -translate-y-[50%]
                                h-[16px]
                                w-[16px]
                                text-[#ef4444]
                                "
                            />
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
                            {t.newMacronutrient.analytical}
                        </option>
                        <option value="calculated">
                            {t.newMacronutrient.calculated}
                        </option>
                        <option value="assumed">
                            {t.newMacronutrient.assumed}
                        </option>
                        <option value="borrowed">
                            {t.newMacronutrient.borrowed}
                        </option>
                    </select>
                    {isDataTypeInvalid && (
                        <ToolTip content={t.newMacronutrient.enterDataType}>
                            <AlertCircle
                                className="
                                absolute
                                right-[8px]
                                top-[50%]
                                -translate-y-[50%]
                                h-[16px]
                                w-[16px]
                                text-[#ef4444]
                                "
                            />
                        </ToolTip>
                    )}
                </div>
            </td>
            <td className="p-[8px] text-center">
                <div className="flex flex-col space-y-[8px] justify-center">
                    <button
                        className="
                        bg-[#3cb371]
                        hover:bg-[#2e8b57]
                        text-[white]
                        py-[4px]
                        px-[12px]
                        rounded-[4px]
                        transition-colors
                        w-full
                        "
                        onClick={() => saveChanges(
                            isAverageInvalid
                            || isDeviationInvalid
                            || isMinInvalid
                            || isMaxInvalid
                            || isSampleSizeInvalid
                            || isDataTypeInvalid
                        )}
                    >
                        {t.newMacronutrient.save}
                    </button>
                    <button
                        className="
                        bg-[#cd5c5c]
                        hover:bg-[#b22222]
                        text-[white]
                        py-[4px]
                        px-[12px]
                        rounded-[4px]
                        transition-colors
                        w-full
                        "
                        onClick={cancelEditing}
                    >
                        {t.newMacronutrient.cancel}
                    </button>
                </div>
            </td>
        </tr>
    );
}
