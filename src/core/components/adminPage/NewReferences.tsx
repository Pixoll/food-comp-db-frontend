import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import {
  getNutrientNameById,
  NutrientMeasurementForm,
  NutrientMeasurementWithComponentsForm,
  NutrientSummary,
  NutrientsValueForm,
} from "../../../pages/AdminPage";
import Pagination from "../search/Pagination";
import { Reference } from "./getters";
import ModalReferences from "./ModalReferences";

type NewReferencesProps = {
  references: Reference[];
  nutrientValueForm: NutrientsValueForm;
  nameAndIdNutrients: NutrientSummary[];
  onSelectReferenceForNutrients: (updatedForm: NutrientsValueForm) => void;
};

type NutrientConvert = {
  id: number;
  name: string;
  selected: boolean;
};

const ITEMS_PER_PAGE = 5;

const hasValidData = <T extends NutrientMeasurementForm>(
  nutrient: T
  // @ts-expect-error
): nutrient is Omit<T, "average" | "dataType"> &
  Required<Pick<T, "average" | "dataType">> => {
  return (
    typeof nutrient.average !== "undefined" &&
    typeof nutrient.dataType !== "undefined"
  );
};

export default function NewReferences({
  references,
  nutrientValueForm,
  nameAndIdNutrients,
  onSelectReferenceForNutrients,
}: NewReferencesProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = references.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReferences = references.slice(startIndex, endIndex);

  const [modalsState, setModalsState] = useState<{ [key: number]: boolean }>({});
  const [selectedReferenceIndex, setSelectedReferenceIndex] = useState<number | null>(null);

  const convert = (): NutrientConvert[] => {
    const nutrientsConvert: NutrientConvert[] = [];

    const isReferenceAssigned = (
      nutrient: NutrientMeasurementForm,
      refCode: number
    ) => {
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

    const referenceCode = currentReferences[selectedReferenceIndex!]?.code;

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
    const globalIndex = startIndex + index;
    setModalsState((prev) => ({ ...prev, [globalIndex]: true }));
    setSelectedReferenceIndex(globalIndex);
  };

  const handleHideModal = (index: number) => {
    const globalIndex = startIndex + index; // Índice global
    setModalsState((prev) => ({ ...prev, [globalIndex]: false }));
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
          } else if (nutrient.referenceCodes) {
            nutrient.referenceCodes = nutrient.referenceCodes.filter(
              (code) => code !== referenceCode
            );
          }

          if ("components" in nutrient) {
            const components = nutrient.components as (
              | NutrientMeasurementForm
              | NutrientMeasurementWithComponentsForm
              )[];
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
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="references-container space-y-4 py-4">
      {currentReferences.map((ref, index) => (
        <Card
          key={ref.code}
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
                    <span className="ml-2 text-gray-500">• {ref.year}</span>
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
                      <span className="font-semibold">Ciudad:</span> {ref.city}
                    </div>
                  )}
                  {ref.other && (
                    <div>
                      <span className="font-semibold">
                        Información adicional:
                      </span>{" "}
                      {ref.other}
                    </div>
                  )}
                </div>
              </div>
            </Col>
            <Col md={3} className="d-flex">
              <Button
                variant="success"
                className="w-100 d-flex align-items-center justify-content-center border-0 rounded-0 hover:bg-green-700 transition-colors duration-300"
                onClick={() => handleShowModal(index)}
              >
                <div className="text-center">
                  <PlusCircle className="mx-auto mb-2" size={24}/>
                  <span className="d-block">Agregar</span>
                </div>
              </Button>
            </Col>
          </Row>
        </Card>
      ))}
      {currentReferences.map((ref, index) => (
        <ModalReferences
          key={ref.code}
          nutrients={convert()}
          show={modalsState[startIndex + index] || false}
          onHide={() => handleHideModal(index)}
          onSelectReferenceForNutrients={handleAddReference}
          selectedReference={ref.code}
        />
      ))}

      <Pagination
        currentPage={currentPage}
        npage={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
