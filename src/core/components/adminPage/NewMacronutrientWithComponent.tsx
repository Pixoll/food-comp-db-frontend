import React, { useState } from "react";
import { Table, Card, Collapse, Button, Form } from "react-bootstrap";
import { MacroNutrient, AnyNutrient } from "./getters/useNutrients";

export type NutrientMeasurementForm = {
  nutrientId?: number;
  average: number;
  deviation?: number;
  min?: number;
  max?: number;
  sampleSize?: number;
  dataType: "analytic" | "calculated" | "assumed" | "borrowed";
  referenceCodes?: number[];
};

type NewMacronutrientWithComponentProps = {
  macronutrientsWithComponents: MacroNutrient[];
};

const NewMacronutrientWithComponent: React.FC<
  NewMacronutrientWithComponentProps
> = ({ macronutrientsWithComponents }) => {
  const [open, setOpen] = useState<Set<string>>(
    new Set(macronutrientsWithComponents.map((n) => n.id.toString()))
  );

  const [editingComponentId, setEditingComponentId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<NutrientMeasurementForm | null>(
    null
  );

  const toggleCollapse = (id: string) => {
    setOpen((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const startEditing = (component: AnyNutrient | null) => {
    setEditingComponentId(component?.id || null);
    setFormData(
      component
        ? {
            nutrientId: component.id,
            average: 0, 
            deviation: 0,
            min: 0,
            max: 0,
            sampleSize: 0,
            dataType: "analytic",
          }
        : null
    );
  };

  const handleInputChange = (field: keyof NutrientMeasurementForm, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const saveChanges = () => {
    if (formData) {
      console.log("Guardando datos:", formData);
      setEditingComponentId(null);
      setFormData(null);
    }
  };

  const cancelEditing = () => {
    setEditingComponentId(null);
    setFormData(null);
  };

 /* const handleDeleteComponent = (nutrientId: number, componentId: number) => {
    setMacronutrientsWithComponents((prevState) => {
      return prevState.map((nutrient) => {
        if (nutrient.id === nutrientId) {
          return {
            ...nutrient,
            components: nutrient.components?.filter(
              (component) => component.id !== componentId
            ),
          };
        }
        return nutrient;
      });
    });
  };
  */

  return (
    <div>
      {macronutrientsWithComponents.map((nutrient) => (
        <Card key={nutrient.id} style={{ marginBottom: "15px" }}>
          <Card.Header>
            <Button
              onClick={() => toggleCollapse(nutrient.id.toString())}
              aria-controls={`collapse-${nutrient.id}`}
              aria-expanded={
                open.has(nutrient.id.toString()) ? "true" : "false"
              }
              variant="link"
              style={{ fontWeight: "bold", textDecoration: "none" }}
            >
              {nutrient.name}
            </Button>
          </Card.Header>
          <Collapse in={open.has(nutrient.id.toString())}>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Componente</th>
                    <th>Unidad de medida</th>
                    <th>Promedio</th>
                    <th>Mínimo</th>
                    <th>Máximo</th>
                    <th>Tamaño de muestra</th>
                    <th>Tipo de dato</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {nutrient.components?.map((component) => (
                    <tr key={component.id}>
                      {editingComponentId === component.id ? (
                        <>
                          <td>{component.name}</td>
                          <td>{component.measurementUnit}</td>
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
                          <td>{component.name}</td>
                          <td>{component.measurementUnit}</td>
                          <td>---</td>
                          <td>---</td>
                          <td>---</td>
                          <td>---</td>
                          <td>---</td>
                          <td>
                            <Button
                              variant="warning"
                              onClick={() => startEditing(component)}
                            >
                              Editar
                            </Button>{" "}
                            <Button
                              variant="danger"
                              
                            >
                              Eliminar
                            </Button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
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
