import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { NutrientMeasurement } from "../../types/SingleFoodResult";

interface ModalProps {
  data: NutrientMeasurement;
  onHide: () => void;
  onSave: (updatedData: NutrientMeasurement) => void; 

}

const CenteredModifyModal: React.FC<ModalProps> = ({
  data,
  onHide,
  onSave,

}) => {
  const [formData, setFormData] = useState<NutrientMeasurement>(data);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "standardized" ? value === "true" : value,
    }));
  };

  const handleSave = () => {
    onSave(formData); 
    onHide();
  };

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
        <Form>
        <Form.Group>
            <Form.Label>Promedio</Form.Label>
            <Form.Control
              type="number"
              name="average"
              value={formData.average || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Desviación</Form.Label>
            <Form.Control
              type="number"
              name="deviation"
              value={formData.deviation || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Mínimo</Form.Label>
            <Form.Control
              type="number"
              name="min"
              value={formData.min || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Máximo</Form.Label>
            <Form.Control
              type="number"
              name="max"
              value={formData.max || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Notas</Form.Label>
            <Form.Control
              type="text"
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Estandarizado</Form.Label>
            <Form.Select
              name="standardized"
              value={formData.standardized ? "true" : "false"}
              onChange={handleChange}
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave}>Guardar</Button>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CenteredModifyModal;
