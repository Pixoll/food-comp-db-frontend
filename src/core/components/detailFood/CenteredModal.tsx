import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { NutrientsValue } from "../../types/SingleFoodResult";

// Definimos las propiedades de las props del componente
interface ModalProps {
  data: NutrientsValue;
  onHide: () => void; // Añadimos onHide como una función independiente
}

const CenteredModal: React.FC<ModalProps> = ({ data, onHide }) => {
  return (
    <Modal
      show={true}        // Asumimos que el modal siempre se muestra cuando es llamado
      onHide={onHide}     // Pasamos onHide directamente como prop de Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CenteredModal;