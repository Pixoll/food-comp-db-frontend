import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import OriginSelector from "./OriginSelector";
import { City } from "./getters/UseReferences";
import SelectorWithInput from "../detailFood/SelectorWithInput";
import RequiredFieldLabel from "../detailFood/RequiredFieldLabel";
export type ReferenceForm = {
  type: "report" | "thesis" | "article" | "website" | "book";
  title: string;
  authorIds?: number[];
  newAuthors?: string[];
  year?: number;
  newArticle?: NewArticle;
  cityId?: number;
  newCity?: string;
  other?: string;
};

export type NewArticle = {
  pageStart?: number;
  pageEnd?: number;
  volumeId?: number;
  newVolume?: NewVolume;
};

export type NewVolume = {
  volume?: number;
  issue?: number;
  year?: number;
  journalId?: number;
  newJournal?: string;
};
type NewReferenceProps = {
  type: "report" | "thesis" | "article" | "website" | "book";
  title: string;
  year?: number;
  cityId?: number;
  newCity?: string;
  other?: string;
  cities: City[];
  onFormUpdate: (updatedFields: Partial<ReferenceForm>) => void;
};
const searchCityNameByID = (
  id: number | undefined,
  cities: City[]
): string | undefined => {
  if (!id) {
    return undefined;
  }
  const city = cities.find((city) => city.id === id);
  return city?.name;
};

const NewReference: React.FC<NewReferenceProps> = ({
  type,
  title,
  year,
  cityId,
  newCity,
  other,
  cities,
  onFormUpdate,
}) => {
  const [referenceForm, setReferenceForm] = useState<ReferenceForm>({
    type: type,
    title: title,
    year: year,
    cityId: cityId,
    newCity: newCity,
    other: other,
  });

  const handleInputChange = (field: keyof ReferenceForm, value: any) => {
    const updatedForm = { ...referenceForm } as ReferenceForm;

    if (field === "cityId") {
      updatedForm.cityId = value;
      updatedForm.newCity = undefined;
    } else if (field === "newCity") {
      updatedForm.newCity = value;
      updatedForm.cityId = undefined;
    } else {
      updatedForm[field] = value as never;
    }

    setReferenceForm(updatedForm);
    onFormUpdate(updatedForm);
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Agregar Nueva Referencia</Card.Title>
        <Form>
          <Form.Group controlId="formReferenceTitle">
            <Form.Label>
              Título
              <RequiredFieldLabel tooltipMessage={"Es obligatorio"} />
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el título"
              value={referenceForm.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formReferenceType">
            <Form.Label>
              Tipo
              <RequiredFieldLabel tooltipMessage={"Es obligatorio"} />
            </Form.Label>
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

          <Form.Group controlId="formReferenceCity">
            <Form.Label>Ciudad</Form.Label>
            <SelectorWithInput
              options={cities}
              placeholder="Seleccione una ciudad"
              selectedValue={
                searchCityNameByID(referenceForm.cityId, cities) || newCity
              }
              onSelect={(id, name) => {
                if (id) {
                  handleInputChange("cityId", id);
                } else {
                  handleInputChange("newCity", name);
                }
              }}
            />
          </Form.Group>

          <Form.Group controlId="formReferenceYear">
            <Form.Label>
              Año
              {type !== "article" && type !== "website" && (
                <RequiredFieldLabel tooltipMessage={"Es obligatorio"} />
              )}
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el año"
              value={referenceForm.year || ""}
              onChange={(e) =>
                handleInputChange("year", Number(e.target.value))
              }
            />
          </Form.Group>
          <Form.Group controlId="formReferenceOther">
            <Form.Label>
              Otro
              {(type === "website" || type === "book") && (
                <RequiredFieldLabel tooltipMessage={"Es obligatorio"} />
              )}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Otro"
              value={referenceForm.other || ""}
              onChange={(e) => handleInputChange("other", e.target.value)}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewReference;
