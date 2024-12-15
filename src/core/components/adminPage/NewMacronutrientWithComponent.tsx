import { useState } from "react";
import { Button, Card, Collapse, Form, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {Ellipsis} from "lucide-react"
import {
  getNutrientNameById,
  NutrientMeasurementForm,
  NutrientMeasurementWithComponentsForm,
  NutrientSummary,
} from "../../../pages/AdminPage";


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
  const [editingComponentId, setEditingComponentId] = useState<number | undefined>(
    undefined
  );
  const [formData, setFormData] = useState<NutrientMeasurementForm | undefined>(
    undefined
  );
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
    setFormData({
      ...component,
      average: component.average || undefined,
      deviation: component.deviation || undefined,
      min: component.min || undefined,
      max: component.max || undefined,
      sampleSize: component.sampleSize || undefined,
      dataType: component.dataType || undefined,
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

    console.log(formData);
  };

  const saveChanges = () => {
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
                          > <option value="" disabled></option>
                            <option value="analytic">{t("NewMacronutrient.Analytical")}</option>
                            <option value="calculated">{t("NewMacronutrient.Calculated")}</option>
                            <option value="assumed">{t("NewMacronutrient.Taken")}</option>
                            <option value="borrowed">{t("NewMacronutrient.Borrowed")}</option>
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
                            component.nutrientId,
                            nameAndIdNutrients
                          )}
                        </td>
                        <td>{component.average || <Ellipsis size={35}></Ellipsis>}</td>
                        <td>{component.deviation || <Ellipsis size={35}></Ellipsis>}</td>
                        <td>{component.min || <Ellipsis size={35}></Ellipsis>}</td>
                        <td>{component.max || <Ellipsis size={35}></Ellipsis>}</td>
                        <td>{component.sampleSize || <Ellipsis size={35}></Ellipsis>}</td>
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
                            <option value="analytic">{t("NewMacronutrient.Analytical")}</option>
                            <option value="calculated">{t("NewMacronutrient.Calculated")}</option>
                            <option value="assumed">{t("NewMacronutrient.Taken")}</option>
                            <option value="borrowed">{t("NewMacronutrient.Borrowed")}</option>
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
};
