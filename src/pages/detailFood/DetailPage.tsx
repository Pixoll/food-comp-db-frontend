
import Footer from "../../core/components/Footer";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { data, data2 } from "../../core/static/data"
import Graphic from "../../core/components/detailFood/Graphic";
import "../../assets/css/_DetailPage.css"
import NutrientAccordion from "../../core/components/detailFood/NutrientAccordion";
import nutritionalValue from "../../core/types/nutritionalValue";


const DetailPage = () => {
  const { id } = useParams();

  const valores_nutricionales: nutritionalValue = data2[0].valores_nutricionales;

  return (
    <div className="detail-background">

      <Container>
        <Row>
          <Col md={6}>
            <div className="transparent-container">
              <h2>Datos generales de la comida:</h2>
              <p><strong>Código: {data2[0].codigo}</strong></p>
              <p><strong>Nombre español: {data2[0].nombre_espanol}</strong></p>
              <p><strong>Nombre Portugues: {data2[0].nombre_portugues}</strong></p>
              <p><strong>Nombre ingles: {data2[0].nombre_ingles}</strong></p>

              <p><strong>Nombre Cientifico: {data2[0].nombre_cientifico}</strong></p>

              <p><strong>Origen: {data2[0].region_origen}</strong></p>
              <p><strong>Tipo de alimento: {data2[0].tipo_alimento}</strong></p>
              <p><strong>Grupo de comida: {data2[0].grupo}</strong></p>
            </div>
          </Col>
          <Col md={6}>
            <div className="transparent-container">
              <h2>Contenedor 2</h2>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Graphic data = {data} />
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <div style={{ backgroundColor: '#d1e7dd', padding: '20px', borderRadius: '5px' }}>

              <Tab.Container defaultActiveKey="first">
                <Nav variant="tabs" className="mb-3" style={{ borderBottom: '2px solid #d1e7dd' }}>
                  <Nav.Item>
                    <Nav.Link eventKey="first" style={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '5px 5px 0 0',
                      border: '1px solid #d1e7dd',
                      marginRight: '5px',
                      color: '#0d6efd',
                      transition: 'background-color 0.3s ease',
                    }}>Etiquetado Nutricional</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second" style={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '5px 5px 0 0',
                      border: '1px solid #d1e7dd',
                      marginRight: '5px',
                      color: '#0d6efd',
                      transition: 'background-color 0.3s ease',
                    }}>Etiquetado Nutricional ++</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third" style={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '5px 5px 0 0',
                      border: '1px solid #d1e7dd',
                      color: '#0d6efd',
                      transition: 'background-color 0.3s ease',
                    }}>Todos los datos</Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div style={{ textAlign: 'center' }}> 
                      {/*TABLA NUTRICIONAL
                      <table style={{
                        margin: 'auto',
                        borderCollapse: 'collapse',
                        width: '80%',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: '#00796b', color: '#ffffff', fontWeight: 'bold' }}>
                            <th style={{ padding: '12px', borderBottom: '2px solid #004d40' }}>Nutrientes</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #004d40' }}>Cantidad / 100 g</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nutrients.map((nutrient, index) => (
                            <tr
                              key={index}
                              style={{
                                backgroundColor: index % 2 === 0 ? '#e0f2f1' : '#b2dfdb',
                                transition: 'background-color 0.3s ease',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#80cbc4'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f2f1' : '#b2dfdb'}
                            >
                              <td style={{ padding: '12px', borderBottom: '1px solid #004d40', color: nutrient.name === 'Energy' ? 'red' : '#333' }}>
                                {nutrient.name}
                              </td>
                              <td style={{ padding: '12px', borderBottom: '1px solid #004d40' }}>{nutrient.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>*/}
                      <NutrientAccordion data={valores_nutricionales}/>
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

export default DetailPage;
