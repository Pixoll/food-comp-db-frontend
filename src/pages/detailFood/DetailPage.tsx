import AppNavbar from "../../core/components/Navbar";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Tab,Nav} from "react-bootstrap";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const DetailPage = () => {
  const { id } = useParams();

  //ESTO ES PARA PROBAR LOS GRAFICOS
  const data = [
    { name: "Grasa", value: 5.34, fill: "#4B9CD3" }, // Azul claro
    { name: "Carbohidratos", value: 25.31, fill: "#F5B041" }, // Amarillo
    { name: "Fibra alimentaria", value: 9.43, fill: "#E67E22" }, // Naranja
    { name: "Alcohol", value: 31.05, fill: "#E74C3C" }, // Rojo
    { name: "Proteina", value: 22.56, fill: "#9B59B6" }, // Morado
    { name: "Agua", value: 1.39, fill: "#3498DB" }, // Azul medio
    { name: "Otros", value: 4.91, fill: "#2ECC71" }, // Verde
  ];

  //PARA PROBAR LA TABLA
  const nutrients = [
    { name: 'Energía [kJ]', quantity: '262', source: 155, method: 4 },
    { name: 'Energía [kcal]', quantity: '62 kcal', source: 155, method: 4 },
    { name: 'Proteína [g]', quantity: '0.83', source: 222, method: 2 },
    { name: 'Grasa total [g]', quantity: '0', source: 222, method: 2 },
    { name: 'Carboidratos disponibles [g]', quantity: '12.8', source: 222, method: 5 },
    { name: 'Sodio [mg]', quantity: '11.1', source: 155, method: 4 },
    { name: 'Colesterol [mg]', quantity: '0.83', source: 222, method: 2 },
    { name: 'Azúcares totales [g]', quantity: '0.0325', source: 155, method: 4 },
  ];
  

  return (
    
    <div>
        <AppNavbar />

      <h1>Detalle del alimento con ID: {id}</h1>


      <Container>
        <Row>
          <Col md={6}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px' }}>
              <h2>Datos generales de la comida:</h2>
              <p><strong>Código:</strong></p>
              <p><strong>Nombre comida:</strong></p>
              <p><strong>Nombre Cientifico:</strong></p>
              <p><strong>Origen:</strong></p>
              <p><strong>Tipo de alimento:</strong></p>
              <p><strong>Grupo de comida:</strong></p>
            </div>
          </Col>
          <Col md={6}>
            <div style={{ backgroundColor: '#e9ecef', padding: '20px', borderRadius: '5px' }}>
              <h2>Contenedor 2</h2>
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                {/*<h1>Composición de Nutrientes</h1>*/}
                <PieChart width={400} height={400}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>

            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <div style={{ backgroundColor: '#d1e7dd', padding: '20px', borderRadius: '5px' }}>

              <Tab.Container defaultActiveKey="first">
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="first">Etiquetado Nutricional</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">Etiquetado Nutricional ++</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">Todos los datos</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <h4>Contenido para Opción 1</h4>
                    <p>Aquí va el contenido específico para la opción 1.</p>

                    <div style={{ textAlign: 'center' }}>
                    <h2>Nutrient Data Table</h2>
                    <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '80%' }}>
                      <thead>
                        <tr>
                          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nutrient name</th>
                          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Quantity / 100 g</th>
                          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Source</th>
                          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nutrients.map((nutrient, index) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ccc', padding: '8px', color: nutrient.name === 'Energy' ? 'red' : 'black' }}>
                              {nutrient.name}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{nutrient.quantity}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{nutrient.source}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{nutrient.method}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

    </div>
  );
};

export default DetailPage;