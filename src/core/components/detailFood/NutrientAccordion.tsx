import { Accordion, Table } from "react-bootstrap";
import { NutrientsValue } from "../../types/SingleFoodResult";

interface NutrientAccordionProps {
  data: NutrientsValue;
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
                <th>Nombre</th>
                <th>Unidad</th>
                <th>Promedio</th>
                <th>Desviación</th>
                <th>Min</th>
                <th>Max</th>
                <th>Tamaño de muestra</th>
                <th>Estandarizado</th>
                <th>Notas</th>
                <th>Referencias</th>
              </tr>
            </thead>
            <tbody>
              {data.energy.map((energy, index) => (
                <tr key={index}>
                  <td>{energy.name}</td>
                  <td>{energy.measurementUnit}</td>
                  <td>{energy.average}</td>
                  <td>{energy.deviation ?? ""}</td>
                  <td>{energy.min ?? ""}</td>
                  <td>{energy.max ?? ""}</td>
                  <td>{energy.sampleSize ?? ""}</td>
                  <td>{energy.standardized ?? ""}</td>
                  <td>{energy.note ?? ""}</td>
                  <td>{energy.referenceCodes ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>

      {/* Main Nutrients Section */}
      <Accordion.Item eventKey="1">
        <Accordion.Header>Main nutrients</Accordion.Header>
        <Accordion.Body>
          {data.mainNutrients.map((nutrient, index) => (
            <Table striped bordered hover size="sm" key={index}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Unidad</th>
                  <th>Promedio</th>
                  <th>Desviación</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Tamaño de muestra</th>
                  <th>Estandarizado</th>
                  <th>Notas</th>
                  <th>Referencias</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{nutrient.name}</td>
                  <td>{nutrient.measurementUnit}</td>
                  <td>{nutrient.average}</td>
                  <td>{nutrient.deviation ?? ""}</td>
                  <td>{nutrient.min ?? ""}</td>
                  <td>{nutrient.max ?? ""}</td>
                  <td>{nutrient.sampleSize ?? ""}</td>
                  <td>{nutrient.standardized ?? ""}</td>
                  <td>{nutrient.note ?? ""}</td>
                  <td>{nutrient.referenceCodes ?? ""}</td>
                </tr>
              </tbody>
            </Table>
          ))}
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="2">
        <Accordion.Header>Micronutrients</Accordion.Header>
        <Accordion.Body>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Unidad</th>
                <th>Promedio</th>
                <th>Desviación</th>
                <th>Min</th>
                <th>Max</th>
                <th>Tamaño de muestra</th>
                <th>Estandarizado</th>
                <th>Notas</th>
                <th>Referencias</th>
              </tr>
            </thead>
            <tbody>
              {data.micronutrients.minerals.map((micronutrient, index) => (
                <tr key={index}>
                  <td>{micronutrient.name}</td>
                  <td>{micronutrient.measurementUnit}</td>
                  <td>{micronutrient.average}</td>
                  <td>{micronutrient.deviation ?? ""}</td>
                  <td>{micronutrient.min ?? ""}</td>
                  <td>{micronutrient.max ?? ""}</td>
                  <td>{micronutrient.sampleSize ?? ""}</td>
                  <td>{micronutrient.standardized ?? ""}</td>
                  <td>{micronutrient.note ?? ""}</td>
                  <td>{micronutrient.referenceCodes ?? ""}</td>
                </tr>
              ))}
              {data.micronutrients.vitamins.map((micronutrient, index) => (
                <tr key={index}>
                  <td>{micronutrient.name}</td>
                  <td>{micronutrient.measurementUnit}</td>
                  <td>{micronutrient.average}</td>
                  <td>{micronutrient.deviation ?? ""}</td>
                  <td>{micronutrient.min ?? ""}</td>
                  <td>{micronutrient.max ?? ""}</td>
                  <td>{micronutrient.sampleSize ?? ""}</td>
                  <td>{micronutrient.standardized ?? ""}</td>
                  <td>{micronutrient.note ?? ""}</td>
                  <td>{micronutrient.referenceCodes ?? ""}</td>
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
