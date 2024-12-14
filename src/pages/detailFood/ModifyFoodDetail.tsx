import { Button, Col, Container, Form, Nav, Row, Tab } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../assets/css/_ModifyDetailFood.css";
import NutrientAccordionModify from "../../core/components/detailFood/NutrientAccordionModify";
import SelectorWithInput from "../../core/components/detailFood/SelectorWithInput";
import Footer from "../../core/components/Footer";
import useFetch, { FetchStatus } from "../../core/hooks/useFetch";
import { useToast } from "../../core/context/ToastContext";
import ToastComponent from "../../core/components/ToastComponent";
import {
  SingleFoodResult,
  NutrientsValue,
  Origin,
  LangualCode,
} from "../../core/types/SingleFoodResult";
import axios from "axios";
import ReferencesList from "../../core/components/detailFood/ReferencesList";
import LengualCodeComponent from "../../core/components/detailFood/LengualCodeComponent";
import RequiredFieldLabel from "../../core/components/detailFood/RequiredFieldLabel";
import { useTranslation } from "react-i18next";
import OriginSelector from "../../core/components/adminPage/OriginSelector";
import useGroups from "../../core/components/adminPage/getters/useGroups";
import useTypes from "../../core/components/adminPage/getters/useTypes";
import useScientificNames from "../../core/components/adminPage/getters/useScientificNames";
import useSubspecies from "../../core/components/adminPage/getters/useSubspecies";
import useOrigins from "../../core/components/adminPage/getters/useOrigins";
import { useAuth } from "../../core/context/AuthContext";
import makeRequest from "../../core/utils/makeRequest";

