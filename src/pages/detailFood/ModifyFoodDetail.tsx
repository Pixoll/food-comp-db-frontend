import { Button, Col, Container, Form, Nav, Row, Tab } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../assets/css/_DetailPage.css";
import NutrientAccordionModify from "../../core/components/detailFood/NutrientAccordionModify";
import Footer from "../../core/components/Footer";
import useFetch from "../../core/hooks/useFetch";
import { SingleFoodResult } from "../../core/types/SingleFoodResult";
import ReferencesList from "../../core/components/detailFood/ReferencesList";
import LengualCodeComponent from "../../core/components/detailFood/LengualCodeComponent";
import RequiredFieldLabel from "../../core/components/detailFood/RequiredFieldLabel";
import { useTranslation } from "react-i18next";

export default function ModifyFoodDetail() {
  const [key, setKey] = useState("first");
  const { code } = useParams();
  const { data } = useFetch<SingleFoodResult>(
    `http://localhost:3000/api/v1/foods/${code}`
  );
  const {t} = useTranslation("global");
  const [generalData, setGeneralData] = useState({
    code: "",
    strain: "",
    brand: "",
    observation: "",
    scientificName: "",
    subspecies: "",
  });

  const [namesAndIngredients, setNamesAndIngredients] = useState<{
    commonName: Record<"es" | "en" | "pt", string>;
    ingredients: Record<"es" | "en" | "pt", string>;
  }>({
    commonName: { es: "", en: "", pt: "" },
    ingredients: { es: "", en: "", pt: "" },
  });

  const [groupAndTypeData, setGroupAndTypeData] = useState<{
    group: { code: string; name: string };
    type: { code: string; name: string };
  }>({
    group: { code: "", name: "" },
    type: { code: "", name: "" },
  });
  useEffect(() => {
    if (data) {
      const initialGeneralData = {
        code: data.code || "",
        strain: data.strain || "",
        brand: data.brand || "",
        observation: data.observation || "",
        scientificName: data.scientificName || "",
        subspecies: data.subspecies || "",
      };

      const initialNamesAndIngredients = {
        commonName: {
          es: data.commonName?.es || "",
          en: data.commonName?.en || "",
          pt: data.commonName?.pt || "",
        },
        ingredients: {
          es: data.ingredients?.es || "",
          en: data.ingredients?.en || "",
          pt: data.ingredients?.pt || "",
        },
      };

      const initialGroupAndTypeData = {
        group: {
          code: data.group?.code || "",
          name: data.group?.name || "",
        },
        type: {
          code: data.type?.code || "",
          name: data.type?.name || "",
        },
      };

      setGeneralData(initialGeneralData);
      setNamesAndIngredients(initialNamesAndIngredients);
      setGroupAndTypeData(initialGroupAndTypeData);
    }
  }, [data]);

  if (!data) {
    return <h2>{t('DetailFood.loading')}</h2>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("commonName.") || name.startsWith("ingredients.")) {
      const [field, lang] = name.split("."); // Ej.: "commonName.es" -> ["commonName", "es"]
      setNamesAndIngredients((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field as keyof typeof prevState], // Garantiza que sea "commonName" o "ingredients"
          [lang]: value,
        },
      }));
    } else if (name.startsWith("group.") || name.startsWith("type.")) {
      const [field, key] = name.split("."); // Ej.: "group.name" -> ["group", "name"]
      setGroupAndTypeData((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field as keyof typeof prevState], // Garantiza que sea "group" o "type"
          [key]: value,
        },
      }));
    } else {
      setGeneralData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos guardados:", {
      generalData,
      groupAndTypeData,
      namesAndIngredients,
    });
  };

  const renderLanguageFields = (field: "commonName" | "ingredients") =>
    ["es", "en", "pt"].map((lang) => (
      <Form.Group as={Row} className="mb-3" key={`${field}.${lang}`}>
        <Form.Label column sm={2}>
          {field === "commonName" && lang === "es" ? (
            <>
              <RequiredFieldLabel
              label={`${t('DetailFood.name.title')} (${lang.toUpperCase()})`}
              tooltipMessage={t('DetailFood.required')}
              />
            </>
          ) : (
            `${field === "commonName" ? t('DetailFood.name.title') : t('DetailFood.ingredients.title')} (${lang.toUpperCase()})`
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
            <h2>{t('DetailFood.modify')}</h2>
            
              <Form.Group as={Row} className="mb-3" controlId="formCode">
                <Form.Label column sm={2}>
                  <RequiredFieldLabel
                    label={t('DetailFood.code')}
                    tooltipMessage={t('DetailFood.required')}
                  />
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    name="code"
                    value={generalData.code}
                    placeholder={t('DetailFood.enter')}
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
                {t('DetailFood.name.scientific')}
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

              <Form.Group as={Row} className="mb-3" controlId="formSubspecies">
                <Form.Label column sm={2}>
                  {t('DetailFood.subspecies')}
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
                    label={t('DetailFood.label_group')}
                    tooltipMessage={t('DetailFood.required')}
                  />
                </Form.Label>
                <Col sm={5}>
                  <Form.Control
                    type="text"
                    name="group.name"
                    value={groupAndTypeData.group.name}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col sm={5}>
                  <Form.Control
                    type="text"
                    name="group.code"
                    value={groupAndTypeData.group.code}
                    onChange={handleInputChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formType">
                <Form.Label column sm={2}>
                <RequiredFieldLabel
                    label={t('DetailFood.label_type')}
                    tooltipMessage={t('DetailFood.required')}
                  />
                </Form.Label>
                <Col sm={5}>
                  <Form.Control
                    type="text"
                    name="type.name"
                    value={groupAndTypeData.type.name}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col sm={5}>
                  <Form.Control
                    type="text"
                    name="type.code"
                    value={groupAndTypeData.type.code}
                    onChange={handleInputChange}
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
                      {t('DetailFood.labels.Nutritional')}
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
                      {t('DetailFood.references.title')}
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
                      {t('DetailFood.labels.data')}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div style={{ textAlign: "center", borderRadius: "5px" }}>
                      <NutrientAccordionModify
                        data={
                          data?.nutrientMeasurements ?? {
                            energy: [],
                            mainNutrients: [],
                            micronutrients: { vitamins: [], minerals: [] },
                          }
                        }
                      />
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <h4>{t('DetailFood.references.nutrients')}</h4>
                    <ReferencesList references={data.references} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <h4>{t('DetailFood.codes')}</h4>
                    <LengualCodeComponent data={data.langualCodes} />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Col>
        </Row>
        <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 10, offset: 2 }}>
                  <Button type="submit">{t('DetailFood.save')}</Button>
                </Col>
              </Form.Group>
        </Form>
      </Container>

      <Footer />
    </div>
  );
}
