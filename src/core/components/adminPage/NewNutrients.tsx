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

export default function NewNutrients({
  nutrients,
  onNutrientUpdate,
  nameAndIdNutrients,
}: NewNutrientsProps) {
  const [editingNutrientId, setEditingNutrientId] = useState<
    number | undefined
  >(undefined);
  const [formData, setFormData] = useState<NutrientMeasurementForm | undefined>(
    undefined
  );
  const [validationErrors, setValidationErrors] = useState<{
    average?: string;
    deviation?: string;
    min?: string;
    max?: string;
    sampleSize?: string;
  }>({});

  const validateField = (field: string, value: number | undefined) => {
    switch (field) {
      case "average":
      case "deviation":
        return value !== undefined && value >= 0;
      case "min":
        return value !== undefined && value >= 0;
      case "max":
        const minValue = formData?.min;
        return (
          value !== undefined && 
          value >= 0 && 
          (minValue === undefined || value >= minValue)
        );
      case "sampleSize":
        return value !== undefined && 
               Number.isInteger(value) && 
               value >= 0;
      default:
        return true;
    }
  };
  const { t } = useTranslation();

  const startEditing = (nutrient: NutrientMeasurementForm) => {
    setEditingNutrientId(nutrient.nutrientId);
    setFormData({
      ...nutrient,
      average: nutrient.average || undefined,
      deviation: nutrient.deviation || undefined,
      min: nutrient.min || undefined,
      max: nutrient.max || undefined,
      sampleSize: nutrient.sampleSize || undefined,
      dataType: nutrient.dataType || undefined,
      referenceCodes: nutrient.referenceCodes || [],
    });
    setValidationErrors({});
  };

  const handleInputChange = (
    field: keyof NutrientMeasurementForm,
    value: any
  ) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
  };
}
const getErrorMessage = (field: string) => {
  switch (field) {
    case "average":
      return "Promedio no puede ser negativo";
    case "deviation":
      return "Desviación no puede ser negativa";
    case "min":
      return "Mínimo invalido";
    case "max":
      return "Máximo invalido";
    case "sampleSize":
      return "Tamaño de muestra invalido";
    default:
      return "";
  }
};
  const isFormValid = () => {
    return Object.values(validationErrors).every(
      (error) => error === undefined
    );
  };
  const saveChanges = () => {
    const fieldsToValidate: (keyof NutrientMeasurementForm)[] = [
      "average",
      "deviation",
      "min",
      "max",
      "sampleSize",
    ];
    
    const errors: { [key: string]: string } = {};
    
    fieldsToValidate.forEach((field) => {
      const value = formData?.[field];
      if (!validateField(field, value as number)) {
        errors[field] = getErrorMessage(field);
      }
    });

    if (formData?.min && formData?.max && formData.min > formData.max) {
      errors['min'] = 'Mínimo no puede ser mayor a Máximo';
      errors['max'] = 'Máximo no puede ser mayor a Mínimo';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Proceed with update if validation passes
    if (formData && editingNutrientId !== undefined) {
      onNutrientUpdate(formData);
      setEditingNutrientId(undefined);
      setFormData(undefined);
      setValidationErrors({});
    }
  };

  const cancelEditing = () => {
    setEditingNutrientId(undefined);
    setFormData(undefined);
    setValidationErrors({});
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
                      onChange={(e) =>
                        handleInputChange("average", +e.target.value)
                      }
                      isInvalid={!!validationErrors.average}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.average}
                    </Form.Control.Feedback>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.deviation ?? ""}
                      onChange={(e) =>
                        handleInputChange("deviation", +e.target.value)
                      }
                      isInvalid={!!validationErrors.deviation}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.deviation}
                    </Form.Control.Feedback>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.min ?? ""}
                      onChange={(e) =>
                        handleInputChange("min", +e.target.value)
                      }
                      isInvalid={!!validationErrors.min}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.min}
                    </Form.Control.Feedback>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.max ?? ""}
                      onChange={(e) =>
                        handleInputChange("max", +e.target.value)
                      }
                      isInvalid={!!validationErrors.max}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.max}
                    </Form.Control.Feedback>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.sampleSize ?? ""}
                      onChange={(e) =>
                        handleInputChange("sampleSize", +e.target.value)
                      }
                      isInvalid={!!validationErrors.sampleSize}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.sampleSize}
                    </Form.Control.Feedback>
                  </td>
                  <td>
                    <Form.Select
                      value={formData?.dataType || ""}
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
                  <td>{nutrient.average || <Ellipsis size={35}></Ellipsis>}</td>
                  <td>
                    {nutrient.deviation || <Ellipsis size={35}></Ellipsis>}
                  </td>
                  <td>{nutrient.min || <Ellipsis size={35}></Ellipsis>}</td>
                  <td>{nutrient.max || <Ellipsis size={35}></Ellipsis>}</td>
                  <td>
                    {nutrient.sampleSize || <Ellipsis size={35}></Ellipsis>}
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
