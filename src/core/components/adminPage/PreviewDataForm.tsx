import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FoodForm } from "../../../pages/AdminPage";

type PreviewDataFormProps = {
  data: FoodForm;
};

const PreviewDataForm: React.FC<PreviewDataFormProps> = ({ data }) => {
  const { generalData, nutrientsValueForm } = data;

  return (
    <div className="p-3">
      {/* General Data Section */}
      <Card className="mb-4">
        <Card.Body>
          <h4>General Data</h4>
          <Row className="mb-2">
            <Col md={6}>
              <strong>Code:</strong> {generalData.code}
            </Col>
            <Col md={6}>
              <strong>Scientific Name:</strong> {generalData.scientificName || "N/A"}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <strong>Group:</strong> {generalData.group.name} (Code: {generalData.group.code})
            </Col>
            <Col md={6}>
              <strong>Type:</strong> {generalData.type.name} (Code: {generalData.type.code})
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <strong>Subspecies:</strong> {generalData.subspecies || "N/A"}
            </Col>
            <Col md={6}>
              <strong>Strain:</strong> {generalData.strain || "N/A"}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <strong>Brand:</strong> {generalData.brand || "N/A"}
            </Col>
            <Col md={6}>
              <strong>Observation:</strong> {generalData.observation || "N/A"}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <strong>Common Name (ES):</strong> {generalData.commonName.es}
            </Col>
            {generalData.commonName.en && (
              <Col md={12}>
                <strong>Common Name (EN):</strong> {generalData.commonName.en}
              </Col>
            )}
            {generalData.commonName.pt && (
              <Col md={12}>
                <strong>Common Name (PT):</strong> {generalData.commonName.pt}
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Nutritional Data Section */}
      <Card>
        <Card.Body>
          <h4>Nutritional Data</h4>
          <h5>Energy</h5>
          {nutrientsValueForm.energy.map((nutrient, index) => (
            <Row key={index} className="mb-2">
              <Col md={6}>
                <strong>Nutrient ID:</strong> {nutrient.nutrientId}
              </Col>
              <Col md={6}>
                <strong>Average:</strong> {nutrient.average ?? "N/A"}
              </Col>
            </Row>
          ))}

          <h5>Main Nutrients</h5>
          {nutrientsValueForm.mainNutrients.map((mainNutrient, index) => (
            <div key={index} className="mb-3">
              <Row>
                <Col md={6}>
                  <strong>Nutrient ID:</strong> {mainNutrient.nutrientId}
                </Col>
                <Col md={6}>
                  <strong>Average:</strong> {mainNutrient.average ?? "N/A"}
                </Col>
              </Row>
              {mainNutrient.components.length > 0 && (
                <div className="mt-2 ps-3">
                  <h6>Components:</h6>
                  {mainNutrient.components.map((component, compIndex) => (
                    <Row key={compIndex} className="mb-2">
                      <Col md={6}>
                        <strong>Nutrient ID:</strong> {component.nutrientId}
                      </Col>
                      <Col md={6}>
                        <strong>Average:</strong> {component.average ?? "N/A"}
                      </Col>
                    </Row>
                  ))}
                </div>
              )}
            </div>
          ))}

          <h5>Micronutrients</h5>
          <h6>Vitamins</h6>
          {nutrientsValueForm.micronutrients.vitamins.map((vitamin, index) => (
            <Row key={index} className="mb-2">
              <Col md={6}>
                <strong>Nutrient ID:</strong> {vitamin.nutrientId}
              </Col>
              <Col md={6}>
                <strong>Average:</strong> {vitamin.average ?? "N/A"}
              </Col>
            </Row>
          ))}

          <h6>Minerals</h6>
          {nutrientsValueForm.micronutrients.minerals.map((mineral, index) => (
            <Row key={index} className="mb-2">
              <Col md={6}>
                <strong>Nutrient ID:</strong> {mineral.nutrientId}
              </Col>
              <Col md={6}>
                <strong>Average:</strong> {mineral.average ?? "N/A"}
              </Col>
            </Row>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PreviewDataForm;
