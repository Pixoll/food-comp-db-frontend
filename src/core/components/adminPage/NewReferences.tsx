import React, { useState } from "react";
import { Card, Row, Col, Button} from "react-bootstrap";
import {
  NutrientsValueForm,
  getNutrientNameById,
  NutrientSummary,
  NutrientMeasurementForm,
  NutrientMeasurementWithComponentsForm,
} from "../../../pages/AdminPage";
import { Reference } from "./getters/UseReferences";
import ModalReferences from "./ModalReferences";

type NewReferencesProps = {
  references: Reference[];
  nutrientValueForm: NutrientsValueForm;
  nameAndIdNutrients: NutrientSummary[];
  onSelectReferenceForNutrients: (updatedForm: NutrientsValueForm) => void;
};
const hasValidData = (nutrient: NutrientMeasurementForm): boolean => {
    return (
      nutrient.average !== null  &&
      nutrient.dataType !== null
    );
  };
const NewReferences: React.FC<NewReferencesProps> = ({
  references,
  nutrientValueForm,
  nameAndIdNutrients,
  onSelectReferenceForNutrients
}) => {
  const [modalsState, setModalsState] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [selectedNutrientIds, setSelectedNutrientIds] = useState<number[]>([]);
  const [selectedReferenceIndex, setSelectedReferenceIndex] = useState<
    number | null
  >(null);

  type NutrientConvert = {
    id: number;
    name: string;
    selected: boolean;
  };
  const convert = (): NutrientConvert[] => {
    const nutrientsConvert: NutrientConvert[] = [];
  
    const isReferenceAssigned = (nutrient: NutrientMeasurementForm, refCode: number) => {
      return nutrient.referenceCodes?.includes(refCode);
    };
  
    const addNutrientWithSelection = (
      nutrient: NutrientMeasurementForm,
      refCode: number
    ) => {
      nutrientsConvert.push({
        id: nutrient.nutrientId,
        name: getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients),
        selected: isReferenceAssigned(nutrient, refCode),
      });
    };
  
    const referenceCode = references[selectedReferenceIndex!]?.code;
  
    nutrientValueForm.energy
      .filter(hasValidData)
      .forEach((energy) => addNutrientWithSelection(energy, referenceCode));
  
    nutrientValueForm.mainNutrients
      .filter(hasValidData)
      .forEach((mainNutrient) => {
        addNutrientWithSelection(mainNutrient, referenceCode);
  
        if (mainNutrient.components) {
          mainNutrient.components
            .filter(hasValidData)
            .forEach((component) =>
              addNutrientWithSelection(component, referenceCode)
            );
        }
      });
  
    nutrientValueForm.micronutrients.minerals
      .filter(hasValidData)
      .forEach((mineral) => addNutrientWithSelection(mineral, referenceCode));
  
    nutrientValueForm.micronutrients.vitamins
      .filter(hasValidData)
      .forEach((vitamin) => addNutrientWithSelection(vitamin, referenceCode));
  
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
    if (selectedReferenceIndex !== null) {
      const referenceCode = reference;
      const updatedForm = { ...nutrientValueForm };
  
      const updateNutrientReferences = (
        nutrientsArray: (
          | NutrientMeasurementForm
          | NutrientMeasurementWithComponentsForm
        )[]
      ) => {
        nutrientsArray.forEach((nutrient) => {
          if (ids.includes(nutrient.nutrientId)) {
            nutrient.referenceCodes = nutrient.referenceCodes || [];
            if (!nutrient.referenceCodes.includes(referenceCode)) {
              nutrient.referenceCodes.push(referenceCode);
            }
          }
          else if (nutrient.referenceCodes) {
            nutrient.referenceCodes = nutrient.referenceCodes.filter(
              (code) => code !== referenceCode
            );
          }
  
          if ("components" in nutrient) {
            const components = nutrient.components as (NutrientMeasurementForm | NutrientMeasurementWithComponentsForm)[];
            updateNutrientReferences(components);
          }
        });
      };
  
      updateNutrientReferences(updatedForm.energy);
      updateNutrientReferences(updatedForm.mainNutrients);
      updateNutrientReferences(updatedForm.micronutrients.minerals);
      updateNutrientReferences(updatedForm.micronutrients.vitamins);
  
      onSelectReferenceForNutrients(updatedForm);
  
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
                  {ref.type.charAt(0).toUpperCase() + ref.type.slice(1)} -{" "}
                  {ref.year || "Unknown Year"}
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
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <Button variant="success" onClick={() => handleShowModal(index)}>
              Agregar
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
