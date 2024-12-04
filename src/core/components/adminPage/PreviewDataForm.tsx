import React from "react";
import { Card, Table } from "react-bootstrap";
import { FoodForm } from "../../../pages/AdminPage";
import {
  NutrientSummary,
  getNutrientNameById,
  NutrientMeasurementForm,
  NutrientMeasurementWithComponentsForm
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
    );
  };
  const renderMainNutrientTables = (
    mainNutrients: NutrientMeasurementWithComponentsForm[],
  ) => {
    const nutrientsWithComponents = mainNutrients.filter(
        (nutrient) =>
          nutrient.components &&
          nutrient.components.some(hasValidData) 
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
          <Table bordered size="sm" className="mb-3">
            <tbody>
              <tr>
                <th>{t("PreviewDataFrom.Code")}</th>
                <td>{generalData.code}</td>
                <th>{t("PreviewDataFrom.Scientific")}</th>
                <td>{generalData.scientificName || "N/A"}</td>
              </tr>
              <tr>
                <th>{t("PreviewDataFrom.Group")}</th>
                <td>
                  {generalData.group.name} (Code: {generalData.group.code})
                </td>
                <th>{t("PreviewDataFrom.Type")}</th>
                <td>
                  {generalData.type.name} (Code: {generalData.type.code})
                </td>
              </tr>
              <tr>
                <th>{t("PreviewDataFrom.Subspecies")}</th>
                <td>{generalData.subspecies || "N/A"}</td>
                <th>{t("PreviewDataFrom.Strain")}</th>
                <td>{generalData.strain || "N/A"}</td>
              </tr>
              <tr>
                <th>{t("PreviewDataFrom.Brand")}</th>
                <td>{generalData.brand || "N/A"}</td>
                <th>{t("PreviewDataFrom.Observation")}</th>
                <td>{generalData.observation || "N/A"}</td>
              </tr>
              <tr>
                <th>Nombre en español</th>
                <td>{generalData.ingredients.es || "N/A"}</td>
                <th>Nombre en inglés</th>
                <td>{generalData.ingredients.en || "N/A"}</td>
              </tr>
              <tr>
                <th>Nombre en Portugués</th>
                <td>{generalData.ingredients.pt || "N/A"}</td>
                <th>{t("PreviewDataFrom.Common")} (ES)</th>
                <td>{generalData.commonName.es}</td>
              </tr>
              {generalData.commonName.en && (
                <tr>
                  <th>{t("PreviewDataFrom.Common")} (EN)</th>
                  <td>{generalData.commonName.en}</td>
                </tr>
              )}
              {generalData.commonName.pt && (
                <tr>
                  <th>{t("PreviewDataFrom.Common")} (PT)</th>
                  <td>{generalData.commonName.pt}</td>
                </tr>
              )}
            </tbody>
          </Table>
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
