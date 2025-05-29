
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {
    NutrientMeasurementForm,
    NutrientSummary,
} from "@/pages/AdminPage";
import {Ellipsis} from "lucide-react";
import TextField from "@/app/components/TextField";
import NumericField from "@/app/components/NumericField";
import "@/assets/css/_NewNutrient.css";

type NewNutrientsProps = {
    nutrients: NutrientMeasurementForm[];
    onNutrientUpdate: (updatedNutrient: NutrientMeasurementForm) => void;
    nameAndIdNutrients: NutrientSummary[];
};
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
        <div className="new-nutrients-container">
            <table className="nutrients-table">
                <thead>
                <tr className="table-new-nutrients-header">
                    <th>{t("NewMacronutrient.name")}</th>
                    <th>{t("NewMacronutrient.mean")}</th>
                    <th>{t("NewMacronutrient.Deviation")}</th>
                    <th>{t("NewMacronutrient.min")}</th>
                    <th>{t("NewMacronutrient.max")}</th>
                    <th>{t("NewMacronutrient.Size")}</th>
                    <th>{t("NewMacronutrient.type")}</th>
                    <th>{t("NewMacronutrient.Action")}</th>
                </tr>
                </thead>
                <tbody className="table-new-nutrients-body">
                {nutrients.map((nutrient) => (
                    <tr key={nutrient.nutrientId} className="nutrient-row">
                        {editingNutrientId === nutrient.nutrientId ? (
                            <>
                                <td>
                                    {getNutrientNameById(
                                        nutrient.nutrientId,
                                        nameAndIdNutrients
                                    )}
                                </td>
                                <td>
                                    <NumericField
                                        value={formData?.average}
                                        error={isAverageInvalid}
                                        errorMessage={!isValueDefined("average")
                                            ? "Ingrese el promedio."
                                            : "Promedio debe ser al menos 0."}
                                        onChange={(value) => handleInputChange("average", value)}
                                        allowDecimals={true}
                                        min={0}
                                    />
                                </td>
                                <td>
                                    <NumericField
                                        value={formData?.deviation}
                                        error={isDeviationInvalid}
                                        errorMessage="Desviación debe ser al menos 0."
                                        onChange={(value) => handleInputChange("deviation", value)}
                                        allowDecimals={true}
                                        min={0}
                                    />
                                </td>
                                <td>
                                    <NumericField
                                        value={formData?.min}
                                        error={isMinInvalid}
                                        errorMessage="Mínimo debe ser al menos 0."
                                        onChange={(value) => handleInputChange("min", value)}
                                        allowDecimals={true}
                                        min={0}
                                    />
                                </td>
                                <td>
                                    <NumericField
                                        value={formData?.max}
                                        error={isMaxInvalid}
                                        errorMessage={isValueLessThan("max", 0)
                                            ? "Máximo debe ser al menos 0."
                                            : "Máximo debe ser mayor o igual al mínimo"}
                                        onChange={(value) => handleInputChange("max", value)}
                                        allowDecimals={true}
                                        min={formData?.min ?? 0}
                                    />
                                </td>
                                <td>
                                    <NumericField
                                        value={formData?.sampleSize}
                                        error={isSampleSizeInvalid}
                                        errorMessage={isValueLessThan("sampleSize", 1)
                                            ? "Tamaño de muestra debe ser al menos 1."
                                            : "Tamaño de muestra debe ser un entero."}
                                        onChange={(value) => handleInputChange("sampleSize", value)}
                                        allowDecimals={false}
                                        min={1}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        value={formData?.dataType || ""}
                                        error={isDataTypeInvalid}
                                        errorMessage="Ingrese el tipo de dato."
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
                                    </TextField>
                                </td>
                                <td>
                                    <button className="btn-save" onClick={saveChanges}>
                                        {t("NewMacronutrient.save")}
                                    </button>
                                    {" "}
                                    <button className="btn-cancel" onClick={cancelEditing}>
                                        {t("NewMacronutrient.cancel")}
                                    </button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>
                                    {getNutrientNameById(
                                        nutrient.nutrientId,
                                        nameAndIdNutrients
                                    )}
                                </td>
                                <td>{nutrient.average ?? <Ellipsis size={35}></Ellipsis>}</td>
                                <td>
                                    {nutrient.deviation ?? <Ellipsis size={35}></Ellipsis>}
                                </td>
                                <td>{nutrient.min ?? <Ellipsis size={35}></Ellipsis>}</td>
                                <td>{nutrient.max ?? <Ellipsis size={35}></Ellipsis>}</td>
                                <td>
                                    {nutrient.sampleSize ?? <Ellipsis size={35}></Ellipsis>}
                                </td>
                                <td>
                                    {nutrient.dataType ? (
                                        nutrient.dataType.charAt(0).toUpperCase() +
                                        nutrient.dataType.slice(1)
                                    ) : (
                                        <Ellipsis size={35}></Ellipsis>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="btn-edit"
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
    );
}
