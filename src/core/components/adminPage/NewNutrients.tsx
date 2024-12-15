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
  const [editingNutrientId, setEditingNutrientId] = useState<number | undefined>(
    undefined
  );
  const [formData, setFormData] = useState<NutrientMeasurementForm | undefined>(
    undefined
  );
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
  };

  const handleInputChange = (
    field: keyof NutrientMeasurementForm,
    value: any
  ) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const saveChanges = () => {
    if (formData && editingNutrientId !== null) {
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
                      value={formData?.average || ""}
                      onChange={(e) =>
                        handleInputChange("average", +e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.deviation || ""}
                      onChange={(e) =>
                        handleInputChange("deviation", +e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.min || ""}
                      onChange={(e) =>
                        handleInputChange("min", +e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.max || ""}
                      onChange={(e) =>
                        handleInputChange("max", +e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.sampleSize || ""}
                      onChange={(e) =>
                        handleInputChange("sampleSize", +e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Select
                      value={formData?.dataType || ""}
                      onChange={(e) =>
                        handleInputChange("dataType", e.target.value)
                      }
                    >
                      <option value="" disabled></option>
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
