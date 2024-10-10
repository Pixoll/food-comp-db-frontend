import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Table } from "react-bootstrap";
import { NutrientMeasurement } from "../../types/SingleFoodResult";

interface ModalProps {
  data: NutrientMeasurement;
  onHide: () => void;
  onReferenceClick: (code: string) => void;  // Agregar la funcion para cambiar la pestaña(no está termianada)
}

const CenteredModal: React.FC<ModalProps> = ({ data, onHide, onReferenceClick }) => {

  const referenceLinks =
    data.referenceCodes?.length ? (
      data.referenceCodes.map((code, index) => (
        <span key={code}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); 
              onReferenceClick(code.toString());  
            }}
            style={{ textDecoration: "underline", color: "#0d6efd" }}
          >
            {code}
          </a>
          {index < (data.referenceCodes?.length ?? 0) - 1 && ", "}
        </span>
      ))
    ) : (
      "N/A"
    );

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
      <Modal.Body>
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
              <td>{referenceLinks}</td>
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
