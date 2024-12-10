import React, { useState } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

type NutrientConvert = {
  id: number;
  name: string;
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

  const handleSelect = (id: number) => {
    setSelectedNutrientIds((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
    
  };
  const handleAddReference = () => {
    if (selectedReference !== null && selectedNutrientIds.length > 0) {
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
          disabled={selectedNutrientIds.length === 0 || selectedReference === null}
        >
          Añadir referencia
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalReferences;
