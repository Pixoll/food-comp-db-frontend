import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState } from "react";
import "../../assets/css/_DetailPage.css";
import NutrientAccordion from "../../core/components/detailFood/NutrientAccordion";
import Footer from "../../core/components/Footer";
import useFetch from "../../core/hooks/useFetch";
import { data2 } from "../../core/static/data";
import { SingleFoodResult } from "../../core/types/SingleFoodResult";
import Graphic from "../../core/components/detailFood/Graphic";
import ReferencesList from "../../core/components/detailFood/ReferencesList";
import LengualCodeComponent from "../../core/components/detailFood/LengualCodeComponent";

export default function DetailPage() {
  const [key, setKey] = useState("first");

  const handleReferenceClick = (code: string) => {
    setKey("second");
  };
  const { id } = useParams();
  const [grams, setGrams] = useState<number>(100);
  const [inputGrams, setInputGrams] = useState<number>(100);
  const { data } = useFetch<SingleFoodResult>(
    `http://localhost:3000/api/v1/foods/${id}`
  );

  if (!data) {
    return <h2>Cargando...</h2>;
  }
  data.langualCodes.map((code) => console.log(code));
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

  const references = data?.references ?? [];
  const mainNutrients = data?.nutrientMeasurements?.mainNutrients ?? [];

  const graphicData =
    mainNutrients
      .filter((mainNutrient) => mainNutrient.name !== "Cenizas")
      .map((mainNutrient, index) => ({
        name: mainNutrient.name,
        value: (grams / 100) * mainNutrient.average,
        fill: colors[index % colors.length],
      })) || [];

  const graphicDataPorcent =
    mainNutrients
      .filter((mainNutrient) => mainNutrient.name !== "Cenizas")
      .map((mainNutrient, index) => ({
        name: mainNutrient.name,
        value: ((grams / 100) * mainNutrient.average) / 100,
        fill: colors[index % colors.length],
      })) || [];

  const handleGramsChange = () => {
    setGrams(inputGrams);
  };
  return (
    <div className="detail-background">
      <Container>
        <Row>
          <Col md={6}>
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
          <Col md={6}>
            <div className="transparent-container">
              <h2>Gráficos Nutricionales</h2>

              <Row>
                <Col md={6}>
                  <Graphic data={graphicData} />
                </Col>
                <Col md={6}>
                  <Graphic data={graphicDataPorcent} />
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <div style={{ textAlign: "center" }}>
                    <input
                      type="number"
                      value={inputGrams}
                      onChange={(e) => setInputGrams(Number(e.target.value))}
                      placeholder="Ingrese gramos"
                      min={1}
                      style={{
                        marginRight: "10px",
                        padding: "5px",
                        width: "120px",
                      }}
                    />
                    <button
                      onClick={handleGramsChange}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#0d6efd",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        marginLeft: "10px",
                      }}
                    >
                      Cambiar gramos
                    </button>
                    <p>Gramos actuales: {grams}g</p>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
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
                      <NutrientAccordion
                        data={
                          data?.nutrientMeasurements ?? {
                            energy: [],
                            mainNutrients: [],
                            micronutrients: { vitamins: [], minerals: [] },
                          }
                        }
                        onReferenceClick={handleReferenceClick}
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
