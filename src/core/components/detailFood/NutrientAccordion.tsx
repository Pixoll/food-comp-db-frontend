import { Accordion, Table, Button } from "react-bootstrap";
import nutritionalValue, { Vitamin, Mineral } from "../../types/nutritionalValue";

interface NutrientAccordionProps {
  data: nutritionalValue;
}

const NutrientAccordion: React.FC<NutrientAccordionProps> = ({ data }) => {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Energy value</Accordion.Header>
        <Accordion.Body>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Unidad</th>
                <th>Desviación</th>
                <th>Min</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              {data.energy.map((energy, index) => (
                <tr key={index}>
                  <td>{energy.type}</td>
                  <td>{energy.amount}</td>
                  <td>{energy.unit}</td>
                  <td>{energy.deviation}</td>
                  <td>{energy.min}</td>
                  <td>{energy.max}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Main nutrients</Accordion.Header>
        <Accordion.Body>
          {data.main_nutrients.map((nutrient, index) => (
            <div key={index}>
              {!nutrient.components || nutrient.components.length === 0 ? (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Nutriente</th>
                      <th>Cantidad</th>
                      <th>Desviación</th>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={index}>
                      <td>{nutrient.nutrient}</td>
                      <td>{nutrient.amount}</td>
                      <td>{nutrient.deviation}</td>
                      <td>{nutrient.min}</td>
                      <td>{nutrient.max}</td>
                      <td>{nutrient.type}</td>
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <Accordion>
                  <Accordion.Item eventKey={`comp-${index}`}>
                    <Accordion.Header>
                      Components of {nutrient.nutrient}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Unit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nutrient.components.map((component, compIndex) => (
                            <tr key={`comp-${index}-${compIndex}`}>
                              <td>{component.type}</td>
                              <td>{component.amount ?? "N/A"}</td>
                              <td>N/A</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Micronutrients</Accordion.Header>
        <Accordion.Body>
          {Object.entries(data.micronutrients).map(([micronutrientType, micronutrientList]) => (
            <div key={micronutrientType}>
              <h6>{micronutrientType.charAt(0).toUpperCase() + micronutrientType.slice(1)}</h6>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Micronutriente</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Desviación</th>
                    <th>Min</th>
                    <th>Max</th>
                  </tr>
                </thead>
                <tbody>
                  {(micronutrientList as (Vitamin | Mineral)[]).map((micronutrient, index) => (
                    <tr key={index}>
                      <td>{"vitamin" in micronutrient ? micronutrient.vitamin : micronutrient.mineral}</td>
                      <td>{micronutrient.amount}</td>
                      <td>{micronutrient.unit}</td>
                      <td>{micronutrient.deviation}</td>
                      <td>{micronutrient.min}</td>
                      <td>{micronutrient.max}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default NutrientAccordion;
