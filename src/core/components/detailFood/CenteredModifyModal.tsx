import  { useState, ChangeEvent } from "react";
import { Button, Modal, Form, Row, Col, Container } from "react-bootstrap";
import { NutrientMeasurement } from "../../types/SingleFoodResult";
import { useTranslation } from "react-i18next";


type ModalProps = {
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
  const { t } = useTranslation();

  const processValue = (value: string) => value.trim() === "" ? undefined : value;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  return (
    <Modal
      show={true}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className="bg-light">
        <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-center">
          {t('Centered.details')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{"Tamaño de muestra"}</Form.Label>
                  <Form.Control
                    type="number"
                    name="sampleSize"
                    value={formData.sampleSize || ""}
                    onChange={handleChange}
                    placeholder="Tamaño de muestra en entero"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('Centered.mean')}</Form.Label>
                  <Form.Control
                    type="number"
                    name="average"
                    value={formData.average || ""}
                    onChange={handleChange}
                    placeholder= "Escribe el promedio"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('Centered.deviation')}</Form.Label>
                  <Form.Control
                    type="number"
                    name="deviation"
                    value={formData.deviation || ""}
                    onChange={handleChange}
                    placeholder = "Escribe la desviación"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('Centered.type')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="dataType"
                    value={formData.dataType || ""}
                    onChange={handleChange}
                    placeholder={t('Centered.type ')}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('Centered.min')}</Form.Label>
                  <Form.Control
                    type="number"
                    name="min"
                    value={formData.min || ""}
                    onChange={handleChange}
                    placeholder = "Escribe el mínimo"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('Centered.max')}</Form.Label>
                  <Form.Control
                    type="number"
                    name="max"
                    value={formData.max || ""}
                    onChange={handleChange}
                    placeholder = "Escribe el máximo"

                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button 
          variant="secondary" 
          onClick={onHide}
          className="px-4"
        >
          Cerrar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          className="px-4"
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CenteredModifyModal;
