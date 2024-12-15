import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import "../../../assets/css/_nutrientAccordion.css";
import { Accordion, Button, Card, Col, Container, Row, Table, } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { NutrientMeasurement, NutrientMeasurementWithComponents, NutrientsValue, } from "../../types/SingleFoodResult";
import CenteredModifyModal from "./CenteredModifyModal";

interface NutrientAccordionProps {
  data: NutrientsValue;
  onUpdate: (updatedData: NutrientsValue) => void;
}

export default function NutrientAccordionModify({ data, onUpdate }: NutrientAccordionProps) {
  const { t } = useTranslation();
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
  const [, setNutrientData] = useState<NutrientsValue>(data);

  const handleSave = (
    updatedNutrient: NutrientMeasurement | NutrientMeasurementWithComponents
  ) => {
    setNutrientData((prevData) => {
      const updateCategory = (
        category: NutrientMeasurementWithComponents[] | NutrientMeasurement[]
      ) =>
        category.map((item) =>
          item.nutrientId === updatedNutrient.nutrientId
            ? { ...item, ...updatedNutrient }
            : item
        );

      const updatedData = {
        ...prevData,
        energy: updateCategory(prevData.energy),
        mainNutrients: prevData.mainNutrients.map((nutrient) => {
          if (nutrient.nutrientId === updatedNutrient.nutrientId) {
            return { ...nutrient, ...updatedNutrient };
          }
          if (nutrient.components) {
            return {
              ...nutrient,
              components: updateCategory(nutrient.components),
            };
          }
          return nutrient;
        }),
        micronutrients: {
          vitamins: updateCategory(prevData.micronutrients.vitamins),
          minerals: updateCategory(prevData.micronutrients.minerals),
        },
      };

      onUpdate(updatedData);
      return updatedData;
    });
  };
  useEffect(() => {
    setNutrientData(data);
  }, [data]);

  const renderNutrientTable = (
    nutrients: NutrientMeasurement[],
    title: string
  ) => (
    <Table responsive hover striped className="align-middle">
      <thead className="table-light">
      <tr>
        <th>{t("nutrientAccordion.name")}</th>
        <th className="text-center">{t("nutrientAccordion.modify")}</th>
      </tr>
      </thead>
      <tbody>
      {nutrients.map((nutrient, index) => (
        <tr key={index}>
          <td>
            {nutrient.name}
            {nutrient.measurementUnit ? `(${nutrient.measurementUnit})` : ""}
          </td>
          <td className="text-center">
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => handleOpenModal(nutrient)}
              className="d-flex align-items-center justify-content-center mx-auto"
            >
              <Edit2 size={18} className="me-1"/>
              Editar
            </Button>
          </td>
        </tr>
      ))}
      </tbody>
    </Table>
  );

  return (
    <Container fluid>
      <Card className="shadow-sm">
        <Card.Header as="h5" className="bg-light">
          Información nutricional
        </Card.Header>
        <Card.Body>
          <Accordion defaultActiveKey={["0", "1", "2"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                {t("nutrientAccordion.Energy")}
              </Accordion.Header>
              <Accordion.Body>
                {renderNutrientTable(
                  data.energy,
                  t("nutrientAccordion.Energy")
                )}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>{t("nutrientAccordion.Main")}</Accordion.Header>
              <Accordion.Body>
                <Card className="mb-3">
                  <Card.Header>
                    Nutrientes principales
                  </Card.Header>
                  <Card.Body>
                    {renderNutrientTable(
                      data.mainNutrients.filter(
                        (n) => !n.components || n.components.length === 0
                      ),
                      "Nutrientes principales"
                    )}
                  </Card.Body>
                </Card>
                {data.mainNutrients
                  .filter(
                    (nutrient) =>
                      nutrient.components && nutrient.components.length > 0
                  )
                  .map((nutrient, index) => (
                    <Accordion key={`sub-${index}`} className="mb-2">
                      <Accordion.Item eventKey={`sub-${index}`}>
                        <Accordion.Header>{nutrient.name}</Accordion.Header>
                        <Accordion.Body>
                          <Table responsive hover striped>
                            <thead>
                            <tr>
                              <th>{t("nutrientAccordion.name")}</th>
                              <th className="text-center">
                                {t("nutrientAccordion.modify")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                            {nutrient.components.map(
                              (subComponent, subIndex) => (
                                <tr key={subIndex}>
                                  <td>{subComponent.name}</td>
                                  <td className="text-center">
                                    <Button
                                      variant="outline-warning"
                                      size="sm"
                                      onClick={() =>
                                        handleOpenModal(subComponent)
                                      }
                                      className="d-flex align-items-center justify-content-center mx-auto"
                                    >
                                      <Edit2 size={18} className="me-1"/>
                                      Editar
                                    </Button>
                                  </td>
                                </tr>
                              )
                            )}
                            <tr>
                              <td>
                                <strong>{nutrient.name} (Total)</strong>
                              </td>
                              <td className="text-center">
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  onClick={() => handleOpenModal(nutrient)}
                                  className="d-flex align-items-center justify-content-center mx-auto"
                                >
                                  <Edit2 size={18} className="me-1"/>
                                  Editar
                                </Button>
                              </td>
                            </tr>
                            </tbody>
                          </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  ))}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                {t("nutrientAccordion.Micronutrients")}
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6}>
                    <Card className="mb-3">
                      <Card.Header>
                        Minerales
                      </Card.Header>
                      <Card.Body>
                        {renderNutrientTable(
                          data.micronutrients.minerals,
                          "Minerales"
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="mb-3">
                      <Card.Header>
                        Vitaminas
                      </Card.Header>
                      <Card.Body>
                        {renderNutrientTable(
                          data.micronutrients.vitamins,
                          "Vitaminas"
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>
      {showModal && selectedNutrient && (
        <CenteredModifyModal
          data={selectedNutrient}
          onHide={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </Container>
  );
}
