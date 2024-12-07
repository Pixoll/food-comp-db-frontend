import { Button, Col, Container, Form, Nav, Row, Tab } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../assets/css/_DetailPage.css";
import NutrientAccordionModify from "../../core/components/detailFood/NutrientAccordionModify";
import Footer from "../../core/components/Footer";
import useFetch, { FetchStatus } from "../../core/hooks/useFetch";
import {
  SingleFoodResult,
  NutrientsValue,
} from "../../core/types/SingleFoodResult";
import ReferencesList from "../../core/components/detailFood/ReferencesList";
import LengualCodeComponent from "../../core/components/detailFood/LengualCodeComponent";
import RequiredFieldLabel from "../../core/components/detailFood/RequiredFieldLabel";
import { useTranslation } from "react-i18next";
import OriginSelector from "../../core/components/adminPage/OriginSelector";
import useGroups from "../../core/components/adminPage/getters/useGroups";
import useTypes from "../../core/components/adminPage/getters/useTypes";


export default function ModifyFoodDetail() {
  const [key, setKey] = useState("first");
  const { code } = useParams();
  const result = useFetch<SingleFoodResult>(
    `http://localhost:3000/api/v1/foods/${code}`
  );
  const data = result.status === FetchStatus.Success ? result.data : null;

  const groupsResult = useGroups();
  const typesResult = useTypes();

  const groups =
    groupsResult.status === FetchStatus.Success ? groupsResult.data : [];
  const types =
    typesResult.status === FetchStatus.Success ? typesResult.data : [];

  const { t } = useTranslation("global");
  
  const searchGroupByCode = (code: string): number | undefined => {
    const group = groups.find((group) => group.code === code);
    return group ? group.id : undefined;
  };
  const searchTypeByCode = (code: string): number | undefined => {
    const type = types.find((type) => type.code === code);
    return type ? type.id : undefined;
  };

  const searchNameGroupByID = (id: number): string => {
    const group = groups.find((group) => group.id === id);
    return group ? group.name : "";
  };
  const searchNameTypeByID = (id: number): string => {
    const type = types.find((type) => type.id === id);
    return type ? type.name : "";
  };
  const [generalData, setGeneralData] = useState<{
    code: string;
    strain?: string;
    brand?: string;
    observation?: string;
    scientificName?: string;
    subspecies?: string;
  }>({
    code: data?.code || "",
    strain: data?.strain,
    brand: data?.brand,
    observation: data?.observation,
    scientificName: data?.scientificName,
    subspecies: data?.subspecies,
  });

    const [namesAndIngredients, setNamesAndIngredients] = useState<{
      commonName: Record<"es", string> & Record<"en" | "pt", string | undefined>;
    ingredients: Record<"es" | "en" | "pt", string | undefined>;
    }>({
      commonName: { es: data?.commonName.es || "", en: "", pt: "" },
      ingredients: { es: "", en: "", pt: "" },
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
        scientificName: data.scientificName,
        subspecies: data.subspecies,
      };

      const initialNamesAndIngredients = {
        commonName: {
          es: data?.commonName?.es || "",
          en: data?.commonName?.en?.trim() === "" ? undefined : data?.commonName?.en,
          pt: data?.commonName?.pt?.trim() === "" ? undefined : data?.commonName?.pt,
        },
        ingredients: {
          es: data?.ingredients?.es?.trim() === "" ? undefined : data?.ingredients?.es,
          en: data?.ingredients?.en?.trim() === "" ? undefined : data?.ingredients?.en,
          pt: data?.ingredients?.pt?.trim() === "" ? undefined : data?.ingredients?.pt,
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
  
    const processValue = (value: string) => value.trim() === "" ? undefined : value;
  
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
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos guardados:", {
      generalData,
      groupAndTypeData,
      namesAndIngredients,
      nutrientValue,
    });
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
      <Container>
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

              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formScientificName"
              >
                <Form.Label column sm={2}>
                  {t("DetailFood.name.scientific")}
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    name="scientificName"
                    value={generalData.scientificName}
                    onChange={handleInputChange}
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
              <Form.Group as={Row} className="mb-3" controlId="fromStrain">
                <Form.Label column sm={2}>
                  {"Cepa: "}
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
              <Form.Group as={Row} className="mb-3" controlId="formSubspecies">
                <Form.Label column sm={2}>
                  {t("DetailFood.subspecies")}
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    name="subspecies"
                    value={generalData.subspecies}
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
                      groupAndTypeData.groupId || -1
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
                    selectedValue={searchNameTypeByID(groupAndTypeData.typeId || -1)}
                    options={types.map((type) => ({
                      id: type.id,
                      name: type.name,
                    }))}
                    placeholder={t("DetailFood.placeholder_type")}
                    onSelect={(id) => {
                      setGroupAndTypeData((prevState) => ({
                        ...prevState,
                        typeId: id || 0,
                      }));
                    }}
                  />
                </Col>
              </Form.Group>

              {renderLanguageFields("ingredients")}
            </div>
          </Col>

          <Row className="mt-4">
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
                    className="mb-3"
                    style={{ borderBottom: "2px solid #d1e7dd" }}
                    activeKey={key}
                    onSelect={(k) => setKey(k as string)}
                  >
                    <Nav.Item>
                      <Nav.Link
                        eventKey="first"
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "5px 5px 0 0",
                          border: "1px solid #d1e7dd",
                          marginRight: "5px",
                          color: "#0d6efd",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        {t("DetailFood.labels.Nutritional")}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="second"
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "5px 5px 0 0",
                          border: "1px solid #d1e7dd",
                          marginRight: "5px",
                          color: "#0d6efd",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        {t("DetailFood.references.title")}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="third"
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "5px 5px 0 0",
                          border: "1px solid #d1e7dd",
                          color: "#0d6efd",
                          transition: "background-color 0.3s ease",
                        }}
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
          </Row>
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit">{t("DetailFood.save")}</Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>

      <Footer />
    </div>
  );
}
