'use client'

import React, { useState } from "react";
import { Accordion, Badge, Button, Col, Container, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BsInfoCircle, BsQuestionCircle } from "react-icons/bs";
import { NutrientMeasurement, NutrientsValue } from "@/core/types/SingleFoodResult";
import CenteredModal from "./CenteredModal";

interface NutrientAccordionProps {
  data: NutrientsValue;
  onReferenceClick: (code: string) => void;
  actualGrams: number;
}

export default function NutrientAccordion({
  data,
  onReferenceClick,
  actualGrams
}: NutrientAccordionProps) {
  const [selectedNutrient, setSelectedNutrient] =
    useState<NutrientMeasurement | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { t } = useTranslation();

  const handleOpenModal = (nutrient: NutrientMeasurement) => {
    setSelectedNutrient(nutrient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNutrient(null);
  };

  const renderNutrientTable = (
    nutrients: NutrientMeasurement[],
    calculateValue: boolean = true
  ) => (
    <Table striped bordered hover responsive>
      <thead className="table-light">
      <tr>
        <th>{t("nutrientAccordion.name")}</th>
        <th>{t("nutrientAccordion.unit")}</th>
        <th>{t("nutrientAccordion.mean")}</th>
        <th>{t("nutrientAccordion.details")}</th>
      </tr>
      </thead>
      <tbody>
      {nutrients.map((nutrient, index) => (
        <tr key={index} className="align-middle">
          <td>{nutrient.name}</td>
          <td>{nutrient.measurementUnit}</td>
          <td>
            <Badge bg="secondary">
              {calculateValue
                ? (nutrient.average * (actualGrams / 100)).toFixed(2)
                : nutrient.average.toFixed(2)
              }
            </Badge>
          </td>
          <td className="text-center">
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => handleOpenModal(nutrient)}
            >
              <BsInfoCircle size={20}/>
            </Button>
          </td>
        </tr>
      ))}
      </tbody>
    </Table>
  );

  return (
    <Container fluid className="p-0">
      <Accordion defaultActiveKey={["0", "1", "2"]} alwaysOpen>
        <Accordion.Item eventKey="0" className="mb-2">
          <Accordion.Header>
            <BsQuestionCircle className="me-2"/>
            {t("nutrientAccordion.Energy")}
          </Accordion.Header>
          <Accordion.Body>
            {renderNutrientTable(data.energy)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1" className="mb-2">
          <Accordion.Header>
            <BsQuestionCircle className="me-2"/>
            {t("nutrientAccordion.Main")}
          </Accordion.Header>
          <Accordion.Body>
            {/* Main Nutrients without Components */}
            {renderNutrientTable(
              data.macronutrients.filter(
                (nutrient) => !nutrient.components || nutrient.components.length === 0
              )
            )}

            {/* Main Nutrients with Components */}
            {data.macronutrients
              .filter((nutrient) => nutrient.components && nutrient.components.length > 0)
              .map((nutrient, index) => (
                <Accordion key={`sub-${index}`} className="mb-2">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>{nutrient.name}</Accordion.Header>
                    <Accordion.Body>
                      <Table striped bordered hover responsive>
                        <thead className="table-light">
                        <tr>
                          <th>{t("nutrientAccordion.name")}</th>
                          <th>{t("nutrientAccordion.unit")}</th>
                          <th>{t("nutrientAccordion.mean")}</th>
                          <th>{t("nutrientAccordion.details")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Sub-components */}
                        {nutrient.components?.map((subComponent, subIndex) => (
                          <tr key={subIndex} className="align-middle">
                            <td>{subComponent.name}</td>
                            <td>{subComponent.measurementUnit}</td>
                            <td>
                              <Badge bg="secondary">
                                {(subComponent.average * (actualGrams / 100)).toFixed(2)}
                              </Badge>
                            </td>
                            <td className="text-center">
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleOpenModal(subComponent)}
                              >
                                <BsInfoCircle size={20}/>
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {/* Total row */}
                        <tr className="table-active">
                          <td><strong>{nutrient.name} (Total)</strong></td>
                          <td>{nutrient.measurementUnit}</td>
                          <td>
                            <Badge bg="primary">
                              {nutrient.average.toFixed(2)}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleOpenModal(nutrient)}
                            >
                              <BsInfoCircle size={20}/>
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
            <BsQuestionCircle className="me-2"/>
            {t("nutrientAccordion.Micronutrients")}
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={6}>
                <h5 className="mb-3">{t("nutrientAccordion.Micronutrients")}</h5>
                {renderNutrientTable(data.micronutrients.minerals, false)}
              </Col>
              <Col md={6}>
                <h5 className="mb-3">{t("nutrientAccordion.Micronutrients")}</h5>
                {renderNutrientTable(data.micronutrients.vitamins, false)}
              </Col>
            </Row>
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
    </Container>
  );
}
