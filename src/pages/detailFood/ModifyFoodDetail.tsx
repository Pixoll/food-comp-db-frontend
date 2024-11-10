import AppNavbar from "../../core/components/Navbar";
import Footer from "../../core/components/Footer";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { data, data2 } from "../../core/static/data";
import Graphic from "../../core/components/detailFood/Graphic";
import NutrientAccordionModify from "../../core/components/detailFood/NutrientAccordionModify";
import nutritionalValue from "../../core/types/nutritionalValue";
import writeIcon from "../../assets/images/write.png";
import { useState } from "react";
import "../../assets/css/_DetailPage.css";

const ModifyFoodDetail = () => {
  const { id } = useParams();

  const initialValues = [
    data2[0].codigo,
    data2[0].nombre_espanol,
    data2[0].nombre_portugues,
    data2[0].nombre_ingles,
    data2[0].nombre_cientifico,
    data2[0].region_origen,
    data2[0].tipo_alimento,
    data2[0].grupo,
  ];
  const [selectedValue, setSelectedValue] = useState<Array<string>>(initialValues);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const valores_nutricionales: nutritionalValue = data2[0].valores_nutricionales;

  const handleIconClick = (index: number) => {
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...selectedValue];
    if (editingIndex !== null) {
      newValues[editingIndex] = e.target.value;
      setSelectedValue(newValues);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  return (
    <div className="detail-background">
      <Container>
        <Row>
          <Col md={6}>
            <div className="transparent-container">
              <h2>Datos generales de la comida:</h2>
              {['Codigo','Nombre español', 'Nombre Portugués', 'Nombre Inglés', 'Nombre Científico', 'Origen', 'Tipo de alimento', 'Grupo de comida'].map((label, index) => (
                <p key={index}>
                  <strong>{label}: </strong>
                  {isEditing && editingIndex === index  ? (
                    <input
                      type="text"
                      value={selectedValue[index]}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onKeyDown={handleInputKeyDown}
                      autoFocus
                      style={{
                        fontSize: "16px",
                        padding: "2px 5px",
                        marginLeft: "10px",
                      }}
                    />
                  ) : (
                    <>
                      <span>{selectedValue[index]}</span>
                      <img
                        src={writeIcon}
                        alt="Edit Icon"
                        style={{ width: "20px", cursor: "pointer", marginLeft: "10px" }}
                        onClick={() => handleIconClick(index)}
                      />
                    </>
                  )}
                </p>
              ))}
            </div>
          </Col>
          <Col md={6}>
            <div className="transparent-container">
              <h2>Contenedor 2</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Graphic data={data} />
              </div>
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
                    <Nav.Link eventKey="first" style={{ /* estilos */ }}>Etiquetado Nutricional</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second" style={{ /* estilos */ }}>Etiquetado Nutricional ++</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third" style={{ /* estilos */ }}>Todos los datos</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div style={{ textAlign: "center" }}>
                      <NutrientAccordionModify data={valores_nutricionales} />
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <h4>Contenido para Opción 2</h4>
                    <p>Aquí va el contenido específico para la opción 2.</p>
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
};

export default ModifyFoodDetail;
