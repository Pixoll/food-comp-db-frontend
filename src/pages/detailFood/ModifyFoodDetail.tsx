import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState } from "react";
import "../../assets/css/_DetailPage.css";
import NutrientAccordionModify from "../../core/components/detailFood/NutrientAccordionModify";
import Footer from "../../core/components/Footer";
import useFetch from "../../core/hooks/useFetch";
import { SingleFoodResult } from "../../core/types/SingleFoodResult";
import ReferencesList from "../../core/components/detailFood/ReferencesList";
import LengualCodeComponent from "../../core/components/detailFood/LengualCodeComponent";

export default function ModifyFoodDetail() {
  const [key, setKey] = useState("first");
  const { code } = useParams();
  const { data } = useFetch<SingleFoodResult>(
    `http://localhost:3000/api/v1/foods/${code?.toString()}`
  );

  if (!data) {
    return <h2>Cargando...</h2>;
  }

  const references = data?.references ?? [];
  return (
    <div className="detail-background">
      <Container>
          <Col md={12}>
            <div className="transparent-container">
              <h2>Datos generales del alimento:</h2>
              <p>
                <strong>Código:</strong> {data.code}
              </p>

              {data.commonName?.es && (
                <p>
                  <strong>Nombre en Español:</strong> {data.commonName.es}
                </p>
              )}
              {data.commonName?.pt && (
                <p>
                  <strong>Nombre en Portugués:</strong> {data.commonName.pt}
                </p>
              )}
              {data.commonName?.en && (
                <p>
                  <strong>Nombre en Inglés:</strong> {data.commonName.en}
                </p>
              )}

              {data.scientificName && (
                <p>
                  <strong>Nombre Científico:</strong> {data.scientificName}
                </p>
              )}
              {data.subspecies && (
                <p>
                  <strong>Subespecie:</strong> {data.subspecies}
                </p>
              )}
              {data.strain && (
                <p>
                  <strong>Cepa:</strong> {data.strain}
                </p>
              )}
              {data.brand && (
                <p>
                  <strong>Marca:</strong> {data.brand}
                </p>
              )}
              {data.observation && (
                <p>
                  <strong>Observación:</strong> {data.observation}
                </p>
              )}

              <p>
                <strong>Grupo de comida:</strong> {data.group.name} (Código:{" "}
                {data.group.code})
              </p>
              <p>
                <strong>Tipo de alimento:</strong> {data.type.name} (Código:{" "}
                {data.type.code})
              </p>

              {data.ingredients?.es && (
                <p>
                  <strong>Ingredientes (Español):</strong> {data.ingredients.es}
                </p>
              )}
              {data.ingredients?.pt && (
                <p>
                  <strong>Ingredientes (Portugués):</strong>{" "}
                  {data.ingredients.pt}
                </p>
              )}
              {data.ingredients?.en && (
                <p>
                  <strong>Ingredientes (Inglés):</strong> {data.ingredients.en}
                </p>
              )}
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
                      Etiquetado Nutricional
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
                      Referencias
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
                      Todos los datos
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
                    <h4>Referencias de nutrientes</h4>
                    <ReferencesList references={references} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <h4>Codigos lenguales</h4>
                    <LengualCodeComponent data={data.langualCodes} />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}
