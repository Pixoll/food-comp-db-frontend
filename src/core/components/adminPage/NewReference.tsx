import React, {useState} from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import OriginSelector from './OriginSelector';
import SelectorWithInput from '../detailFood/SelectorWithInput';

type ReferenceForm = {
    type: "report" | "thesis" | "article" | "website" | "book";
    title: string;
    authorIds?: number[];
    newAuthors?: string[];
    year?: number;
    refVolumeId?: number;
    newRefVolume?: NewRefVolume;
    refCityId?: number;
    newCity?: string;
    other?: string;
};
type NewRefVolume = {
    pageStart: number;
    pageEnd: number;
    volumeId?: number;
    newVolume?: NewVolume;
};

type NewVolume = {
    volume: number;
    issue: number;
    year: number;
    journalId?: number;
    newJournal?: string;
};

const NewReference = () => {
    const [referenceForm, setReferenceForm] = useState<ReferenceForm>({
      type: "article",
      title: "",
      authorIds: undefined,
      newAuthors: undefined,
      year: undefined,
      refVolumeId: undefined,
      newRefVolume: undefined,
      refCityId: undefined,
      newCity: undefined,
      other: undefined,
    });
  
    const handleInputChange = (field: keyof ReferenceForm, value: any) => {
      setReferenceForm({ ...referenceForm, [field]: value });
    };
  
    const handleSave = () => {
      console.log("Referencia guardada:", referenceForm);
    };
  
    return (
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Agregar Nueva Referencia</Card.Title>
          <Form>
            <Form.Group controlId="formReferenceTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el título"
                value={referenceForm.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </Form.Group>
  
            <Form.Group controlId="formReferenceType">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={referenceForm.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <option value="report">Reporte</option>
                <option value="thesis">Tesis</option>
                <option value="article">Artículo</option>
                <option value="website">Sitio web</option>
                <option value="book">Libro</option>
              </Form.Select>
            </Form.Group>
  
            <Form.Group controlId="formReferenceAuthors">
              <Form.Label>Autores</Form.Label>
              <SelectorWithInput
                options={[
                  { id: 1, name: "Autor 1" },
                  { id: 2, name: "Autor 2" },
                ]}
                placeholder="Seleccione o ingrese un autor"
                selectedValue={
                  referenceForm.newAuthors?.[0] ||
                  (referenceForm.authorIds?.length ? "Seleccionado" : undefined)
                }
                onSelect={(id, name) => {
                  if (id) {
                    handleInputChange("authorIds", [
                      ...(referenceForm.authorIds || []),
                      id,
                    ]);
                  } else {
                    handleInputChange("newAuthors", [
                      ...(referenceForm.newAuthors || []),
                      name,
                    ]);
                  }
                }}
              />
            </Form.Group>
  
            <Form.Group controlId="formReferenceCity">
              <Form.Label>Ciudad</Form.Label>
              <OriginSelector
                options={[
                  { id: 1, name: "Ciudad A" },
                  { id: 2, name: "Ciudad B" },
                ]}
                placeholder="Seleccione una ciudad"
                selectedValue={referenceForm.newCity || ""}
                onSelect={(id, name) =>
                  id
                    ? handleInputChange("refCityId", id)
                    : handleInputChange("newCity", name)
                }
              />
            </Form.Group>
  
            <Form.Group controlId="formReferenceYear">
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el año"
                value={referenceForm.year || ""}
                onChange={(e) => handleInputChange("year", Number(e.target.value))}
              />
            </Form.Group>
  
            <Button variant="success" className="mt-3" onClick={handleSave}>
              Guardar Referencia
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  };
  
  export default NewReference;