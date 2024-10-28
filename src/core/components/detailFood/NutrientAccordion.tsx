import { Accordion, Table } from "react-bootstrap";
import nutritionalValue from "../../types/nutritionalValue";

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
                <th>Type</th>
                <th>Amount</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {data.energy.map((energy, index) => (
                <tr key={index}>
                  <td>{energy.type}</td>
                  <td>{energy.amount}</td>
                  <td>{energy.unit}</td>
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
                      <th>Nutrient</th>
                      <th>Amount</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{nutrient.nutrient}</td>
                      <td>{nutrient.amount}</td>
                      <td>{"N/A"}</td>
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
                              <td>{"N/A"}</td>
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
          <h6>Vitamins</h6>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Vitamin</th>
                <th>Amount</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {data.micronutrients.vitamins.map((vitamin, index) => (
                <tr key={index}>
                  <td>{vitamin.vitamin}</td>
                  <td>{vitamin.amount}</td>
                  <td>{vitamin.unit}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h6>Minerals</h6>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Mineral</th>
                <th>Amount</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {data.micronutrients.minerals.map((mineral, index) => (
                <tr key={index}>
                  <td>{mineral.mineral}</td>
                  <td>{mineral.amount}</td>
                  <td>{mineral.unit}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default NutrientAccordion;
