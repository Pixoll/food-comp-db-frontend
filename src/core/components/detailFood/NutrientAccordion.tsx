import { Accordion, Table, Button } from "react-bootstrap";
import { useState } from "react";
import {
  NutrientsValue,
  NutrientMeasurement,
} from "../../types/SingleFoodResult";
import { BsQuestionCircle } from "react-icons/bs";
import CenteredModal from "./CenteredModal";
import "../../../assets/css/_nutrientAccordion.css";

interface NutrientAccordionProps {
  data: NutrientsValue;
}

const NutrientAccordion: React.FC<NutrientAccordionProps> = ({ data }) => {
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
                    (mainNutrient) =>
                      !mainNutrient.components ||
                      mainNutrient.components.length === 0
                  )
                  .map((mainNutrient, index) => (
                    <tr key={index}>
                      <td>{mainNutrient.name}</td>
                      <td>{mainNutrient.measurementUnit}</td>
                      <td>{mainNutrient.average}</td>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => handleOpenModal(mainNutrient)}
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
        <CenteredModal data={selectedNutrient} onHide={handleCloseModal} />
      )}
    </>
  );
};

export default NutrientAccordion;
