import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FoodForm } from "../../../pages/AdminPage";
import { useTranslation } from "react-i18next";

type PreviewDataFormProps = {
  data: FoodForm;
};

const PreviewDataForm: React.FC<PreviewDataFormProps> = ({ data }) => {
  const { generalData, nutrientsValueForm } = data;
  const { t } = useTranslation("global");
  return (
    <div className="p-3">
      {/* General Data Section */}
      <Card className="mb-4">
        <Card.Body>
          <h4>{t("PreviewDataFrom.General")}</h4>
          <Row className="mb-2">
            <Col md={6}>
              <strong>{t("PreviewDataFrom.Code")}</strong> {generalData.code}
            </Col>
            <Col md={6}>
              <strong>{t("PreviewDataFrom.Scientific")}</strong> {generalData.scientificName || "N/A"}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <strong>{t("PreviewDataFrom.Group")}</strong> {generalData.group.name} (Code: {generalData.group.code})
            </Col>
            <Col md={6}>
              <strong>{t("PreviewDataFrom.Type")}</strong> {generalData.type.name} (Code: {generalData.type.code})
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <strong>{t("PreviewDataFrom.Subspecies")}</strong> {generalData.subspecies || "N/A"}
            </Col>
            <Col md={6}>
              <strong>{t("PreviewDataFrom.Strain")}</strong> {generalData.strain || "N/A"}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <strong>{t("PreviewDataFrom.Brand")}</strong> {generalData.brand || "N/A"}
            </Col>
            <Col md={6}>
              <strong>{t("PreviewDataFrom.Observation")}</strong> {generalData.observation || "N/A"}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <strong>{t("PreviewDataFrom.Common")} (ES):</strong> {generalData.commonName.es}
            </Col>
            {generalData.commonName.en && (
              <Col md={12}>
                <strong>{t("PreviewDataFrom.Common")} (EN):</strong> {generalData.commonName.en}
              </Col>
            )}
            {generalData.commonName.pt && (
              <Col md={12}>
                <strong>{t("PreviewDataFrom.Common")} (PT):</strong> {generalData.commonName.pt}
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Nutritional Data Section */}
      <Card>
        <Card.Body>
          <h4>{t("PreviewDataFrom.Nutritional")}</h4>
          <h5>{t("PreviewDataFrom.Energy")}</h5>
          {nutrientsValueForm.energy.map((nutrient, index) => (
            <Row key={index} className="mb-2">
              <Col md={6}>
                <strong>{t("PreviewDataFrom.Nutrient")}</strong> {nutrient.nutrientId}
              </Col>
              <Col md={6}>
                <strong>{t("PreviewDataFrom.Average")}</strong> {nutrient.average ?? "N/A"}
              </Col>
            </Row>
          ))}

          <h5>{t("PreviewDataFrom.Main")}</h5>
          {nutrientsValueForm.mainNutrients.map((mainNutrient, index) => (
            <div key={index} className="mb-3">
              <Row>
                <Col md={6}>
                  <strong>{t("PreviewDataFrom.Nutrient")}</strong> {mainNutrient.nutrientId}
                </Col>
                <Col md={6}>
                  <strong>{t("PreviewDataFrom.Average")}</strong> {mainNutrient.average ?? "N/A"}
                </Col>
              </Row>
              {mainNutrient.components.length > 0 && (
                <div className="mt-2 ps-3">
                  <h6>{t("PreviewDataFrom.Components")}</h6>
                  {mainNutrient.components.map((component, compIndex) => (
                    <Row key={compIndex} className="mb-2">
                      <Col md={6}>
                        <strong>{t("PreviewDataFrom.Nutrient")}</strong> {component.nutrientId}
                      </Col>
                      <Col md={6}>
                        <strong>{t("PreviewDataFrom.Average")}</strong> {component.average ?? "N/A"}
                      </Col>
                    </Row>
                  ))}
                </div>
              )}
            </div>
          ))}

          <h5>{t("PreviewDataFrom.Micronutrients")}</h5>
          <h6>{t("PreviewDataFrom.Vitamins")}</h6>
          {nutrientsValueForm.micronutrients.vitamins.map((vitamin, index) => (
            <Row key={index} className="mb-2">
              <Col md={6}>
                <strong>{t("PreviewDataFrom.Nutrient")}</strong> {vitamin.nutrientId}
              </Col>
              <Col md={6}>
                <strong>{t("PreviewDataFrom.Average")}</strong> {vitamin.average ?? "N/A"}
              </Col>
            </Row>
          ))}

          <h6>{t("PreviewDataFrom.Minerals")}</h6>
          {nutrientsValueForm.micronutrients.minerals.map((mineral, index) => (
            <Row key={index} className="mb-2">
              <Col md={6}>
                <strong>{t("PreviewDataFrom.Nutrient")}</strong> {mineral.nutrientId}
              </Col>
              <Col md={6}>
                <strong>{t("PreviewDataFrom.Average")}</strong> {mineral.average ?? "N/A"}
              </Col>
            </Row>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PreviewDataForm;
