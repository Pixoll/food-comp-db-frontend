import { useState } from "react";
import "@/assets/css/_DetailPage.css";
import { Card, Col, Container, ListGroup, Nav, Row, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Graphic, LangualCodeComponent, NutrientAccordion, ReferencesList, } from "@/core/components/detailFood";
import Footer from "@/app/components/Footer";
import { FetchStatus, useFetch } from "@/hooks";
import { SingleFoodResult } from "@/types/SingleFoodResult";
//import imagen from '@/assets/images/admin_login_bg.jpg';
import ImageCarousel from '@/core/components/detailFood/ImageCarousel';
import imagen1 from '@/assets/images/imagen1.jpg';
import imagen2 from '@/assets/images/imagen2.jpg';
import imagen3 from '@/assets/images/imagen3.jpg';

export default function DetailPage() {
  const { t } = useTranslation();
  const [key, setKey] = useState<string>("first");
  const [images] = useState([imagen1.src, imagen2.src, imagen3.src]);

  const handleReferenceClick = () => {
    setKey("second");
  };

  const { code } = useParams();
  const [grams, setGrams] = useState<number>(100);
  const [inputGrams, setInputGrams] = useState<number>(100);

  const result = useFetch<SingleFoodResult>(`/foods/${code?.toString()}`);

  if (result.status !== FetchStatus.Success) {
    return <h2>Cargando...</h2>;
  }

  const { data } = result;
  console.log(data);
  
  const colors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28CC3",
    "#FF6361",
    "#BC5090",
    "#58508D",
    "#003F5C",
    "#FFA600",
    "#2F4B7C",
    "#665191",
    "#D45087",
    "#F95D6A",
    "#FF7C43",
    "#1F77B4",
    "#AEC7E8",
    "#FF9896",
    "#98DF8A",
    "#C5B0D5",
    "#FFBB78",
    "#9467BD",
    "#C49C94",
    "#E377C2",
    "#F7B6D2",
    "#7F7F7F",
    "#C7C7C7",
    "#BCBD22",
    "#DBDB8D",
    "#17BECF",
  ];


  
  

  const references = data.references ?? [];
  const mainNutrients = data.nutrientMeasurements?.macronutrients ?? [];

  const graphicData =
    mainNutrients
      .filter((mainNutrient) => mainNutrient.nutrientId !== 12)
      .map((mainNutrient, index) => ({
        name: mainNutrient.name,
        value: +((grams / 100) * mainNutrient.average).toFixed(2),
        fill: colors[index % colors.length],
      })) || [];

  const graphicDataPercent =
    mainNutrients
      .filter(
        (mainNutrient) =>
          mainNutrient.nutrientId !== 12 && mainNutrient.nutrientId !== 1
      )
      .map((mainNutrient, index) => ({
        name: mainNutrient.name,
        value: +(((grams / 100) * mainNutrient.average) / 100).toFixed(2),
        fill: colors[index % colors.length],
      })) || [];

  const handleGramsChange = () => {
    setGrams(inputGrams);
  };

  return (
    <div className="detail-background">
      <Container
        className="custom-container-of-detail-page mt-1 mb-1 ml-1 mr-1"
        fluid="xxl"
      >
        <Col>
          <Col>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="text-dark mb-4">
                  {t("DetailFood.title")}
                </Card.Title>

                <Row className="mb-3">
                  <Col md={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>{t("DetailFood.code")}: </strong>
                        {code}
                      </ListGroup.Item>

                      {data.commonName.es && (
                        <ListGroup.Item>
                          <strong>{t("DetailFood.name.Spanish")} </strong>
                          {data.commonName.es}
                        </ListGroup.Item>
                      )}

                      {data.commonName.pt && (
                        <ListGroup.Item>
                          <strong>{t("DetailFood.name.Portuguese")}: </strong>
                          {data.commonName.pt}
                        </ListGroup.Item>
                      )}

                      {data.commonName.en && (
                        <ListGroup.Item>
                          <strong>{t("DetailFood.name.English")} </strong>
                          {data.commonName.en}
                        </ListGroup.Item>
                      )}

                      {data.scientificName && (
                        <ListGroup.Item>
                          <strong>{t("DetailFood.name.scientific")} </strong>
                          {data.scientificName}
                        </ListGroup.Item>
                      )}

                      {data.subspecies && (
                        <ListGroup.Item>
                          <strong>{t("DetailFood.subspecies")} </strong>
                          {data.subspecies}
                        </ListGroup.Item>
                      )}
                    
                    {data.strain && (
                        <ListGroup.Item>
                          <strong>{t("DetailFood.strain")}</strong>
                          {data.strain}
                        </ListGroup.Item>
                      )}

                      {data.brand && (
                        <ListGroup.Item>
                          <strong>{t("DetailFood.brand")} </strong>
                          {data.brand}
                        </ListGroup.Item>
                      )}

                      {data.observation && (
                        <ListGroup.Item>
                          <strong>{t("DetailFood.observation")} </strong>
                          {data.observation}
                        </ListGroup.Item>
                      )}

                      <ListGroup.Item>
                        <strong>{t("DetailFood.group")} </strong>
                        {data.group.name}
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <strong>{t("DetailFood.type")} </strong>
                        {data.type.name}
                      </ListGroup.Item>
                      </ListGroup>
                  </Col>

                  <Col md={6}>
                  <ImageCarousel images={images} />
                  {data.origins && data.origins.length > 0 && (
                      <Card className="mb-3">
                        <Card.Body>
                          <Card.Subtitle className="mb-3 text-muted">
                            {"Orígenes"}
                          </Card.Subtitle>
                          {data.origins.map((origin, index) => (
                            <p key={index}>
                              <strong>
                                {"Origen"} {index + 1}:{" "}
                              </strong>
                              {origin.name}
                            </p>
                          ))}
                        </Card.Body>
                      </Card>
                    )}
                    {(data.ingredients.es ||
                      data.ingredients.en ||
                      data.ingredients.pt) && (
                      <Card>
                        <Card.Body>
                          <Card.Subtitle className="mb-3 text-muted">
                            {"Ingredientes"}
                          </Card.Subtitle>

                          {data.ingredients.es && (
                            <p>
                              <strong>
                                {t("DetailFood.ingredients.Spanish")}{" "}
                              </strong>
                              {data.ingredients.es}
                            </p>
                          )}

                          {data.ingredients.pt && (
                            <p>
                              <strong>
                                {t("DetailFood.ingredients.Portuguese")}{" "}
                              </strong>
                              {data.ingredients.pt}
                            </p>
                          )}

                          {data.ingredients.en && (
                            <p>
                              <strong>
                                {t("DetailFood.ingredients.English")}{" "}
                              </strong>
                              {data.ingredients.en}
                            </p>
                          )}
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <div className="transparent-container">
              <Row>
                <Col md={6}>
                  <Graphic
                    key={grams}
                    data={graphicData}
                    title={t("DetailFood.graphics.title_L")}
                  />
                </Col>
                <Col md={6}>
                  <Graphic
                    key={grams}
                    data={graphicDataPercent}
                    title={t("DetailFood.graphics.title_R")}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <div style={{ textAlign: "center" }}>
                    <input
                      type="number"
                      value={inputGrams}
                      onChange={(e) => setInputGrams(+e.target.value)}
                      placeholder={t("DetailFood.grams.enter")}
                      min={1}
                      style={{
                        marginRight: "10px",
                        padding: "5px",
                        width: "120px",
                      }}
                    />
                    <button
                      onClick={handleGramsChange}
                      className="change-grams-button"
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#0d6efd",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      {t("DetailFood.grams.change")}
                    </button>
                    <p>
                      {t("DetailFood.grams.current")} {grams}g
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Col>

        <Row className="mt-4">
          <Col>
            <div
              style={{
                backgroundColor: "#d1e7dd",
                padding: "20px 10px 5px 15px",
                borderRadius: "5px",
                height: "auto",
              }}
            >
              <Tab.Container
                activeKey={key}
                onSelect={(k) => setKey(k as string)}
              >
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
                    <NutrientAccordion
                      data={
                        data?.nutrientMeasurements ?? {
                          energy: [],
                          macronutrients: [],
                          micronutrients: { vitamins: [], minerals: [] },
                        }
                      }
                      onReferenceClick={handleReferenceClick}
                      actualGrams={grams}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <h4>{t("DetailFood.references.nutrients")}</h4>
                    <ReferencesList references={references}/>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <h4>{t("DetailFood.codes")}</h4>
                    <LangualCodeComponent data={data.langualCodes}/>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer/>
    </div>
  );
}
