import React, { useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import { 
  Book, 
  FileText, 
  Globe, 
  MapPin, 
  Calendar, 
  Info 
} from "lucide-react";
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

  const getReferenceTypeIcon = () => {
    switch (type) {
      case "book": return <Book className="me-2" />;
      case "article": return <FileText className="me-2" />;
      case "website": return <Globe className="me-2" />;
      case "report": return <Info className="me-2" />;
      case "thesis": return <FileText className="me-2" />;
      default: return null;
    }
  };

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header className="d-flex align-items-center bg-primary text-white">
        {getReferenceTypeIcon()}
        <Card.Title className="mb-0">Agregar Nueva Referencia</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formReferenceTitle" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FileText className="me-2" />
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
            </Col>

            <Col md={6}>
              <Form.Group controlId="formReferenceType" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <Book className="me-2" />
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
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formReferenceCity" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <MapPin className="me-2" />
                  Ciudad
                </Form.Label>
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
            </Col>

            <Col md={6}>
              <Form.Group controlId="formReferenceYear" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <Calendar className="me-2" />
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
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="formReferenceOther" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <Info className="me-2" />
                  Otro
                  {(type === "website" || type === "book") && (
                    <RequiredFieldLabel tooltipMessage={"Es obligatorio"} />
                  )}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Información adicional"
                  value={referenceForm.other || ""}
                  onChange={(e) => handleInputChange("other", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewReference;