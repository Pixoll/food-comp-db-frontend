import React from "react";
import { Card, Table, Row, Col } from "react-bootstrap";
import { FoodForm } from "../../../pages/AdminPage";
import {
  NutrientSummary,
  getNutrientNameById,
  NutrientMeasurementForm,
  NutrientMeasurementWithComponentsForm,
} from "../../../pages/AdminPage";
import { useTranslation } from "react-i18next";

type PreviewDataFormProps = {
  data: FoodForm;
  nameAndIdNutrients: NutrientSummary[];
};

const PreviewDataForm: React.FC<PreviewDataFormProps> = ({
  data,
  nameAndIdNutrients,
}) => {
  const { generalData, nutrientsValueForm } = data;
  const { t } = useTranslation("global");

  const hasValidData = (nutrient: NutrientMeasurementForm): boolean => {
    return (
      nutrient.average !== null ||
      nutrient.deviation !== null ||
      nutrient.min !== null ||
      nutrient.max !== null ||
      nutrient.sampleSize !== null ||
      nutrient.dataType !== null
    );
  };
  const renderNutrientTable = (
    title: string,
    nutrients: NutrientMeasurementForm[]
  ) => {
    const validNutrients = nutrients.filter(hasValidData);
    if (validNutrients.length === 0) return null;

    return (
      <>
        <h5>{title}</h5>
        <Table bordered size="sm" className="mb-3">
          <thead>
            <tr>
              <th>Nombre del nutriente</th>
              <th>Promedio</th>
              <th>Desviación</th>
              <th>Mínimo</th>
              <th>Máximo</th>
              <th>Tamaño de muestra</th>
              <th>Tipo de dato</th>
            </tr>
          </thead>
          <tbody>
            {validNutrients.map((nutrient, index) => (
              <tr key={index}>
                <td>
                  {getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}
                </td>
                <td>{nutrient.average ?? "N/A"}</td>
                <td>{nutrient.deviation ?? "N/A"}</td>
                <td>{nutrient.min ?? "N/A"}</td>
                <td>{nutrient.max ?? "N/A"}</td>
                <td>{nutrient.sampleSize ?? "N/A"}</td>
                <td>{nutrient.dataType ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  };
  const renderMainNutrientTables = (
    mainNutrients: NutrientMeasurementWithComponentsForm[]
  ) => {
    const nutrientsWithComponents = mainNutrients.filter(
      (nutrient) =>
        nutrient.components && nutrient.components.some(hasValidData)
    );

    const nutrientsWithoutComponents = mainNutrients.filter(
      (nutrient) =>
        (!nutrient.components || nutrient.components.length === 0) &&
        hasValidData(nutrient)
    );

    return (
      <>
        {nutrientsWithComponents.length > 0 && (
          <>
            <h5>Nutrientes con componentes</h5>
            {nutrientsWithComponents.map((mainNutrient, index) => (
              <div key={index} className="mb-4">
                <h6>
                  {getNutrientNameById(
                    mainNutrient.nutrientId,
                    nameAndIdNutrients
                  )}{" "}
                  (Total)
                </h6>
                <Table bordered size="sm" className="mb-3">
                  <thead>
                    <tr>
                      <th>Nombre del componente</th>
                      <th>Promedio</th>
                      <th>Desviación</th>
                      <th>Mínimo</th>
                      <th>Máximo</th>
                      <th>Tamaño de muestra</th>
                      <th>Tipo de dato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainNutrient.components
                      ?.filter(hasValidData)
                      .map((component, compIndex) => (
                        <tr key={compIndex}>
                          <td>
                            {getNutrientNameById(
                              component.nutrientId,
                              nameAndIdNutrients
                            )}
                          </td>
                          <td>{component.average ?? "N/A"}</td>
                          <td>{component.deviation ?? "N/A"}</td>
                          <td>{component.min ?? "N/A"}</td>
                          <td>{component.max ?? "N/A"}</td>
                          <td>{component.sampleSize ?? "N/A"}</td>
                          <td>{component.dataType ?? "N/A"}</td>
                        </tr>
                      ))}
                    <tr>
                      <td>
                        {getNutrientNameById(
                          mainNutrient.nutrientId,
                          nameAndIdNutrients
                        )}{" "}
                        (Total)
                      </td>
                      <td>{mainNutrient.average ?? "N/A"}</td>
                      <td>{mainNutrient.deviation ?? "N/A"}</td>
                      <td>{mainNutrient.min ?? "N/A"}</td>
                      <td>{mainNutrient.max ?? "N/A"}</td>
                      <td>{mainNutrient.sampleSize ?? "N/A"}</td>
                      <td>{mainNutrient.dataType ?? "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            ))}
          </>
        )}

        {nutrientsWithoutComponents.length > 0 && (
          <>
            <h5>Nutrientes sin componentes</h5>
            <Table bordered size="sm" className="mb-3">
              <thead>
                <tr>
                  <th>Nombre del nutriente</th>
                  <th>Promedio</th>
                  <th>Desviación</th>
                  <th>Mínimo</th>
                  <th>Máximo</th>
                  <th>Tamaño de muestra</th>
                  <th>Tipo de dato</th>
                </tr>
              </thead>
              <tbody>
                {nutrientsWithoutComponents.map((nutrient, index) => (
                  <tr key={index}>
                    <td>
                      {getNutrientNameById(
                        nutrient.nutrientId,
                        nameAndIdNutrients
                      )}
                    </td>
                    <td>{nutrient.average ?? "N/A"}</td>
                    <td>{nutrient.deviation ?? "N/A"}</td>
                    <td>{nutrient.min ?? "N/A"}</td>
                    <td>{nutrient.max ?? "N/A"}</td>
                    <td>{nutrient.sampleSize ?? "N/A"}</td>
                    <td>{nutrient.dataType ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </>
    );
  };

  return (
    <div className="p-3">
      <Card className="mb-4">
        <Card.Body>
          <h4>{t("PreviewDataFrom.General")}</h4>
          <div className="general-data-container">
            {/* Información General */}
            <Row className="mb-3">
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Code")}</strong>
              </Col>
              <Col md={3}>{generalData.code}</Col>
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Scientific")}</strong>
              </Col>
              <Col md={3}>{generalData.scientificName || "N/A"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Group")}</strong>
              </Col>
              <Col md={3}>
                {generalData.group.name} (Code: {generalData.group.code})
              </Col>
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Type")}</strong>
              </Col>
              <Col md={3}>
                {generalData.type.name} (Code: {generalData.type.code})
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Subspecies")}</strong>
              </Col>
              <Col md={3}>{generalData.subspecies || "N/A"}</Col>
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Strain")}</strong>
              </Col>
              <Col md={3}>{generalData.strain || "N/A"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Brand")}</strong>
              </Col>
              <Col md={3}>{generalData.brand || "N/A"}</Col>
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Observation")}</strong>
              </Col>
              <Col md={3}>{generalData.observation || "N/A"}</Col>
            </Row>

            {/* Ingredientes y Nombres Comunes */}
            <Row>
              <Col md={6}>
                <h5>Ingredientes</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Nombre en español</strong>
                  </Col>
                  <Col md={6}>{generalData.ingredients.es || "N/A"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Nombre en inglés</strong>
                  </Col>
                  <Col md={6}>{generalData.ingredients.en || "N/A"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Nombre en Portugués</strong>
                  </Col>
                  <Col md={6}>{generalData.ingredients.pt || "N/A"}</Col>
                </Row>
              </Col>

              <Col md={6}>
                <h5>Nombres comunes</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>{t("PreviewDataFrom.Common")} (ES)</strong>
                  </Col>
                  <Col md={6}>{generalData.commonName.es || "N/A"}</Col>
                </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>{t("PreviewDataFrom.Common")} (EN)</strong>
                    </Col>
                    <Col md={6}>{generalData.commonName.en || "N/A"}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>{t("PreviewDataFrom.Common")} (PT)</strong>
                    </Col>
                    <Col md={6}>{generalData.commonName.pt || "N/A"}</Col>
                  </Row>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h4>{t("PreviewDataFrom.Nutritional")}</h4>

          {renderNutrientTable(
            t("PreviewDataFrom.Energy"),
            nutrientsValueForm.energy
          )}
          {renderMainNutrientTables(nutrientsValueForm.mainNutrients)}

          {renderNutrientTable(
            t("PreviewDataFrom.Vitamins"),
            nutrientsValueForm.micronutrients.vitamins
          )}
          {renderNutrientTable(
            t("PreviewDataFrom.Minerals"),
            nutrientsValueForm.micronutrients.minerals
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PreviewDataForm;
