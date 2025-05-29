import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { NutrientMeasurement } from "@/core/types/SingleFoodResult";

type ModalProps = {
  data: NutrientMeasurement;
  onHide: () => void;
  onReferenceClick: (code: string) => void; 
}

export default function CenteredModal({ data, onHide, onReferenceClick }: ModalProps) {
  const { t } = useTranslation();
  const referenceLinks =
    data.referenceCodes?.length ? (
      data.referenceCodes.map((code, index) => (
        <span key={code}>
          <span
            onClick={(e) => {
              e.preventDefault();
              onReferenceClick(code.toString());
            }}
            style={{ textDecoration: "underline", color: "#0d6efd", cursor: "pointer" }}
          >
            {code}
          </span>
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
          {t('Centered.details')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table responsive="lg">
          <thead>
          <tr>
            <th>Tamaño de muestra</th>
            <th>{t('Centered.deviation')}</th>
            <th>{t('Centered.min')}</th>
            <th>{t('Centered.max')}</th>
            <th>{t('Centered.note')}</th>
            <th>{t('Centered.standardized')}</th>
            <th>{t('Centered.references')}</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{data.sampleSize || "N/A"}</td>
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
        <Button onClick={onHide}>{t('Centered.close')}</Button>
      </Modal.Footer>
    </Modal>
  );
}
