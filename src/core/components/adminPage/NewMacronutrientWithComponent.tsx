import React, { useState } from "react";
import { Table, Card, Collapse, Button, Form } from "react-bootstrap";
import {
  NutrientMeasurementWithComponentsForm,
  NutrientMeasurementForm,
  NutrientSummary,
  getNutrientNameById,
} from "../../../pages/AdminPage";
import { useTranslation } from "react-i18next";

type NewMacronutrientWithComponentProps = {
  macronutrientsWithComponents: NutrientMeasurementWithComponentsForm[];
  onMacronutrientUpdate: (
    updatedNutrient: NutrientMeasurementWithComponentsForm
  ) => void;
  nameAndIdNutrients: NutrientSummary[];
};

const NewMacronutrientWithComponent: React.FC<
  NewMacronutrientWithComponentProps
> = ({
  macronutrientsWithComponents,
  onMacronutrientUpdate,
  nameAndIdNutrients,
}) => {
  const [open, setOpen] = useState<Set<string>>(
    new Set(macronutrientsWithComponents.map((n) => n.nutrientId.toString()))
  );
  const [editingComponentId, setEditingComponentId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<NutrientMeasurementForm | null>(
    null
  );
  const { t } = useTranslation("global");

  const toggleCollapse = (id: string) => {
    setOpen((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const startEditing = (component: NutrientMeasurementForm) => {
    setEditingComponentId(component.nutrientId);
    setFormData({
      ...component,
      average: component.average || null,
      deviation: component.deviation || null,
      min: component.min || null,
      max: component.max || null,
      sampleSize: component.sampleSize || null,
      dataType: component.dataType || null,
      referenceCodes: component.referenceCodes || [],
    });
  };

  const handleInputChange = (
    field: keyof NutrientMeasurementForm,
    value: any
  ) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
    console.log("formData");
    console.log(formData);
  };

  const saveChanges = () => {
    if (formData && editingComponentId !== null) {
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

      setEditingComponentId(null);
      setFormData(null);
    }
  };

  const cancelEditing = () => {
    setEditingComponentId(null);
    setFormData(null);
  };

  return (
    <div>
      {macronutrientsWithComponents.map((nutrient) => (
        <Card key={nutrient.nutrientId} style={{ marginBottom: "15px" }}>
          <Card.Header>
            <Button
              onClick={() => toggleCollapse(nutrient.nutrientId.toString())}
              aria-controls={`collapse-${nutrient.nutrientId}`}
              aria-expanded={open.has(nutrient.nutrientId.toString())}
              variant="link"
              style={{ fontWeight: "bold", textDecoration: "none" }}
            >
              {`${getNutrientNameById(
                nutrient.nutrientId,
                nameAndIdNutrients
              )}`}
            </Button>
          </Card.Header>
          <Collapse in={open.has(nutrient.nutrientId.toString())}>
            <Card.Body>
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
                              value={formData?.dataType || "analytic"}
                              onChange={(e) =>
                                handleInputChange("dataType", e.target.value)
                              }
                            >
                              <option value="analytic">{t("NewMacronutrient.Analytical")}</option>
                              <option value="calculated">{t("NewMacronutrient.Calculated")}</option>
                              <option value="assumed">{t("NewMacronutrient.Taken")}</option>
                              <option value="borrowed">{t("NewMacronutrient.Borrowed")}</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Button variant="success" onClick={saveChanges}>
                            {t("NewMacronutrient.save")}
                            </Button>{" "}
                            <Button variant="danger" onClick={cancelEditing}>
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
                          <td>{component.deviation || "---"}</td>
                          <td>{component.average || "---"}</td>
                          <td>{component.min || "---"}</td>
                          <td>{component.max || "---"}</td>
                          <td>{component.sampleSize || "---"}</td>
                          <td>
                            {component.dataType
                              ? component.dataType.charAt(0).toUpperCase() +
                                component.dataType.slice(1)
                              : "---"}
                          </td>
                          <td>
                            <Button
                              variant="warning"
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
                            value={formData?.dataType || "analytic"}
                            onChange={(e) =>
                              handleInputChange("dataType", e.target.value)
                            }
                          >
                            <option value="analytic">{t("NewMacronutrient.Analytical")}</option>
                            <option value="calculated">{t("NewMacronutrient.Calculated")}</option>
                            <option value="assumed">{t("NewMacronutrient.Taken")}</option>
                            <option value="borrowed">{t("NewMacronutrient.Borrowed")}</option>
                          </Form.Select>
                        </td>
                        <td>
                          <Button variant="success" onClick={saveChanges}>
                          {t("NewMacronutrient.save")}
                          </Button>{" "}
                          <Button variant="danger" onClick={cancelEditing}>
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
                        <td>{nutrient.deviation || "---"}</td>
                        <td>{nutrient.average || "---"}</td>
                        <td>{nutrient.min || "---"}</td>
                        <td>{nutrient.max || "---"}</td>
                        <td>{nutrient.sampleSize || "---"}</td>
                        <td>
                          {nutrient.dataType
                            ? nutrient.dataType.charAt(0).toUpperCase() +
                              nutrient.dataType.slice(1)
                            : "---"}
                        </td>
                        <td>
                          <Button
                            variant="warning"
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
};

export default NewMacronutrientWithComponent;
