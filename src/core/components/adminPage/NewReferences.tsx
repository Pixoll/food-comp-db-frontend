import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { NutrientsValueForm, getNutrientNameById, NutrientSummary, NutrientMeasurementForm, NutrientMeasurementWithComponentsForm } from "../../../pages/AdminPage";
import { Reference } from "./getters/UseReferences";
import ModalReferences from "./ModalReferences";

type NewReferencesProps = {
  references: Reference[];
  nutrientValueForm: NutrientsValueForm;
  nameAndIdNutrients: NutrientSummary[];
};

const NewReferences: React.FC<NewReferencesProps> = ({ references, nutrientValueForm, nameAndIdNutrients }) => {
  const [modalsState, setModalsState] = useState<{ [key: number]: boolean }>({});
  const [selectedNutrientIds, setSelectedNutrientIds] = useState<number[]>([]);
  const [selectedReferenceIndex, setSelectedReferenceIndex] = useState<number | null>(null);

  type NutrientConvert = {
    id: number;
    name: string;
  };

  const convert = (): NutrientConvert[] => {
    const nutrientsConvert: NutrientConvert[] = [];

    nutrientValueForm.energy.forEach((energy) => {
      nutrientsConvert.push({
        id: energy.nutrientId,
        name: getNutrientNameById(energy.nutrientId, nameAndIdNutrients),
      });
    });

    nutrientValueForm.mainNutrients.forEach((mainNutrient) => {
      nutrientsConvert.push({
        id: mainNutrient.nutrientId,
        name: getNutrientNameById(mainNutrient.nutrientId, nameAndIdNutrients),
      });

      if (mainNutrient.components) {
        mainNutrient.components.forEach((component) => {
          nutrientsConvert.push({
            id: component.nutrientId,
            name: getNutrientNameById(component.nutrientId, nameAndIdNutrients),
          });
        });
      }
    });

    nutrientValueForm.micronutrients.minerals.forEach((mineral) => {
      nutrientsConvert.push({
        id: mineral.nutrientId,
        name: getNutrientNameById(mineral.nutrientId, nameAndIdNutrients),
      });
    });

    nutrientValueForm.micronutrients.vitamins.forEach((vitamin) => {
      nutrientsConvert.push({
        id: vitamin.nutrientId,
        name: getNutrientNameById(vitamin.nutrientId, nameAndIdNutrients),
      });
    });

    return nutrientsConvert;
  };

  const handleShowModal = (index: number) => {
    setModalsState((prev) => ({ ...prev, [index]: true }));
    setSelectedReferenceIndex(index);
  };

  const handleHideModal = (index: number) => {
    setModalsState((prev) => ({ ...prev, [index]: false }));
    setSelectedNutrientIds([]);
  };

  const handleAddReference = (ids: number[], reference: number) => {
    if (selectedReferenceIndex !== null && ids.length > 0) {
      const referenceCode = reference;
      const updatedForm = { ...nutrientValueForm };

      const updateNutrientReferences = (
        nutrientsArray: (NutrientMeasurementForm | NutrientMeasurementWithComponentsForm)[]
      ) => {
        nutrientsArray.forEach((nutrient) => {
          if (ids.includes(nutrient.nutrientId)) {
            nutrient.referenceCodes = nutrient.referenceCodes || [];
            if (!nutrient.referenceCodes.includes(referenceCode)) {
              nutrient.referenceCodes.push(referenceCode);
            }
          }

          if ("components" in nutrient) {
            updateNutrientReferences(nutrient.components);
          }
        });
      };

      updateNutrientReferences(updatedForm.energy);
      updateNutrientReferences(updatedForm.mainNutrients);
      updateNutrientReferences(updatedForm.micronutrients.minerals);
      updateNutrientReferences(updatedForm.micronutrients.vitamins);
      setModalsState((prev) => ({ ...prev, [selectedReferenceIndex]: false }));
    }
  };

  return (
    <div className="references-container">
      {references.map((ref, index) => (
        <Row key={index} className="mb-4 align-items-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-primary">{ref.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {ref.type.charAt(0).toUpperCase() + ref.type.slice(1)} - {ref.year || "Unknown Year"}
                </Card.Subtitle>
                <Card.Text>
                  {ref.authors && (
                    <div>
                      <strong>Authors:</strong> {ref.authors.join(", ")}
                    </div>
                  )}
                  {ref.journalName && (
                    <div>
                      <strong>Journal:</strong> {ref.journalName}
                    </div>
                  )}
                  {ref.pageStart && ref.pageEnd && (
                    <div>
                      <strong>Pages:</strong> {ref.pageStart} - {ref.pageEnd}
                    </div>
                  )}
                  {ref.city && (
                    <div>
                      <strong>City:</strong> {ref.city}
                    </div>
                  )}
                  {ref.other && (
                    <div>
                      <strong>Other:</strong> {ref.other}
                    </div>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="d-flex justify-content-center align-items-center">
            <Button variant="success" onClick={() => handleShowModal(index)}>
              Add
            </Button>
          </Col>
        </Row>
      ))}
      {references.map((ref, index) => (
        <ModalReferences
          key={index}
          nutrients={convert()}
          show={modalsState[index] || false}
          onHide={() => handleHideModal(index)}
          onSelectReferenceForNutrients={handleAddReference}
          selectedReference={ref.code}
        />
      ))}
    </div>
  );
};

export default NewReferences;
