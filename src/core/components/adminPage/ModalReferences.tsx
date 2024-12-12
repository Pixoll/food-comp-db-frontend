import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

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

const ModalReferences: React.FC<ModalReferencesProps> = ({
  nutrients,
  show,
  onHide,
  onSelectReferenceForNutrients,
  selectedReference,
}) => {
  const [selectedNutrientIds, setSelectedNutrientIds] = useState<number[]>([]);

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
        <Modal.Title>Seleccionar nutrientes</Modal.Title>
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
          Cerrar
        </Button>
        <Button
          variant="primary"
          onClick={handleAddReference}
          disabled={selectedReference === null}
        >
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalReferences;