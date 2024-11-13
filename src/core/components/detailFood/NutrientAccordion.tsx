import { Accordion, Table, Button } from "react-bootstrap";
import { useState } from "react";
import "../../../assets/css/_nutrientAccordion.css"
import {
  NutrientsValue,
  NutrientMeasurement,
} from "../../types/SingleFoodResult";
import { BsQuestionCircle } from "react-icons/bs";
import CenteredModal from "./CenteredModal";
import "../../../assets/css/_nutrientAccordion.css";

interface NutrientAccordionProps {
  data: NutrientsValue;
  onReferenceClick: (code: string) => void;
}

const NutrientAccordion: React.FC<NutrientAccordionProps> = ({
  data,
  onReferenceClick,
}) => {
  const [selectedNutrient, setSelectedNutrient] =
    useState<NutrientMeasurement | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (nutrient: NutrientMeasurement) => {
    setSelectedNutrient(nutrient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNutrient(null);
  };
  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Valor energetico</Accordion.Header>
          <Accordion.Body>
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Unidad</th>
                  <th>Promedio</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {data.energy.map((energy, index) => (
                  <tr key={index}>
                    <td>{energy.name}</td>
                    <td>{energy.measurementUnit}</td>
                    <td>{energy.average}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => handleOpenModal(energy)}
                      >
                        <BsQuestionCircle size={30} color="green" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Nutrientes principales</Accordion.Header>
          <Accordion.Body>
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Unidad</th>
                  <th>Promedio</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {data.mainNutrients
                  .filter(
                    (nutrient) =>
                      !nutrient.components || nutrient.components.length === 0
                  )
                  .map((nutrient, index) => (
                    <tr key={index}>
                      <td>{nutrient.name}</td>
                      <td>{nutrient.measurementUnit}</td>
                      <td>{nutrient.average}</td>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => handleOpenModal(nutrient)}
                        >
                          <BsQuestionCircle size={30} color="green" />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {data.mainNutrients
              .filter(
                (nutrient) =>
                  nutrient.components && nutrient.components.length > 0
              )
              .map((nutrient, index) => (
                <Accordion
                  key={`sub-${index}`}
                  defaultActiveKey={`sub-${index}`}
                >
                  <Accordion.Item eventKey={`sub-${index}`}>
                    <Accordion.Header>{nutrient.name}</Accordion.Header>
                    <Accordion.Body>
                      <Table responsive="sm">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Unidad</th>
                            <th>Promedio</th>
                            <th>Detalles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nutrient.components.map((subComponent, subIndex) => (
                            <tr key={subIndex}>
                              <td>{subComponent.name}</td>
                              <td>{subComponent.measurementUnit}</td>
                              <td>{subComponent.average}</td>
                              <td>
                                <Button
                                  variant="link"
                                  onClick={() => handleOpenModal(subComponent)}
                                >
                                  <BsQuestionCircle size={30} color="green" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Micronutrientes</Accordion.Header>
          <Accordion.Body>
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Unidad</th>
                  <th>Promedio</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {data.micronutrients.minerals.map((micronutrient, index) => (
                  <tr key={index}>
                    <td>{micronutrient.name}</td>
                    <td>{micronutrient.measurementUnit}</td>
                    <td>{micronutrient.average}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => handleOpenModal(micronutrient)}
                      >
                        <BsQuestionCircle size={30} color="green" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {data.micronutrients.vitamins.map((micronutrient, index) => (
                  <tr key={index}>
                    <td>{micronutrient.name}</td>
                    <td>{micronutrient.measurementUnit}</td>
                    <td>{micronutrient.average}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => handleOpenModal(micronutrient)}
                      >
                        <BsQuestionCircle size={30} color="green" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {showModal && selectedNutrient && (
        <CenteredModal
          data={selectedNutrient}
          onHide={handleCloseModal}
          onReferenceClick={onReferenceClick}
        />
      )}
    </>
  );
};

export default NutrientAccordion;
