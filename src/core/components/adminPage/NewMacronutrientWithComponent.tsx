import React, { useState } from "react";
import { MacroNutrient } from "./getters/useNutrients";
import { Table, Card, Collapse, Button } from "react-bootstrap";
import CenteredModifyModal from "../detailFood/CenteredModifyModal";
import { NutrientMeasurement } from "../../types/SingleFoodResult";

const convertToNutrientMeasurement = (component: any): NutrientMeasurement => {
  return {
    nutrientId: component.id,
    name: component.name,
    measurementUnit: component.measurementUnit,
    average: component.average || 0,
    deviation: component.deviation,
    min: component.min,
    max: component.max,
    standardized: component.standardized,
    referenceCodes: component.referenceCodes || [],
    dataType: component.dataType
  };
};

type NewMacronutrientWithComponentProps = {
  macronutrientsWithComponents: MacroNutrient[];
};

const NewMacronutrientWithComponent: React.FC<
  NewMacronutrientWithComponentProps
> = ({ macronutrientsWithComponents }) => {
    const allCodes = macronutrientsWithComponents.map((macronutrient) =>macronutrient.id.toString())
  const [open, setOpen] = useState<Set<string>>(new Set(allCodes)); // Estado como conjunto de IDs abiertos
  const [showModal, setShowModal] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<NutrientMeasurement | null>(null);

  const toggleCollapse = (id: string) => {
    setOpen((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // Si ya está abierto, lo cierra
      } else {
        newSet.add(id); // Si está cerrado, lo abre
      }
      return newSet;
    });
  };

  const handleEdit = (component: any) => {
    const nutrientMeasurement = convertToNutrientMeasurement(component);
    setSelectedComponent(nutrientMeasurement);
    setShowModal(true);
  };

  const handleSave = (updatedData: NutrientMeasurement) => {
    setShowModal(false);
  };

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
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {nutrient.components?.map((component) => (
                    <tr key={component.id}>
                      <td>{component.name}</td>
                      <td>{component.measurementUnit}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleEdit(component)}
                        >
                          Modificar
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {/* Fila del total */}
                  <tr
                    style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}
                  >
                    <td>Total</td>
                    <td>{nutrient.measurementUnit}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(nutrient)}
                      >
                        Modificar Total
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Button
                variant="primary"
                onClick={() =>
                  handleEdit({
                    id: "new",
                    name: "Nuevo Componente",
                    measurementUnit: "unidad",
                    average: 0,
                    deviation: 0,
                    min: 0,
                    max: 0,
                    note: "",
                    standardized: false,
                  })
                }
              >
                Agregar Componente
              </Button>
            </Card.Body>
          </Collapse>
        </Card>
      ))}

      {showModal && selectedComponent && (
        <CenteredModifyModal
          data={selectedComponent}
          onHide={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default NewMacronutrientWithComponent;
