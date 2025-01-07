import { CodeIcon, Database, Info, Leaf, Zap } from "lucide-react";
import { Badge, Card, Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  FoodForm,
  getNutrientNameById,
  NutrientMeasurementForm,
  NutrientMeasurementWithComponentsForm,
  NutrientSummary,
} from "../../../pages/AdminPage";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Group,
  LangualCode,
  ScientificName,
  Subspecies,
  Type,
} from "../../hooks";
import makeRequest from "../../utils/makeRequest";
import {
  searchGroupNameById,
  searchScientificNameById,
  searchSubspeciesNameById,
  searchTypeNameById,
} from "./NewGeneralData";
import "../../../assets/css/_PreviewDataForm.css";

const searchLangualCodeById = (id: number, langualCodes: LangualCode[]) => {
  return langualCodes.find((langualCode) => langualCode.id === id);
};

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
  types: Type[];
  groups: Group[];
  scientificNames: ScientificName[];
  langualCodes: LangualCode[];
  subspecies: Subspecies[];
  origins: string[];
};

export default function PreviewDataForm({
  data,
  nameAndIdNutrients,
  origins,
  scientificNames,
  groups,
  langualCodes,
  subspecies,
  types,
}: PreviewDataFormProps) {
  const { generalData, nutrientsValueForm } = data;
  console.log(data);
  const { t } = useTranslation();
  const { state } = useAuth();
  const { addToast } = useToast();
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
  const handleSubmit = () => {
    const payload: NewFood = {
      commonName: {
        es: data.generalData.commonName.es,
        en: data.generalData.commonName.en || undefined,
        pt: data.generalData.commonName.pt || undefined,
      },
      ingredients: {
        es: data.generalData.ingredients.es || undefined,
        en: data.generalData.ingredients.en || undefined,
        pt: data.generalData.ingredients.pt || undefined,
      },
      scientificNameId: data.generalData.scientificNameId,
      subspeciesId: data.generalData.subspeciesId,
      groupId: data.generalData.groupId || -1,
      typeId: data.generalData.typeId || -1,
      langualCodes: data.generalData.langualCodes,
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
              energy.referenceCodes.length > 0
                ? energy.referenceCodes
                : undefined,
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
        ...data.nutrientsValueForm.mainNutrients.flatMap((mainNutrient) =>
          mainNutrient.components.filter(hasValidData).map((component) => ({
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
    console.log(payload);
    makeRequest(
      "post",
      `/foods/${generalData.code}`,
      payload,
      state.token,
      () => {
        addToast({
          message: "Se creo exitosamente",
          title: "Éxito",
          type: "Success",
        });
      },
      (error) => {
        addToast({
          message: error.response?.data?.message ?? error.message ?? "Error",
          title: "Fallo",
          type: "Danger",
        });
      }
    );
  };
  type DataRender = {
    parentSelected: LangualCode;
    childrenSelecteds: LangualCode[];
  };

  function searchLangualCodes(
    childrenIds: number[],
    langualCodes: LangualCode[]
  ): DataRender[] | null {
    if (childrenIds.length === 0) {
      return null;
    }
    const childrenInfo = childrenIds
      .map((childId) => langualCodes.find((code) => code.id === childId))
      .filter((child): child is LangualCode => child !== undefined);

    const uniqueParentIds = Array.from(
      new Set(
        childrenInfo
          .map((child) => child.parentId)
          .filter((id): id is number => id !== null)
      )
    );

    const parentsInfo = uniqueParentIds
      .map((parentId) => langualCodes.find((code) => code.id === parentId))
      .filter((parent): parent is LangualCode => parent !== undefined);

    const result: DataRender[] = parentsInfo.map((parent) => ({
      parentSelected: parent,
      childrenSelecteds: childrenInfo.filter(
        (child) => child.parentId === parent.id
      ),
    }));

    return result;
  }
  const langualCodesInfo = searchLangualCodes(
    data.generalData.langualCodes,
    langualCodes
  );

  const renderNutrientTable = (
    title: string,
    nutrients: NutrientMeasurementForm[]
  ) => {
    const validNutrients = nutrients.filter(hasValidData);
    if (validNutrients.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="d-flex align-items-center mb-3">
          <Zap className="mr-2 text-primary" size={24} />
          <h5 className="mb-0">{title}</h5>
        </div>
        <Table bordered hover responsive size="sm">
          <thead className="thead-light">
            <tr>
              <th className="text-left">Nombre del nutriente</th>
              <th className="text-center">Promedio</th>
              <th className="text-center">Desviación</th>
              <th className="text-center">Mínimo</th>
              <th className="text-center">Máximo</th>
              <th className="text-center">Tamaño de muestra</th>
              <th className="text-center">Tipo de dato</th>
              <th className="text-center">Códigos de referencias</th>
            </tr>
          </thead>
          <tbody>
            {validNutrients.map((nutrient, index) => (
              <tr key={index} className="align-middle">
                <td className="font-weight-bold">
                  {getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}
                </td>
                <td className="text-center">
                  <Badge>{nutrient.average.toString()}</Badge>
                </td>
                <td className="text-center">
                  <Badge>{nutrient.deviation?.toString()}</Badge>
                </td>
                <td className="text-center">
                  <Badge>{nutrient.min?.toString()}</Badge>
                </td>
                <td className="text-center">
                  <Badge>{nutrient.max?.toString()}</Badge>
                </td>
                <td className="text-center">
                  <Badge>{nutrient.sampleSize?.toString()}</Badge>
                </td>
                <td className="text-center">
                  <Badge>{nutrient.dataType}</Badge>
                </td>
                <td className="text-center text-muted small">
                  <Badge>{nutrient.referenceCodes}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
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
            <div className="d-flex align-items-center mb-3">
              <Leaf className="mr-2 text-success" size={24} />
              <h5 className="mb-0">Nutrientes con componentes</h5>
            </div>
            {nutrientsWithComponents.map((mainNutrient, index) => (
              <div key={index} className="mb-4">
                <h6 className="d-flex align-items-center">
                  <Database className="mr-2 text-primary" size={18} />
                  {getNutrientNameById(
                    mainNutrient.nutrientId,
                    nameAndIdNutrients
                  )}{" "}
                  (Total)
                </h6>
                <Table bordered hover responsive size="sm">
                  <thead className="thead-light">
                    <tr>
                      <th>Nombre del componente</th>
                      <th className="text-center">Promedio</th>
                      <th className="text-center">Desviación</th>
                      <th className="text-center">Mínimo</th>
                      <th className="text-center">Máximo</th>
                      <th className="text-center">Tamaño de muestra</th>
                      <th className="text-center">Tipo de dato</th>
                      <th className="text-center">Códigos de referencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainNutrient.components
                      ?.filter(hasValidData)
                      .map((component, compIndex) => (
                        <tr key={compIndex} className="align-middle">
                          <td className="font-weight-bold">
                            {getNutrientNameById(
                              component.nutrientId,
                              nameAndIdNutrients
                            )}
                          </td>
                          <td className="text-center">
                            <Badge>{component.average?.toString()}</Badge>
                          </td>
                          <td className="text-center">
                            <Badge>
                              {component.deviation?.toString() ?? "N/A"}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Badge>{component.min?.toString()}</Badge>
                          </td>
                          <td className="text-center">
                            <Badge>{component.max?.toString()}</Badge>
                          </td>
                          <td className="text-center">
                            <Badge>{component.sampleSize?.toString()}</Badge>
                          </td>
                          <td className="text-center">
                            <Badge>{component.dataType}</Badge>
                          </td>
                          <td className="text-center text-muted small">
                            {component.referenceCodes}
                          </td>
                        </tr>
                      ))}
                    <tr className="table-active">
                      <td className="font-weight-bold">
                        {getNutrientNameById(
                          mainNutrient.nutrientId,
                          nameAndIdNutrients
                        )}{" "}
                        (Total)
                      </td>
                      <td className="text-center">
                        <Badge>{mainNutrient.average?.toString()}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge>{mainNutrient.deviation?.toString()}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge>{mainNutrient.min?.toString()}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge>{mainNutrient.max?.toString()}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge>{mainNutrient.sampleSize?.toString()}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge>{mainNutrient.dataType}</Badge>
                      </td>
                      <td className="text-center text-muted small">
                        {mainNutrient.referenceCodes}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            ))}
          </>
        )}

        {nutrientsWithoutComponents.length > 0 && (
          <>
            <div className="d-flex align-items-center mb-3">
              <Database className="mr-2 text-secondary" size={24} />
              <h5 className="mb-0">Nutrientes sin componentes</h5>
            </div>
            <Table bordered hover responsive size="sm">
              <thead className="thead-light">
                <tr>
                  <th>Nombre del nutriente</th>
                  <th className="text-center">Promedio</th>
                  <th className="text-center">Desviación</th>
                  <th className="text-center">Mínimo</th>
                  <th className="text-center">Máximo</th>
                  <th className="text-center">Tamaño de muestra</th>
                  <th className="text-center">Tipo de dato</th>
                  <th className="text-center">Códigos de referencias</th>
                </tr>
              </thead>
              <tbody>
                {nutrientsWithoutComponents
                  ?.filter(hasValidData)
                  .map((nutrient, index) => (
                    <tr key={index} className="align-middle">
                      <td className="font-weight-bold">
                        {getNutrientNameById(
                          nutrient.nutrientId,
                          nameAndIdNutrients
                        )}
                      </td>
                      <td className="text-center">
                        <Badge>{nutrient.average.toString()}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge>{nutrient.deviation?.toString()}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge>{nutrient.min?.toString()}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge>{nutrient.max?.toString()}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge>{nutrient.sampleSize?.toString()}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge>{nutrient.dataType}</Badge>
                      </td>
                      <td className="text-center text-muted small">
                        <Badge>{nutrient.referenceCodes}</Badge>
                      </td>
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
      {/* General Information Card */}
      <Card className="mb-4">
        <Card.Header className="d-flex align-items-center">
          <div style={{ color: "#007bff", marginRight: "10px" }}>
            <Info size={24} />
          </div>
          <h4 className="mb-0">{t("PreviewDataFrom.General")}</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={3}>
              <strong>{t("PreviewDataFrom.Code")}</strong>
            </Col>
            <Col md={3}>{generalData.code}</Col>
            <Col md={3}>
              <strong>{t("PreviewDataFrom.Scientific")}</strong>
            </Col>
            <Col md={3}>
              {searchScientificNameById(
                generalData.scientificNameId,
                scientificNames
              )}
            </Col>
            <Col md={3}>
              <strong>Tipo de alimento:</strong>
            </Col>
            <Col md={3}>{searchTypeNameById(generalData.typeId, types)}</Col>
            <Col md={3}>
              <strong>Grupo alimentario:</strong>
            </Col>
            <Col md={3}>{searchGroupNameById(generalData.groupId, groups)}</Col>
            <Col md={3}>
              <strong>Subespecie:</strong>
            </Col>
            <Col md={3}>
              {searchSubspeciesNameById(generalData.subspeciesId, subspecies)}
            </Col>
            <Col md={3}>
              <strong>Observación: </strong>
            </Col>
            <Col md={3}>{generalData.observation}</Col>
            <Col md={3}>
              <strong>Marca:</strong>
            </Col>
            <Col md={3}>{generalData.brand}</Col>
            <Col md={3}>
              <strong>Variante:</strong>
            </Col>
            <Col md={3}>{generalData.strain}</Col>
          </Row>

          {/* Ingredients and Common Names Section */}
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h5 className="mb-0">Ingredientes</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-2">
                    <Col md={6} className="font-weight-bold">
                      Nombre en español
                    </Col>
                    <Col md={6}>{generalData.ingredients.es || "N/A"}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={6} className="font-weight-bold">
                      Nombre en inglés
                    </Col>
                    <Col md={6}>{generalData.ingredients.en || "N/A"}</Col>
                  </Row>
                  <Row>
                    <Col md={6} className="font-weight-bold">
                      Nombre en Portugués
                    </Col>
                    <Col md={6}>{generalData.ingredients.pt || "N/A"}</Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h5 className="mb-0">Nombres Comunes</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-2">
                    <Col md={6} className="font-weight-bold">
                      {t("PreviewDataFrom.Common")} (ES)
                    </Col>
                    <Col md={6}>{generalData.commonName.es || "N/A"}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={6} className="font-weight-bold">
                      {t("PreviewDataFrom.Common")} (EN)
                    </Col>
                    <Col md={6}>{generalData.commonName.en || "N/A"}</Col>
                  </Row>
                  <Row>
                    <Col md={6} className="font-weight-bold">
                      {t("PreviewDataFrom.Common")} (PT)
                    </Col>
                    <Col md={6}>{generalData.commonName.pt || "N/A"}</Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h4 className="d-flex align-items-center mb-4">
            <Leaf className="mr-2 text-success" size={28} />
            {t("PreviewDataFrom.Nutritional")}
          </h4>

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

      {origins && origins.length > 0 && (
        <Card className="mb-4">
          <Card.Header className="d-flex align-items-center">
            <div style={{ color: "#17a2b8", marginRight: "10px" }}>
              <Database size={24} />
            </div>
            <h5 className="mb-0">Orígenes</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
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
      {langualCodesInfo && data.generalData.langualCodes.length > 0 && (
        <Card className="mb-4">
          <Card.Header className="d-flex align-items-center">
            <div style={{ color: "#17a2b8", marginRight: "10px" }}>
              <CodeIcon size={24} />
            </div>
            <h5 className="mb-0">Códigos languales</h5>
          </Card.Header>
          <Card.Body>
            {langualCodesInfo.map((parentGroup, parentIndex) => (
              <div
                key={parentGroup.parentSelected.id}
                className={parentIndex > 0 ? "mt-4" : ""}
              >
                <h6 className="mb-3">
                  {parentGroup.parentSelected.code} -{" "}
                  {parentGroup.parentSelected.descriptor}
                </h6>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>Código</th>
                      <th style={{ width: "90%" }}>Descriptor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parentGroup.childrenSelecteds.map((child) => (
                      <tr key={child.id}>
                        <td>{child.code}</td>
                        <td>{child.descriptor}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))}
          </Card.Body>
        </Card>
      )}
      <button onClick={handleSubmit} className="button-form-of-food">
        Validar y enviar
      </button>
    </div>
  );
}
