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
import { PlusCircle } from 'lucide-react';
type NewReferencesProps = {
  references: Reference[];
  nutrientValueForm: NutrientsValueForm;
  nameAndIdNutrients: NutrientSummary[];
  onSelectReferenceForNutrients: (updatedForm: NutrientsValueForm) => void;
};
 const hasValidData = <T extends NutrientMeasurementForm>(
    nutrient: T
    // @ts-expect-error
  ): nutrient is Omit<T, "average" | "dataType"> & Required<Pick<T, "average" | "dataType">> => {
    return (
      typeof nutrient.average !== "undefined" &&
      typeof nutrient.dataType !== "undefined"
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
    <div className="references-container space-y-4 py-4">
      {references.map((ref, index) => (
        <Card
          key={index}
          className="shadow-lg border-0 overflow-hidden mb-4 hover:scale-[1.01] transition-transform duration-300"
        >
          <Row className="g-0 h-100 align-items-stretch">
            <Col md={9} className="p-4">
              <div className="space-y-2 h-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {ref.title}
                </h3>
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium capitalize">
                    {ref.type.toLowerCase()}
                  </span>
                  {ref.year && (
                    <span className="ml-2 text-gray-500">
                      • {ref.year}
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  {ref.authors && (
                    <div>
                      <span className="font-semibold">Autores:</span>{" "}
                      {ref.authors.join(", ")}
                    </div>
                  )}
                  {ref.journalName && (
                    <div>
                      <span className="font-semibold">Publicación:</span>{" "}
                      {ref.journalName}
                    </div>
                  )}
                  {ref.pageStart && ref.pageEnd && (
                    <div>
                      <span className="font-semibold">Páginas:</span>{" "}
                      {ref.pageStart} - {ref.pageEnd}
                    </div>
                  )}
                  {ref.city && (
                    <div>
                      <span className="font-semibold">Ciudad:</span>{" "}
                      {ref.city}
                    </div>
                  )}
                  {ref.other && (
                    <div>
                      <span className="font-semibold">Información adicional:</span>{" "}
                      {ref.other}
                    </div>
                  )}
                </div>
              </div>
            </Col>
            <Col
              md={3}
              className="d-flex"
            >
              <Button
                variant="success"
                className="w-100 d-flex align-items-center justify-content-center border-0 rounded-0 hover:bg-green-700 transition-colors duration-300"
                onClick={() => handleShowModal(index)}
              >
                <div className="text-center">
                  <PlusCircle className="mx-auto mb-2" size={24} />
                  <span className="d-block">Agregar</span>
                </div>
              </Button>
            </Col>
          </Row>
        </Card>
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