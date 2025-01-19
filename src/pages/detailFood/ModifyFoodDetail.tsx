import axios from "axios";
import "../../assets/css/_ModifyDetailFood.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Nav, Row, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { OriginSelector } from "../../core/components/adminPage";
import {
  LangualCodeComponent,
  NutrientAccordionModify,
  ReferencesList,
  RequiredFieldLabel,
  SelectorWithInput,
} from "../../core/components/detailFood";
import Footer from "../../core/components/Footer";
import { useAuth } from "../../core/context/AuthContext";
import { useToast } from "../../core/context/ToastContext";
import {
  FetchStatus,
  useFetch,
  useGroups,
  useOrigins,
  useScientificNames,
  useSubspecies,
  useTypes
} from "../../core/hooks";
import { LangualCode, NutrientsValue, Origin, SingleFoodResult } from "../../core/types/SingleFoodResult";
import makeRequest from "../../core/utils/makeRequest";

export default function ModifyFoodDetail() {
  const { code } = useParams();
  const { t } = useTranslation();
  const { state } = useAuth();
  const token = state.token;

  const result = useFetch<SingleFoodResult>(`/foods/${code}`);
  const data = result.status === FetchStatus.Success ? result.data : null;
  const groups = useGroups();
  const types = useTypes();
  const scientificNames = useScientificNames();
  const subspecies = useSubspecies();
  const { regions } = useOrigins();

  const { addToast } = useToast();

  const [scientificNameAndSubspecies, setScientificNameAndSubspecies] = useState<{
    scientificName?: string;
    subspecies?: string;
  }>({
    scientificName: data?.scientificName,
    subspecies: data?.subspecies,
  });

  const normalizeValue = (value: string | undefined) => {
    return value?.trim() || undefined;
  };

  const handleScientificName = () => {
    const scientificNameId = scientificNames.nameToId
      .get(scientificNameAndSubspecies.scientificName ?? "");

    const payload = {
      scientificNameId: scientificNameId,
      scientificName: !scientificNameId
        ? normalizeValue(scientificNameAndSubspecies.scientificName)
        : undefined,
    };

    if (!payload.scientificNameId && payload.scientificName) {
      const name = payload.scientificName;
      makeRequest("post", "/scientific_names", {
        token: state.token,
        payload: { name },
        successCallback: () => {
          scientificNames.forceReload();
          setScientificNameAndSubspecies({
            ...scientificNameAndSubspecies,
            scientificName:
              name[0].toUpperCase() + name.slice(1).toLowerCase(),
          });
        },
        errorCallback: (error) => {
          console.error("Error al actualizar:", error.response?.data ?? error);
        },
      });
    } else if (payload.scientificNameId && payload.scientificName) {
      setScientificNameAndSubspecies({
        ...scientificNameAndSubspecies,
        scientificName: scientificNames.idToName.get(payload.scientificNameId.toString()),
      });
    }
  };

  const handleSubspecies = () => {
    const subspeciesId = subspecies.nameToId.get(scientificNameAndSubspecies.subspecies ?? "");

    const payload = {
      subspeciesId: subspeciesId,
      subspecies: !subspeciesId
        ? normalizeValue(scientificNameAndSubspecies.subspecies)
        : undefined,
    };

    if (!payload.subspeciesId && payload.subspecies) {
      const name = payload.subspecies;
      makeRequest("post", "/subspecies", {
        token: state.token,
        payload: { name },
        successCallback: () => {
          subspecies.forceReload();
          setScientificNameAndSubspecies({
            ...scientificNameAndSubspecies,
            subspecies: name[0].toUpperCase() + name.slice(1).toLowerCase(),
          });
        },
        errorCallback: (error) => {
          console.error("Error al actualizar:", error.response?.data ?? error);
        },
      });
    }
  };

  const [generalData, setGeneralData] = useState<{
    code: string;
    strain?: string;
    brand?: string;
    observation?: string;
    origins?: Origin[];
    langualCodes?: LangualCode[];
  }>({
    code: data?.code || "",
    strain: data?.strain,
    brand: data?.brand,
    observation: data?.observation,
    origins: data?.origins,
    langualCodes: data?.langualCodes,
  });

  const [namesAndIngredients, setNamesAndIngredients] = useState<{
    commonName: Record<"es" | "en" | "pt", string | undefined>;
    ingredients: Record<"es" | "en" | "pt", string | undefined>;
  }>({
    commonName: {
      es: data?.commonName.es || undefined,
      en: data?.commonName.en || undefined,
      pt: data?.commonName.pt || undefined,
    },
    ingredients: {
      es: data?.ingredients.es || undefined,
      en: data?.ingredients.en || undefined,
      pt: data?.ingredients.pt || undefined,
    },
  });

  const [groupAndTypeData, setGroupAndTypeData] = useState<{
    groupId: number | undefined;
    typeId: number | undefined;
  }>({
    groupId: groups.codeToId.get(data?.group.code || ""),
    typeId: types.codeToId.get(data?.type.code || ""),
  });

  const [nutrientValue, setNutrientValue] = useState<NutrientsValue>({
    energy: data?.nutrientMeasurements.energy || [],
    mainNutrients: data?.nutrientMeasurements.mainNutrients || [],
    micronutrients: {
      vitamins: data?.nutrientMeasurements.micronutrients?.vitamins || [],
      minerals: data?.nutrientMeasurements.micronutrients?.minerals || [],
    },
  });

  useEffect(() => {
    if (data) {
      const initialGeneralData = {
        code: data.code,
        strain: data.strain,
        brand: data.brand,
        observation: data.observation,
        origins: data.origins,
      };
      const initialSnameAndSubspecie = {
        scientificName: data.scientificName,
        subspecies: data.subspecies,
      };

      const initialNamesAndIngredients = {
        commonName: {
          es: data?.commonName?.es?.trim() || undefined,
          en: data?.commonName?.en?.trim() || undefined,
          pt: data?.commonName?.pt?.trim() || undefined,
        },
        ingredients: {
          es: data?.ingredients?.es?.trim() || undefined,
          en: data?.ingredients?.en?.trim() || undefined,
          pt: data?.ingredients?.pt?.trim() || undefined,
        },
      };

      const groupAndTypeDataForm = {
        groupId: groups.codeToId.get(data.group.code),
        typeId: types.codeToId.get(data.type.code),
      };
      const initialNutrientData = {
        energy: data.nutrientMeasurements.energy || [],
        mainNutrients: data.nutrientMeasurements.mainNutrients || [],
        micronutrients: {
          vitamins: data.nutrientMeasurements.micronutrients?.vitamins || [],
          minerals: data.nutrientMeasurements.micronutrients?.minerals || [],
        },
      };
      setScientificNameAndSubspecies(initialSnameAndSubspecie);
      setNutrientValue(initialNutrientData);
      setGeneralData(initialGeneralData);
      setNamesAndIngredients(initialNamesAndIngredients);
      setGroupAndTypeData(groupAndTypeDataForm);
    }
    // eslint-disable-next-line
  }, [data]);

  if (!data) {
    return <h2>{t("DetailFood.loading")}</h2>;
  }

  const handleUpdateNutrients = (updatedData: NutrientsValue) => {
    setNutrientValue(updatedData);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const processValue = (value: string) =>
      value.trim() === "" ? undefined : value;

    if (name.startsWith("commonName.") || name.startsWith("ingredients.")) {
      const [field, lang] = name.split(".");
      setNamesAndIngredients((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field as keyof typeof prevState],
          [lang]: processValue(value),
        },
      }));
    } else {
      setGeneralData((prevState) => ({
        ...prevState,
        [name]: processValue(value),
      }));
    }
  };

  const stringToNumberOrUndefined = (number: string | undefined): number | undefined => {
    if (!number?.trim()) {
      return;
    }

    const parsedNumber = +number.replace(",", ".");

    if (isNaN(parsedNumber)) {
      return;
    }

    return parsedNumber;
  };

  const getUniqueRegionIds = (): number[] | undefined => {
    const allRegionIds = [...regions.keys()] as number[];

    if (!generalData.origins) {
      return undefined;
    }

    return [
      ...new Set(
        generalData.origins.flatMap((origin) =>
          origin.id !== 0 ? origin.id : allRegionIds
        )
      ),
    ];
  };

  const getUniqueLangualCodeIds = (): number[] | undefined => {
    if (!generalData.langualCodes) return undefined;

    return [
      ...new Set(
        generalData.langualCodes.flatMap((langualCode) => [
          langualCode.id,
          ...langualCode.children.map((child) => child.id),
        ])
      ),
    ];
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      commonName: namesAndIngredients.commonName,
      ingredients: namesAndIngredients.ingredients,
      scientificNameId: scientificNames.nameToId.get(scientificNameAndSubspecies.scientificName ?? ""),
      subspeciesId: subspecies.nameToId.get(scientificNameAndSubspecies.subspecies ?? ""),
      groupId: groupAndTypeData.groupId,
      typeId: groupAndTypeData.typeId,
      strain: generalData.strain,
      brand: generalData.brand,
      observation: generalData.observation,
      originIds: getUniqueRegionIds(),
      nutrientMeasurements: [
        ...nutrientValue.energy.map((energy) => ({
          nutrientId: energy.nutrientId,
          average: stringToNumberOrUndefined(energy.average.toString()),
          deviation: stringToNumberOrUndefined(energy.deviation?.toString()),
          min: stringToNumberOrUndefined(energy.min?.toString()),
          max: stringToNumberOrUndefined(energy.max?.toString()),
          sampleSize:
            stringToNumberOrUndefined(energy.sampleSize?.toString()) ||
            undefined,
          dataType: energy.dataType,
          referencesCodes: energy.referenceCodes,
        })),
        ...nutrientValue.mainNutrients.flatMap((mainNutrient) => [
          {
            nutrientId: mainNutrient.nutrientId,
            average: stringToNumberOrUndefined(mainNutrient.average.toString()),
            deviation: stringToNumberOrUndefined(
              mainNutrient.deviation?.toString()
            ),
            min: stringToNumberOrUndefined(mainNutrient.min?.toString()),
            max: stringToNumberOrUndefined(mainNutrient.max?.toString()),
            sampleSize:
              stringToNumberOrUndefined(mainNutrient.sampleSize?.toString()) ||
              undefined,
            dataType: mainNutrient.dataType,
            referencesCodes: mainNutrient.referenceCodes,
          },
          ...(mainNutrient.components
            ? mainNutrient.components.map((component) => ({
              nutrientId: component.nutrientId,
              average: stringToNumberOrUndefined(
                component.average.toString()
              ),
              deviation: stringToNumberOrUndefined(
                component.deviation?.toString()
              ),
              min: stringToNumberOrUndefined(component.min?.toString()),
              max: stringToNumberOrUndefined(component.max?.toString()),
              sampleSize:
                stringToNumberOrUndefined(component.sampleSize?.toString()) ||
                undefined,
              dataType: component.dataType,
              referencesCodes: component.referenceCodes,
            }))
            : []),
        ]),
        ...nutrientValue.micronutrients.minerals.map((mineral) => ({
          nutrientId: mineral.nutrientId,
          average: stringToNumberOrUndefined(mineral.average.toString()),
          deviation: stringToNumberOrUndefined(mineral.deviation?.toString()),
          min: stringToNumberOrUndefined(mineral.min?.toString()),
          max: stringToNumberOrUndefined(mineral.max?.toString()),
          sampleSize:
            stringToNumberOrUndefined(mineral.sampleSize?.toString()) ||
            undefined,
          dataType: mineral.dataType,
          referencesCodes: mineral.referenceCodes,
        })),
        ...nutrientValue.micronutrients.vitamins.map((vitamin) => ({
          nutrientId: vitamin.nutrientId,
          average: stringToNumberOrUndefined(vitamin.average.toString()),
          deviation: stringToNumberOrUndefined(vitamin.deviation?.toString()),
          min: stringToNumberOrUndefined(vitamin.min?.toString()),
          max: stringToNumberOrUndefined(vitamin.max?.toString()),
          sampleSize:
            stringToNumberOrUndefined(vitamin.sampleSize?.toString()) ||
            undefined,
          dataType: vitamin.dataType,
          referencesCodes: vitamin.referenceCodes,
        })),
      ],
      langualCodes: getUniqueLangualCodeIds(),
    };
    console.log(payload);
    makeRequest("patch", `/foods/${code}`, {
      token,
      payload,
      successCallback: (response) => {
        console.log("Antes de addToast");
        addToast({
          type: "Success",
          message:
            response.data.message ||
            "Los cambios fueron realizados exitosamente",
          title: "Éxito",
          position: "middle-center",
          duration: 3000,
        });
        console.log("Después de addToast");
      },
      errorCallback: (error) => {
        if (axios.isAxiosError(error)) {
          if ((error.response?.status || -1) >= 400) {
            addToast({
              type: "Danger",
              message:
                error.response?.data?.message ||
                error.message ||
                "A ocurrido un error",
              title: "Error",
              position: "middle-center",
              duration: 5000,
            });
            return;
          }
          console.error(
            "Error en la solicitud:",
            error.response?.data || error.message
          );
        } else {
          console.error("Error desconocido:", error);
        }
      },
    });
  };

  const renderLanguageFields = (field: "commonName" | "ingredients") =>
    ["es", "en", "pt"].map((lang) => (
      <Form.Group as={Row} className="mb-3" key={`${field}.${lang}`}>
        <Form.Label column sm={2} className="text-sm-right">
          {field === "commonName" && lang === "es" ? (
            <RequiredFieldLabel
              label={`${t("DetailFood.name.title")} (${lang.toUpperCase()})`}
              tooltipMessage={t("DetailFood.required")}
            />
          ) : (
            `${
              field === "commonName"
                ? t("DetailFood.name.title")
                : t("DetailFood.ingredients.title")
            } (${lang.toUpperCase()})`
          )}
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            name={`${field}.${lang}`}
            value={namesAndIngredients[field][lang as "es" | "en" | "pt"]}
            onChange={handleInputChange}
            placeholder={`Enter ${field} in ${lang.toUpperCase()}`}
            className="form-control-md"
          />
        </Col>
      </Form.Group>
    ));

  return (
    <div className="detail-background">
      <Container className="custom-container-of-detail-page">
        <Form onSubmit={handleSubmit}>
          <Col md={12}>
            <div className="transparent-container">
              <Card className="mb-4">
                <Card.Header>
                  <h2 className="mb-0">{t("DetailFood.modify")}</h2>
                </Card.Header>
                <Card.Body>
                  <Form>
                    {/* Code Field */}
                    <Form.Group as={Row} className="mb-3" controlId="formCode">
                      <Form.Label column sm={2}>
                        <RequiredFieldLabel
                          label={t("DetailFood.code")}
                          tooltipMessage={t("DetailFood.required")}
                        />
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="text"
                          name="code"
                          value={generalData.code}
                          placeholder={t("DetailFood.enter")}
                          onChange={handleInputChange}
                          disabled
                        />
                      </Col>
                    </Form.Group>

                    <Card className="mb-4">
                      <Card.Header>
                        Nombres comunes e ingredientes
                      </Card.Header>
                      <Card.Body>
                        {renderLanguageFields("commonName")}
                        {renderLanguageFields("ingredients")}
                      </Card.Body>
                    </Card>

                    {/* Scientific Name */}
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formScientificName"
                    >
                      <Form.Label column sm={2}>
                        {t("DetailFood.name.scientific")}
                      </Form.Label>
                      <Col sm={10}>
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 me-2">
                            <SelectorWithInput
                              options={scientificNames.nameToId.map((id, name) => ({ id, name }))}
                              placeholder={t("DetailFood.selected")}
                              selectedValue={
                                scientificNameAndSubspecies?.scientificName
                              }
                              onSelect={(_, name) => {
                                setScientificNameAndSubspecies((prevState) => ({
                                  ...prevState,
                                  scientificName: name || undefined,
                                }));
                              }}
                            />
                          </div>
                          <Button
                            variant="primary"
                            onClick={handleScientificName}
                          >
                            {t("DetailFood.Apply")}
                          </Button>
                        </div>
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formSubspecies"
                    >
                      <Form.Label column sm={2}>
                        {t("DetailFood.subspecies")}
                      </Form.Label>
                      <Col sm={10}>
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 me-2">
                            <SelectorWithInput
                              options={subspecies.nameToId.map((id, name) => ({ id, name }))}
                              selectedValue={
                                scientificNameAndSubspecies?.subspecies
                              }
                              placeholder={t("DetailFood.selected")}
                              onSelect={(_, name) => {
                                setScientificNameAndSubspecies((prevState) => ({
                                  ...prevState,
                                  subspecies: name || undefined,
                                }));
                              }}
                            />
                          </div>
                          <Button variant="primary" onClick={handleSubspecies}>
                            {t("DetailFood.Apply")}
                          </Button>
                        </div>
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formStrain"
                    >
                      <Form.Label column sm={2}>
                        Variante
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="text"
                          name="strain"
                          value={generalData.strain}
                          onChange={handleInputChange}
                          placeholder={"Escribe la variante"}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formGroup">
                      <Form.Label column sm={2}>
                        <RequiredFieldLabel
                          label={t("DetailFood.label_group")}
                          tooltipMessage={t("DetailFood.required")}
                        />
                      </Form.Label>
                      <Col sm={10}>
                        <OriginSelector
                          selectedValue={groups.idToName.get(groupAndTypeData.groupId?.toString() ?? "") ?? ""}
                          options={groups.codeToId.map((id, name) => ({ id, name }))}
                          placeholder={"Nada seleccionado"}
                          onSelect={(id) => {
                            setGroupAndTypeData((prevState) => ({
                              ...prevState,
                              groupId: id || 0,
                            }));
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formType">
                      <Form.Label column sm={2}>
                        <RequiredFieldLabel
                          label={t("DetailFood.label_type")}
                          tooltipMessage={t("DetailFood.required")}
                        />
                      </Form.Label>
                      <Col sm={10}>
                        <OriginSelector
                          selectedValue={types.idToName.get(groupAndTypeData.typeId?.toString() ?? "") ?? ""}
                          options={types.codeToId.map((id, name) => ({ id, name }))}
                          placeholder={"Nada seleccionado"}
                          onSelect={(id) => {
                            setGroupAndTypeData((prevState) => ({
                              ...prevState,
                              typeId: id || 0,
                            }));
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formBrand">
                      <Form.Label column sm={2}>
                        {t("DetailFood.brand")}
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="text"
                          name="brand"
                          value={generalData.brand}
                          onChange={handleInputChange}
                          placeholder="Escriba la marca"
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formObservation"
                    >
                      <Form.Label column sm={2}>
                        {t("DetailFood.observation")}
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="text"
                          name="observation"
                          value={generalData.observation}
                          onChange={handleInputChange}
                          placeholder={"Escriba la observación"}
                        />
                      </Col>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>

          <Col className="mt-4">
            <Col>
              <div
                style={{
                  backgroundColor: "#d1e7dd",
                  padding: "20px",
                  borderRadius: "5px",
                }}
              >
                <Tab.Container defaultActiveKey="first">
                  <Nav
                    variant="tabs"
                    justify
                    className="mb-3"
                    style={{
                      borderBottom: "1px solid #d1e7dd",
                    }}
                  >
                    <Nav.Item>
                      <Nav.Link
                        eventKey="first"
                        className="custom-tab-link text-center px-4"
                      >
                        {t("DetailFood.labels.Nutritional")}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="second"
                        className="custom-tab-link text-center px-4"
                      >
                        {t("DetailFood.references.title")}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="third"
                        className="custom-tab-link text-center px-4"
                      >
                        {t("DetailFood.labels.data")}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <div style={{ textAlign: "center", borderRadius: "5px" }}>
                        <NutrientAccordionModify
                          data={nutrientValue}
                          onUpdate={handleUpdateNutrients}
                        />
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <h4>{t("DetailFood.references.nutrients")}</h4>
                      <ReferencesList references={data.references}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <h4>{t("DetailFood.codes")}</h4>
                      <LangualCodeComponent data={data.langualCodes}/>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </Col>
          </Col>
          <Col md={12}>
            <button
              className="button-submit w-100"
              type="submit"
              onClick={handleSubmit}
            >
              {t("DetailFood.save")}
            </button>
          </Col>
        </Form>
      </Container>

      <Footer/>
    </div>
  );
}
