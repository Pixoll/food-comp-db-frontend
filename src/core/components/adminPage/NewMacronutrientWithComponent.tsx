import React, { useState } from "react";
import { Table, Card, Collapse, Button, Form } from "react-bootstrap";
import { NutrientMeasurementWithComponentsForm , NutrientMeasurementForm, NutrientSummary, getNutrientNameById} from "../../../pages/AdminPage";

type NewMacronutrientWithComponentProps = {
  macronutrientsWithComponents: NutrientMeasurementWithComponentsForm[];
  onMacronutrientUpdate: (
    updatedNutrient: NutrientMeasurementWithComponentsForm
  ) => void;
  nameAndIdNutrients: NutrientSummary[]
};


const NewMacronutrientWithComponent: React.FC<NewMacronutrientWithComponentProps> = ({ 
  macronutrientsWithComponents,
  onMacronutrientUpdate,
  nameAndIdNutrients
}) => {
  const [open, setOpen] = useState<Set<string >>(
    new Set(macronutrientsWithComponents.map((n) => n.nutrientId.toString() ))
  );
  const [editingComponentId, setEditingComponentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NutrientMeasurementForm | null>(null);
  
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
      referenceCodes: component.referenceCodes || []
    });

  };
  

  const handleInputChange = (field: keyof NutrientMeasurementForm, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
    console.log("formData")
    console.log(formData)
  };

  const saveChanges = () => {
    if (formData && editingComponentId !== null) {
      const updatedNutrients = macronutrientsWithComponents.map((nutrient) => {
        if (nutrient.components.some((component) => component.nutrientId === editingComponentId)) {
          const updatedComponents = nutrient.components.map((component) =>
            component.nutrientId === editingComponentId
              ? { ...component, ...formData } 
              : component
          );
          return { ...nutrient, components: updatedComponents }; 
        }
        return nutrient;
      });
  
      const updatedNutrient = updatedNutrients.find((nutrient) =>
        nutrient.components.some((component) => component.nutrientId === editingComponentId)
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
              {`${getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}`}
            </Button>
          </Card.Header>
          <Collapse in={open.has(nutrient.nutrientId.toString())}>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Nombre nutriente</th>
                    <th>Promedio</th>
                    <th>Desviación</th>
                    <th>Mínimo</th>
                    <th>Máximo</th>
                    <th>Tamaño de muestra</th>
                    <th>Tipo de dato</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {nutrient.components?.map((component) => (
                    <tr key={component.nutrientId}>
                      {editingComponentId === component.nutrientId ? (
                        <>
                          <td>{getNutrientNameById(component.nutrientId, nameAndIdNutrients)}</td>
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
                              <option value="analytic">Analítico</option>
                              <option value="calculated">Calculado</option>
                              <option value="assumed">Asumido</option>
                              <option value="borrowed">Prestado</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Button variant="success" onClick={saveChanges}>
                              Guardar
                            </Button>{" "}
                            <Button variant="danger" onClick={cancelEditing}>
                              Cancelar
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{getNutrientNameById(component.nutrientId, nameAndIdNutrients)}</td>
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
                              Editar
                            </Button>{" "}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Nutriente Padre:</strong> {getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}</td>
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
