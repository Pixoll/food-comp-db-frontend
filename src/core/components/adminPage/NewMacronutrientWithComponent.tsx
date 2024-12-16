import { useState } from "react";
import { Button, Card, Collapse, Form, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Ellipsis } from "lucide-react";
import {
  getNutrientNameById,
  NutrientMeasurementForm,
  NutrientMeasurementWithComponentsForm,
  NutrientSummary,
} from "../../../pages/AdminPage";
import { NutrientMeasurementFormOnlyNumbers } from "./NewNutrients";

type NewMacronutrientWithComponentProps = {
  macronutrientsWithComponents: NutrientMeasurementWithComponentsForm[];
  onMacronutrientUpdate: (
    updatedNutrient: NutrientMeasurementWithComponentsForm
  ) => void;
  nameAndIdNutrients: NutrientSummary[];
};

export default function NewMacronutrientWithComponent({
  macronutrientsWithComponents,
  onMacronutrientUpdate,
  nameAndIdNutrients,
}: NewMacronutrientWithComponentProps) {
  const [open, setOpen] = useState<Set<string>>(
    new Set(macronutrientsWithComponents.map((n) => n.nutrientId.toString()))
  );
  const [editingComponentId, setEditingComponentId] = useState<number | undefined>(undefined);
  const [formData, setFormData] = useState<NutrientMeasurementForm | undefined>(undefined);
  const { t } = useTranslation();

  const toggleCollapse = (id: string) => {
    setOpen((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const startEditing = (component: NutrientMeasurementForm) => {
    setEditingComponentId(component.nutrientId);
    setFormData({ ...component });
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
          nutrient.nutrientId === editingComponentId ||
          nutrient.components.some(
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

  const cancelEditing = () => {
    setEditingComponentId(undefined);
    setFormData(undefined);
  };

  return (
    <div>
      {macronutrientsWithComponents.map((nutrient) => (
        <Card key={nutrient.nutrientId} className="card-of-new-nutrient">
          <Card.Header className="card-of-new-nutrient-header">
            <Button
              onClick={() => toggleCollapse(nutrient.nutrientId.toString())}
              aria-controls={`collapse-${nutrient.nutrientId}`}
              aria-expanded={open.has(nutrient.nutrientId.toString())}
              variant="link"
              className="card-of-new-nutrient-toggle"
            >
              {`${getNutrientNameById(
                nutrient.nutrientId,
                nameAndIdNutrients
              )}`}
            </Button>
          </Card.Header>
          <Collapse in={open.has(nutrient.nutrientId.toString())}>
            <Card.Body className="card-of-new-nutrient-collapse">
              <Table striped bordered hover responsive>
                <thead>
                <tr>
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
                <tbody>
                {/* Renderizado de los componentes hijos */}
                {nutrient.components?.map((component) => (
                  <tr key={component.nutrientId}>
                    {editingComponentId === component.nutrientId ? (
                      <>
                        <td>
                          {getNutrientNameById(
                            component.nutrientId,
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
                            <option value="analytic">{t("NewMacronutrient.Analytical")}</option>
                            <option value="calculated">{t("NewMacronutrient.Calculated")}</option>
                            <option value="assumed">{t("NewMacronutrient.Taken")}</option>
                            <option value="borrowed">{t("NewMacronutrient.Borrowed")}</option>
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
                            component.nutrientId,
                            nameAndIdNutrients
                          )}
                        </td>
                        <td>{component.average ?? <Ellipsis size={35}></Ellipsis>}</td>
                        <td>{component.deviation ?? <Ellipsis size={35}></Ellipsis>}</td>
                        <td>{component.min ?? <Ellipsis size={35}></Ellipsis>}</td>
                        <td>{component.max ?? <Ellipsis size={35}></Ellipsis>}</td>
                        <td>{component.sampleSize ?? <Ellipsis size={35}></Ellipsis>}</td>
                        <td>
                          {component.dataType
                            ? component.dataType.charAt(0).toUpperCase() +
                            component.dataType.slice(1)
                            : <Ellipsis size={35}></Ellipsis>}
                        </td>
                        <td>
                          <Button
                            className="btn-edit"
                            onClick={() => startEditing(component)}
                          >
                            {t("NewMacronutrient.Edit")}
                          </Button>{" "}
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {/* Renderizar la fila del nutriente padre */}
                <tr>
                  {editingComponentId === nutrient.nutrientId ? (
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
                          <option value="analytic">{t("NewMacronutrient.Analytical")}</option>
                          <option value="calculated">{t("NewMacronutrient.Calculated")}</option>
                          <option value="assumed">{t("NewMacronutrient.Taken")}</option>
                          <option value="borrowed">{t("NewMacronutrient.Borrowed")}</option>
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
                        <strong>
                          {getNutrientNameById(
                            nutrient.nutrientId,
                            nameAndIdNutrients
                          )}
                        </strong>
                      </td>
                      <td>{nutrient.average ?? <Ellipsis size={35}></Ellipsis>}</td>
                      <td>{nutrient.deviation ?? <Ellipsis size={35}></Ellipsis>}</td>
                      <td>{nutrient.min ?? <Ellipsis size={35}></Ellipsis>}</td>
                      <td>{nutrient.max ?? <Ellipsis size={35}></Ellipsis>}</td>
                      <td>{nutrient.sampleSize ?? <Ellipsis size={35}></Ellipsis>}</td>
                      <td>
                        {nutrient.dataType
                          ? nutrient.dataType.charAt(0).toUpperCase() +
                          nutrient.dataType.slice(1)
                          : <Ellipsis size={35}></Ellipsis>}
                      </td>
                      <td>
                        <Button
                          className="btn-edit"
                          onClick={() =>
                            startEditing({
                              ...nutrient,
                            })
                          }
                        >
                          {t("NewMacronutrient.Edit")}
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Collapse>
        </Card>
      ))}
    </div>
  );
}
