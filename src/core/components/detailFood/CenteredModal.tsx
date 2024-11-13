import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Table } from 'react-bootstrap';
import { NutrientMeasurement } from "../../types/SingleFoodResult";

interface ModalProps {
  data: NutrientMeasurement;
  onHide: () => void;
}

const CenteredModal: React.FC<ModalProps> = ({ data, onHide }) => {
  return (
    <Modal
      show={true}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Detalles del Nutriente
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <Table responsive="lg">
          <thead>
            <tr>
              <th>Desviación</th>
              <th>Mínimo</th>
              <th>Máximo</th>
              <th>Notas</th>
              <th>Estandarizado</th>
              <th>Referencias</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.deviation || "N/A"}</td>
              <td>{data.min || "N/A"}</td>
              <td>{data.max || "N/A"}</td>
              <td>{data.note || "N/A"}</td>
              <td>{data.standardized ? "Sí" : "No"}</td>
              <td>{data.referenceCodes?.join(", ") || "N/A"}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CenteredModal;
