import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  getNutrientNameById,
  NutrientMeasurementForm,
  NutrientSummary,
} from "../../../pages/AdminPage";
import { Ellipsis } from "lucide-react";
import "../../../assets/css/_NewNutrient.css";

type NewNutrientsProps = {
  nutrients: NutrientMeasurementForm[];
  onNutrientUpdate: (updatedNutrient: NutrientMeasurementForm) => void;
  nameAndIdNutrients: NutrientSummary[];
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

  const { t } = useTranslation();

  const startEditing = (nutrient: NutrientMeasurementForm) => {
    setEditingNutrientId(nutrient.nutrientId);
    setFormData({ ...nutrient });
  };

  const handleInputChange = (
    field: keyof NutrientMeasurementForm,
    value: any
  ) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
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
      <Table className="nutrients-table" bordered hover responsive>
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
                  <Form.Control
                    type="number"
                    value={formData?.average ?? ""}
                    isInvalid={isAverageInvalid}
                    onChange={(e) =>
                      handleInputChange("average", e.target.value.length > 0 ? +e.target.value : undefined)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {!isValueDefined("average") ? "Ingrese el promedio." : "Promedio debe ser al menos 0."}
                  </Form.Control.Feedback>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={formData?.deviation ?? ""}
                    isInvalid={isDeviationInvalid}
                    onChange={(e) =>
                      handleInputChange("deviation", e.target.value.length > 0 ? +e.target.value : undefined)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Desviación debe ser al menos 0.
                  </Form.Control.Feedback>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={formData?.min ?? ""}
                    isInvalid={isMinInvalid}
                    onChange={(e) =>
                      handleInputChange("min", e.target.value.length > 0 ? +e.target.value : undefined)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Mínimo debe ser al menos 0.
                  </Form.Control.Feedback>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={formData?.max ?? ""}
                    isInvalid={isMaxInvalid}
                    onChange={(e) =>
                      handleInputChange("max", e.target.value.length > 0 ? +e.target.value : undefined)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {isValueLessThan("max", 0)
                      ? "Máximo debe ser al menos 0."
                      : "Máximo debe ser mayor o igual al mínimo"}
                  </Form.Control.Feedback>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={formData?.sampleSize ?? ""}
                    isInvalid={isSampleSizeInvalid}
                    onChange={(e) =>
                      handleInputChange("sampleSize", e.target.value.length > 0 ? +e.target.value : undefined)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {isValueLessThan("sampleSize", 1)
                      ? "Tamaño de muestra debe ser al menos 1."
                      : "Tamaño de muestra debe ser un entero."}
                  </Form.Control.Feedback>
                </td>
                <td>
                  <Form.Select
                    value={formData?.dataType || ""}
                    isInvalid={isDataTypeInvalid}
                    onChange={(e) =>
                      handleInputChange("dataType", e.target.value)
                    }
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
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Ingrese el tipo de dato.
                  </Form.Control.Feedback>
                </td>
                <td>
                  <Button className="btn-save" onClick={saveChanges}>
                    {t("NewMacronutrient.save")}
                  </Button>{" "}
                  <Button className="btn-cancel" onClick={cancelEditing}>
                    {t("NewMacronutrient.cancel")}
                  </Button>
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
                  <Button
                    className="btn-edit"
                    onClick={() => startEditing(nutrient)}
                  >
                    {t("NewMacronutrient.Edit")}
                  </Button>
                </td>
              </>
            )}
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
  );
}
