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
    note: component.note,
    referenceCodes: component.referenceCodes || [],
  };
};

type NewMacronutrientWithComponentProps = {
  macronutrientsWithComponents: MacroNutrient[];
};

const NewMacronutrientWithComponent: React.FC<NewMacronutrientWithComponentProps> = ({
  macronutrientsWithComponents,
}) => {
  const [open, setOpen] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<NutrientMeasurement | null>(null);

  const toggleCollapse = (id: string) => {
    setOpen(open === id ? null : id);
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
              aria-expanded={open === nutrient.id.toString() ? "true" : "false"}
              variant="link"
              style={{ fontWeight: "bold", textDecoration: "none" }}
            >
              {nutrient.name}
            </Button>
          </Card.Header>
          <Collapse in={open === nutrient.id.toString()}>
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
                        <Button variant="warning" onClick={() => handleEdit(component)}>
                          Modificar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button
                variant="primary"
                onClick={() =>
                  handleEdit({
                    id: "nose", //
                    name: "nose",
                    measurementUnit: "nose",
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
