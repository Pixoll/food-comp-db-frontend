import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { NutrientMeasurement } from "../../types/SingleFoodResult";
import { useTranslation } from "react-i18next";

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
  const processValue = (value: string) => value.trim() === "" ? undefined : value;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "standardized" ? value === "true" : processValue(value),
    }));
  };

  const handleSave = () => {

    onSave(formData); 
    onHide();
  };
  const {t} = useTranslation("global");

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
        {t('Centered.details')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group>
            <Form.Label>{"Tamaño de muestra"}</Form.Label>
            <Form.Control
              type="number"
              name="sampleSize"
              value={formData.sampleSize || ""}
              onChange={handleChange}
            />
          </Form.Group>
        <Form.Group>
            <Form.Label>{t('Centered.mean')}</Form.Label>
            <Form.Control
              type="number"
              name="average"
              value={formData.average || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('Centered.deviation')}</Form.Label>
            <Form.Control
              type="number"
              name="deviation"
              value={formData.deviation || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('Centered.min')}</Form.Label>
            <Form.Control
              type="number"
              name="min"
              value={formData.min || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('Centered.max')}</Form.Label>
            <Form.Control
              type="number"
              name="max"
              value={formData.max || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('Centered.type')}</Form.Label>
            <Form.Control
              type="text"
              name="dataType"
              value={formData.dataType || ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave}>{t('Centered.save')}</Button>
        <Button variant="secondary" onClick={onHide}>
        {t('Centered.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CenteredModifyModal;
