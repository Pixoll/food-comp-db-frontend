import { useEffect, useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type NutrientConvert = {
  id: number;
  name: string;
  selected: boolean;
};

type ModalReferencesProps = {
  nutrients: NutrientConvert[];
  show: boolean;
  onHide: () => void;
  onSelectReferenceForNutrients: (nutrientIds: number[], referenceId: number) => void;
  selectedReference: number | null;
};

export default function ModalReferences({
  nutrients,
  show,
  onHide,
  onSelectReferenceForNutrients,
  selectedReference,
}: ModalReferencesProps) {
  const [selectedNutrientIds, setSelectedNutrientIds] = useState<number[]>([]);
  const { t } = useTranslation();
  useEffect(() => {
    if (show) {
      const initialSelectedIds = nutrients
        .filter((n) => n.selected)
        .map((n) => n.id);
      setSelectedNutrientIds(initialSelectedIds);
    }
  }, [nutrients, show]);

  const handleSelect = (id: number) => {
    setSelectedNutrientIds((prev) =>
      prev.includes(id)
        ? prev.filter((nid) => nid !== id)
        : [...prev, id]
    );
  };

  const handleAddReference = () => {
    if (selectedReference !== null) {
      onSelectReferenceForNutrients(selectedNutrientIds, selectedReference);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{t("ModalReferences.Select")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {nutrients.map((nutrient) => (
            <ListGroup.Item
              key={nutrient.id}
              action
              onClick={() => handleSelect(nutrient.id)}
              active={selectedNutrientIds.includes(nutrient.id)}
            >
              {nutrient.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t("ModalReferences.Close")}
        </Button>
        <Button
          variant="primary"
          onClick={handleAddReference}
          disabled={selectedReference === null}
        >
          {t("ModalReferences.Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
