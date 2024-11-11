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

export default function DetailPage() {
  const { id } = useParams();
  const [grams, setGrams] = useState<number>(100);
  const [inputGrams, setInputGrams] = useState<number>(100); 
  const { data } = useFetch<SingleFoodResult>(
    `http://localhost:3000/api/v1/foods/${id}`
  );

  if (!data) {
    return <h2>data del alimento no encontrada</h2>;
  }
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
        value: mainNutrient.average / 100,
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
              <h2>Datos generales de la comida:</h2>
              <p>
                <strong>Código: {data?.code}</strong>
              </p>
              <p>
                <strong>Nombre español: {data?.commonName?.es}</strong>
              </p>
              <p>
                <strong>Nombre Portugues: {data?.commonName?.en}</strong>
              </p>
              <p>
                <strong>Nombre ingles: {data?.commonName?.en}</strong>
              </p>

              <p>
                <strong>Nombre Cientifico: {data2[0].nombre_cientifico}</strong>
              </p>

              <p>
                <strong>Origen: {data2[0].region_origen}</strong>
              </p>
              <p>
                <strong>Tipo de alimento: {data2[0].tipo_alimento}</strong>
              </p>
              <p>
                <strong>Grupo de comida: {data2[0].grupo}</strong>
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="transparent-container">
              <h2>Gráficos Nutricionales</h2>

              {/* Fila de gráficos */}
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
                      value={inputGrams} // Muestra el valor de inputGrams
                      onChange={(e) => setInputGrams(Number(e.target.value))} // Actualiza inputGrams
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
                      Etiquetado Nutricional ++
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
                    <div style={{ textAlign: "center" }}>
                      <NutrientAccordion
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
                    <h4>Contenido para Opción 2</h4>
                    {references.map((reference, index) => (
                      <div key={index}>
                        <p>{reference.authors}</p>
                        <p>{reference.title}</p>
                      </div>
                    ))}
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <h4>Contenido para Opción 3</h4>
                    <p>Aquí va el contenido específico para la opción 3.</p>
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
