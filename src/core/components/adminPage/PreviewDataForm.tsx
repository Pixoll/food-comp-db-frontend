import React from "react";
import { Card, Table, Row, Col } from "react-bootstrap";
import { FoodForm } from "../../../pages/AdminPage";
import makeRequest from "../../utils/makeRequest";
import {
  NutrientSummary,
  getNutrientNameById,
  NutrientMeasurementForm,
  NutrientMeasurementWithComponentsForm,
} from "../../../pages/AdminPage";
import { useTranslation } from "react-i18next";
import "../../../assets/css/_PreviewDataForm.css";

type NewFood = {
  commonName: Record<"es", string> &
    Partial<Record<"en" | "pt", string | null>>;
  ingredients?: Partial<Record<"es" | "en" | "pt", string | null>>;
  scientificNameId?: number;
  subspeciesId?: number;
  groupId: number;
  typeId: number;
  strain?: string;
  brand?: string;
  observation?: string;
  originIds?: number[];
  nutrientMeasurements: NewNutrientMeasurement[];
  langualCodes: number[];
};

type NewNutrientMeasurement = {
  nutrientId: number;
  average: number;
  deviation?: number;
  min?: number;
  max?: number;
  sampleSize?: number;
  dataType: "analytic" | "calculated" | "assumed" | "borrowed";
  referenceCodes?: number[];
};
type PreviewDataFormProps = {
  data: FoodForm;
  nameAndIdNutrients: NutrientSummary[];
  origins: string[];
};

const PreviewDataForm: React.FC<PreviewDataFormProps> = ({
  data,
  nameAndIdNutrients,
  origins,
}) => {
  const { generalData, nutrientsValueForm } = data;
  const { t } = useTranslation("global");

  const hasValidData = (
    nutrient: NutrientMeasurementForm 
  ): nutrient is Omit<NewNutrientMeasurement, "referenceCodes"> &
    Required<Pick<NewNutrientMeasurement, "referenceCodes">> => {
    return (
      typeof nutrient.average !== "undefined" &&
      typeof nutrient.dataType !== "undefined"
    );
  };
  const handleSubmit = () => {
    const payload: NewFood = {
      commonName: {
        es: data.generalData.commonName.es,
        en: data.generalData.commonName.en,
        pt: data.generalData.commonName.pt,
      },
      ingredients: data.generalData.ingredients,
      scientificNameId: data.generalData.scientificNameId,
      subspeciesId: data.generalData.subspeciesId,
      groupId: data.generalData.groupId || -1,
      typeId: data.generalData.typeId || -1,
      langualCodes: [],
      nutrientMeasurements: [
        ...data.nutrientsValueForm.energy
          .filter(hasValidData)
          .map((energy) => ({
            nutrientId: energy.nutrientId,
            average: energy.average,
            deviation: energy.deviation ?? undefined,
            min: energy.min ?? undefined,
            max: energy.max ?? undefined,
            sampleSize: energy.sampleSize ?? undefined,
            dataType: energy.dataType,
            referenceCodes:
              energy.referenceCodes.length > 0 ? energy.referenceCodes : undefined,
          })),
        ...data.nutrientsValueForm.mainNutrients
          .filter(hasValidData)
          .map((mainNutrient) => ({
            nutrientId: mainNutrient.nutrientId,
            average: mainNutrient.average,
            deviation: mainNutrient.deviation ?? undefined,
            min: mainNutrient.min ?? undefined,
            max: mainNutrient.max ?? undefined,
            sampleSize: mainNutrient.sampleSize ?? undefined,
            dataType: mainNutrient.dataType,
            referenceCodes:
              mainNutrient.referenceCodes.length > 0
                ? mainNutrient.referenceCodes
                : undefined,
          })),
        ...data.nutrientsValueForm.mainNutrients
          .flatMap((mainNutrient) =>
            mainNutrient.components
              .filter(hasValidData)
              .map((component) => ({
                nutrientId: component.nutrientId,
                average: component.average,
                deviation: component.deviation ?? undefined,
                min: component.min ?? undefined,
                max: component.max ?? undefined, 
                sampleSize: component.sampleSize ?? undefined,
                dataType: component.dataType,
                referenceCodes:
                  component.referenceCodes.length > 0
                    ? component.referenceCodes
                    : undefined,
              }))
          ),
          ...data.nutrientsValueForm.micronutrients.minerals
          .filter(hasValidData)
          .map((mineral) => ({
            nutrientId: mineral.nutrientId,
            average: mineral.average,
            deviation: mineral.deviation ?? undefined,
            min: mineral.min ?? undefined,
            max: mineral.max ?? undefined,
            sampleSize: mineral.sampleSize ?? undefined,
            dataType: mineral.dataType,
            referenceCodes:
            mineral.referenceCodes.length > 0
                ? mineral.referenceCodes
                : undefined,
          })),
          ...data.nutrientsValueForm.micronutrients.vitamins
          .filter(hasValidData)
          .map((vitamin) => ({
            nutrientId: vitamin.nutrientId,
            average: vitamin.average,
            deviation: vitamin.deviation ?? undefined,
            min: vitamin.min ?? undefined,
            max: vitamin.max ?? undefined,
            sampleSize: vitamin.sampleSize ?? undefined,
            dataType: vitamin.dataType,
            referenceCodes:
            vitamin.referenceCodes.length > 0
                ? vitamin.referenceCodes
                : undefined,
          })),
        ],      
      brand: data.generalData.brand || undefined,
      observation: data.generalData.observation || undefined,
      originIds: data.generalData.origins,
      strain: data.generalData.strain || undefined,
    };
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
              <th>Codigos de referencias</th>
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
                <td>{nutrient.referenceCodes ?? "N/A"}</td>
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
                      <th>Codigos de referencias</th>
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
                          <td>{component.referenceCodes ?? "N/A"}</td>
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
                      <td>{mainNutrient.referenceCodes ?? "N/A"}</td>
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
                {nutrientsWithoutComponents
                  ?.filter(hasValidData)
                  .map((nutrient, index) => (
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
              <Col md={3}>{generalData.scientificNameId || "N/A"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Group")}</strong>
              </Col>
              <Col md={3}>{generalData.groupId}</Col>
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Type")}</strong>
              </Col>
              <Col md={3}>{generalData.typeId}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <strong>{t("PreviewDataFrom.Subspecies")}</strong>
              </Col>
              <Col md={3}>{generalData.subspeciesId || "N/A"}</Col>
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

      {origins.length > 0 && (
        <Card>
          <Card.Body>
            <h5>Origen(es) actual(es)</h5>
            <Table bordered size="sm" className="mb-3">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "10%" }}>Número</th>
                  <th style={{ width: "90%" }}>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {origins.map((origin, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{origin}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      <button className="button-form-of-food">Validar y enviar</button>
    </div>
  );
};

export default PreviewDataForm;