export default function ModifyFoodDetail() {
  const { code } = useParams();
  const result = useFetch<SingleFoodResult>(`/foods/${code}`);
  const data = result.status === FetchStatus.Success ? result.data : null;
  const groupsResult = useGroups();
  const typesResult = useTypes();
  const { addToast } = useToast();

  const { state } = useAuth();
  const token = state.token;
  const scientificNamesResult = useScientificNames();
  const subspeciesResult = useSubspecies();

  const { regions } = useOrigins();

  const groups =
    groupsResult.status === FetchStatus.Success ? groupsResult.data : [];
  const types =
    typesResult.status === FetchStatus.Success ? typesResult.data : [];

  const scientificNames =
    scientificNamesResult.status === FetchStatus.Success
      ? scientificNamesResult.data
      : [];
  const subspecies =
    subspeciesResult.status === FetchStatus.Success
      ? subspeciesResult.data
      : [];

  const { t } = useTranslation("global");

  const searchGroupByCode = (code: string): number | undefined => {
    const group = groups.find((group) => group.code === code);
    return group?.id;
  };
  const searchTypeByCode = (code: string): number | undefined => {
    const type = types.find((type) => type.code === code);
    return type?.id;
  };

  const searchNameGroupByID = (id: number | undefined): string => {
    const group = groups.find((group) => group.id === id);
    return group?.name || "";
  };
  const searchNameTypeByID = (id: number): string => {
    const type = types.find((type) => type.id === id);
    return type?.name || "";
  };
  const [scientificNameAndSubspecies, setScientificNameAndSubspecies] =
    useState<{
      scientificName?: string;
      subspecies?: string;
    }>({
      scientificName: data?.scientificName,
      subspecies: data?.subspecies,
    });

  const searchScientificNameByName = (
    name: string | undefined
  ): number | undefined => {
    const scientificName = scientificNames.find((sn) => sn.name === name);
    return scientificName?.id;
  };
  const searchSubspeciesByName = (
    name: string | undefined
  ): number | undefined => {
    const result = subspecies.find((sp) => sp.name === name);
    return result?.id;
  };

  const searchScientificNameById = (
    id: number | undefined
  ): string | undefined => {
    const scientificName = scientificNames.find((sn) => sn.id === id);
    return scientificName?.name;
  };
  const searchSubspeciesNameById = (
    id: number | undefined
  ): string | undefined => {
    const result = subspecies.find((sp) => sp.id === id);
    return result?.name;
  };
  const normalizeValue = (value: string | undefined) => {
    return value?.trim() || undefined;
  };
  const handleScientificName = () => {
    const scientificNameId = searchScientificNameByName(
      scientificNameAndSubspecies.scientificName
    );
  
    const payload = {
      scientificNameId: scientificNameId,
      scientificName: !scientificNameId
        ? normalizeValue(scientificNameAndSubspecies.scientificName)
        : undefined,
    };
  
    if (!payload.scientificNameId && payload.scientificName) {
      const name = payload.scientificName;
      makeRequest(
        "post",
        "/scientific_names",
        { name },
        state.token,
        (response) => {
          if (scientificNamesResult.status !== FetchStatus.Loading) {
            scientificNamesResult.forceReload();
            setScientificNameAndSubspecies({
              ...scientificNameAndSubspecies,
              scientificName: name[0].toUpperCase() + name.slice(1).toLowerCase(),
            });
          }
        },
        (error) => {
          console.error("Error al actualizar:", error.response?.data ?? error);
        }
      );
    }else if(payload.scientificNameId && payload.scientificName){
      setScientificNameAndSubspecies({
        ...scientificNameAndSubspecies,
        scientificName: searchScientificNameById(payload.scientificNameId)
      })
    }
  };

  const handleSubspecies = () => {
    const subspeciesId = searchSubspeciesByName(
      scientificNameAndSubspecies.subspecies
    );
    
    const payload = {
      subspeciesId: subspeciesId,
      subspecies: !subspeciesId
        ? normalizeValue(scientificNameAndSubspecies.subspecies)
        : undefined,
    };
    
    if (!payload.subspeciesId && payload.subspecies) {
      const name = payload.subspecies;
      makeRequest(
        "post",
        "/subspecies",
        { name },
        state.token,
        (response) => {
          
          if (subspeciesResult.status !== FetchStatus.Loading) {
            subspeciesResult.forceReload();
            setScientificNameAndSubspecies({
              ...scientificNameAndSubspecies,
              subspecies: name[0].toUpperCase() + name.slice(1).toLowerCase(),
            });
          }
        },
        (error) => {
          console.error("Error al actualizar:", error.response?.data ?? error);
        }
      );
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
    groupId: searchGroupByCode(data?.group.code || ""),
    typeId: searchTypeByCode(data?.type.code || ""),
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
        groupId: searchGroupByCode(data.group.code),
        typeId: searchTypeByCode(data.type.code),
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
  }, [data]);

  if (!data) {
    return <h2>{t("DetailFood.loading")}</h2>;
  }
  const handleUpdateNutrients = (updatedData: NutrientsValue) => {
    setNutrientValue(updatedData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const stringToNumberOrUndefined = (
    number: string | undefined
  ): number | undefined => {
    if (!number?.trim()) {
      return undefined;
    }

    const parsedNumber = +number.replace(",", ".");

    if (isNaN(parsedNumber)) {
      return undefined;
    }

    return parsedNumber;
  };

  const getUniqueRegionIds = (): number[] | undefined => {
    const allRegionIds = [...regions.keys()] as number[];

    if (!generalData.origins) {
      return undefined;
    }
    const uniqueRegionIds = [
      ...new Set(
        generalData.origins.flatMap((origin) =>
          origin.id !== 0 ? origin.id : allRegionIds
        )
      ),
    ];

    return uniqueRegionIds;
  };

  const getUniqueLangualCodeIds = (): number[] | undefined => {
    if (!generalData.langualCodes) return undefined;

    const uniqueLangualCodeIds = [
      ...new Set(
        generalData.langualCodes.flatMap((langualCode) => [
          langualCode.id,
          ...langualCode.children.map((child) => child.id),
        ])
      ),
    ];

    return uniqueLangualCodeIds;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      commonName: namesAndIngredients.commonName,
      ingredients: namesAndIngredients.ingredients,
      scientificNameId: searchScientificNameByName(scientificNameAndSubspecies.scientificName),
      subspeciesId: searchSubspeciesByName(scientificNameAndSubspecies.subspecies),
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
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/foods/${code}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Antes de addToast");
      addToast({
        type: "Success",
        message:
          response.data.message ||
          "Los cambios fueron realizados exitosamente",
        title: "Éxito",
        duration: 5000,
      });
      console.log("Después de addToast");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if ((error.response?.status || -1) < 400) {
          return;
        }
        console.error(
          "Error en la solicitud:",
          error.response?.data || error.message
        );
        addToast({
          type: 'Danger',
          message: error.response?.data || error.message || 'A ocurrido un error',
          title: 'Error',
          duration: 5000
        });
      } else {
        console.error("Error desconocido:", error);
      }
    }
  };

  const renderLanguageFields = (field: "commonName" | "ingredients") =>
    ["es", "en", "pt"].map((lang) => (
      <Form.Group as={Row} className="mb-3" key={`${field}.${lang}`}>
        <Form.Label column sm={2}>
          {field === "commonName" && lang === "es" ? (
            <>
              <RequiredFieldLabel
                label={`${t("DetailFood.name.title")} (${lang.toUpperCase()})`}
                tooltipMessage={t("DetailFood.required")}
              />
            </>
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
              <h2>{t("DetailFood.modify")}</h2>
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
                  />
                </Col>
              </Form.Group>
              {renderLanguageFields("commonName")}
              {renderLanguageFields("ingredients")}
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formScientificName"
              >
                <Form.Label column sm={2}>
                  {t("DetailFood.name.scientific")}
                </Form.Label>
                <Col sm={10}>
                  <div className="d-flex justify-content-between align-items-stretch">
                    <div style={{ flex: 1, marginRight: "10px" }}>
                      <SelectorWithInput
                        options={scientificNames}
                        placeholder={t("DetailFood.selected")}
                        selectedValue={
                          scientificNameAndSubspecies?.scientificName
                        }
                        onSelect={(id, name) => {
                          setScientificNameAndSubspecies((prevState) => ({
                            ...prevState,
                            scientificName: name || undefined,
                          }));
                        }}
                      />
                    </div>
                    <Button
                      style={{ alignSelf: "stretch" }}
                      onClick={handleScientificName}
                    >
                      {t("DetailFood.Apply")}
                    </Button>
                  </div>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="formSubspecies">
                <Form.Label column sm={2}>
                  {t("DetailFood.subspecies")}
                </Form.Label>
                <Col sm={10}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div style={{ flex: 1, marginRight: "10px" }}>
                      <SelectorWithInput
                        options={subspecies}
                        selectedValue={scientificNameAndSubspecies?.subspecies}
                        placeholder={t("DetailFood.selected")}
                        onSelect={(id, name) => {
                          setScientificNameAndSubspecies((prevState) => ({
                            ...prevState,
                            subspecies: name || undefined,
                          }));
                        }}
                      />
                    </div>
                    <Button
                      style={{ alignSelf: "stretch" }}
                      onClick={handleSubspecies}
                    >
                      {t("DetailFood.Apply")}
                    </Button>
                  </div>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="fromStrain">
                <Form.Label column sm={2}>
                  {"Variante: "}
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    name="strain"
                    value={generalData.strain}
                    onChange={handleInputChange}
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
                    selectedValue={searchNameGroupByID(
                      groupAndTypeData.groupId
                    )}
                    options={groups.map((group) => ({
                      id: group.id,
                      name: group.name,
                    }))}
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
                    selectedValue={searchNameTypeByID(
                      groupAndTypeData.typeId || -1
                    )}
                    options={types.map((type) => ({
                      id: type.id,
                      name: type.name,
                    }))}
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
                  {"Marca: "}
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={generalData.brand}
                    onChange={handleInputChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="formObservation">
                <Form.Label column sm={2}>
                  {"Observación: "}
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    name="observation"
                    value={generalData.observation}
                    onChange={handleInputChange}
                  />
                </Col>
              </Form.Group>
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
                      <ReferencesList references={data.references} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <h4>{t("DetailFood.codes")}</h4>
                      <LengualCodeComponent data={data.langualCodes} />
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

      <Footer />
    </div>
  );
}
