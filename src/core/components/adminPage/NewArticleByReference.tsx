import React, { useState} from "react";
import { NewArticle, NewVolume } from "./NewReference";
import { Journal, JournalVolume, Article } from "./getters/UseReferences";
import OriginSelector from "./OriginSelector";
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button,
  Card 
} from 'react-bootstrap';
import { 
  BookOpen, 
  PlusCircle, 
  XCircle, 
  Layers, 
  FileText 
} from 'lucide-react';

import "../../../assets/css/_NewVolumByReference.css";

const searchJournalNameById = (id: number | undefined, journals: Journal[]) => {
  const journal = journals.find((journal) => journal.id === id);
  return journal?.name;
};

const searchVolumeNameById = (
  id: number | undefined,
  volumes: JournalVolume[]
) => {
  const volume = volumes.find((volume) => volume.id === id);
  return volume
    ? `Volumen: ${volume.volume}, Número: (${volume.issue}), Año: ${volume.year}`
    : "";
};

const searchIdJournalByIdVolume = (
  id: number | undefined,
  volumes: JournalVolume[]
) => {
  const volume = volumes.find((volume) => volume.id === id);
  return volume?.journalId;
};
type NewArticleByReferenceProps = {
  data: {
    journals: Journal[];
    journalVolumes: JournalVolume[];
    articles: Article[];
  };
  dataForm: {
    newArticle?: NewArticle;
  };
  updateNewArticle: (updatedArticle: RecursivePartial<NewArticle>) => void;
};

export type RecursivePartial<T> = {
  [K in keyof T]?: NonNullable<T[K]> extends Array<infer U>
    ? Array<RecursivePartial<U>>
    : NonNullable<T[K]> extends ReadonlyArray<infer U>
    ? ReadonlyArray<RecursivePartial<U>>
    : NonNullable<T[K]> extends object
    ? RecursivePartial<NonNullable<T[K]>>
    : T[K];
};

const NewArticleByReference: React.FC<NewArticleByReferenceProps> = ({
  data,
  dataForm,
  updateNewArticle,
}) => {
  const [activeSection, setActiveSection] = useState<number>(1);

  const { journals, journalVolumes } = data;

  const [selectedIdJournal, setSelectedIdJournal] = useState<
    number | undefined
  >(
    searchIdJournalByIdVolume(dataForm.newArticle?.volumeId, journalVolumes) ||
      dataForm.newArticle?.newVolume?.journalId
  );
  const [newJournalName, setNewJournalName] = useState<string | undefined>(
    dataForm.newArticle?.newVolume?.newJournal
  );
  const [newJournal, setNewJournal] = useState<boolean>(!!newJournalName);

  const [selectedIdVolume, setSelectedIdVolume] = useState<number | undefined>(
    dataForm.newArticle?.volumeId
  );
  const [selectedVolume, setSelectedVolume] = useState<
    Partial<NewVolume> | undefined
  >(
    dataForm.newArticle?.newVolume
      ? { ...dataForm.newArticle.newVolume }
      : undefined
  );
  const [newVolume, setNewVolume] = useState(!!selectedVolume);

  const [selectedArticle, setSelectedArticle] = useState<
    RecursivePartial<NewArticle> | undefined
  >(dataForm.newArticle);

  const handleSelectVolume = (id: number | undefined) => {
    if (id !== undefined) {
      const selectedJournalVolume = journalVolumes.find((v) => v.id === id);
      if (selectedJournalVolume) {
        setSelectedIdVolume(id);
        setSelectedVolume(undefined);
        return;
      }
    }
    setSelectedIdVolume(undefined);
  };

  const handleUpdateVolume = <K extends keyof NewVolume>(
    field: K,
    value: NewVolume[K]
  ) => {
    setSelectedIdVolume(undefined);
    setSelectedVolume((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSelectedArticle(undefined);
    if (selectedVolume) {
      selectedVolume[field] = value;
      setActiveSection(
        selectedVolume.volume && selectedVolume.issue && selectedVolume.year
          ? 3
          : 2
      );
    }
  };

  const handleAddJournal = () => {
    setNewJournal(!newJournal);
    setActiveSection(1);
    if (selectedIdJournal) {
      setSelectedIdJournal(undefined);
      setSelectedVolume((prev) => ({
        ...prev,
        journalId: undefined,
        newJournal: undefined,
      }));
    } else {
      setNewJournalName(undefined);
    }
  };

  const handleAddVolume = () => {
    setNewVolume(!newVolume);

    if (newVolume) {
      setSelectedVolume({
        volume: undefined,
        issue: undefined,
        year: undefined,
        journalId: undefined,
        newJournal: undefined,
      });
    } else {
      setSelectedIdVolume(undefined);
    }

    setActiveSection(2);
  };

  type a = RecursivePartial<NewArticle>;

  const handleUpdateArticle = <K extends keyof NewArticle>(
    field: K,
    value: NewArticle[K]
  ) => {
    const updatedArticle: RecursivePartial<NewArticle> = {
      ...selectedArticle,
      [field]: value,
      volumeId: selectedIdVolume,
      newVolume: selectedVolume && {
        ...selectedVolume,
        journalId: selectedIdJournal,
        newJournal: newJournalName,
      },
    };

    setSelectedArticle(updatedArticle);
    updateNewArticle(updatedArticle);
  };

  const handleAddArticle = () => {
    if (
      selectedArticle &&
      selectedArticle.pageStart !== undefined &&
      selectedArticle.pageEnd !== undefined
    ) {
      const newArticle: RecursivePartial<NewArticle> = {
        ...selectedArticle,
        volumeId: selectedIdVolume,
      };
      updateNewArticle(newArticle);
    } else {
      console.error("Los valores de 'pageStart' y 'pageEnd' son obligatorios.");
    }
  };

  return (
    <Container className="p-4">
      <Card className="mb-4">
        <Card.Header className="d-flex align-items-center">
          <BookOpen className="me-2" />
          <Card.Title>Seleccionar una revista</Card.Title>
        </Card.Header>
        <Card.Body>
          {newJournal ? (
            <Row>
              <Col md={8}>
                <Form.Control
                  type="text"
                  placeholder="Agregar nueva revista"
                  value={newJournalName || ""}
                  className="mb-2"
                  onChange={(e) => {
                    setNewJournalName(e.target.value);
                    setSelectedIdVolume(undefined);
                    setSelectedVolume(undefined);
                    setSelectedArticle(undefined);
                    setActiveSection(e.target.value ? 2 : 1);
                  }}
                />
              </Col>
              <Col md={4}>
                <Button 
                  onClick={handleAddJournal} 
                  variant="outline-secondary" 
                  className="w-100 d-flex align-items-center justify-content-center"
                >
                  <XCircle className="me-2" />
                  Cancelar
                </Button>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col md={8}>
                <Form.Select
                  value={selectedIdJournal || ''}
                  onChange={(e) => {
                    const id = +e.target.value;
                    setSelectedIdJournal(id);
                    setNewJournalName(undefined);
                    setSelectedIdVolume(undefined);
                    setSelectedVolume(undefined);
                    setSelectedArticle(undefined);
                    setActiveSection(id ? 2 : 1);
                  }}
                >
                  <option value="">Selecciona una revista existente</option>
                  {journals.map((journal) => (
                    <option key={journal.id} value={journal.id}>
                      {journal.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Button 
                  onClick={handleAddJournal} 
                  variant="outline-primary" 
                  className="w-100 d-flex align-items-center justify-content-center"
                >
                  <PlusCircle className="me-2" />
                  Nueva revista
                </Button>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {activeSection >= 2 && (
        <Card className="mb-4">
          <Card.Header className="d-flex align-items-center">
            <Layers className="me-2" />
            <Card.Title>Seleccionar un volumen</Card.Title>
          </Card.Header>
          <Card.Body>
            {!newVolume ? (
              <Row>
                <Col md={8}>
                  <Form.Select
                    value={selectedIdVolume || ''}
                    onChange={(e) => {
                      const id = +e.target.value;
                      handleSelectVolume(id);
                      setSelectedArticle(undefined);
                      setActiveSection(id ? 3 : 2);
                    }}
                  >
                    <option value="">Selecciona un volumen existente</option>
                    {journalVolumes
                      .filter((v) => v.journalId === selectedIdJournal)
                      .map((v) => (
                        <option key={v.id} value={v.id}>
                          {`Volumen: ${v.volume}, Número: (${v.issue}), Año: ${v.year}`}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Button 
                    onClick={handleAddVolume} 
                    variant="outline-primary" 
                    className="w-100 d-flex align-items-center justify-content-center"
                  >
                    <PlusCircle className="me-2" />
                    Nuevo volumen
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col md={4}>
                  <Form.Control
                    type="number"
                    placeholder="Volumen"
                    value={selectedVolume?.volume || ""}
                    onChange={(e) =>
                      handleUpdateVolume("volume", parseInt(e.target.value, 10))
                    }
                    className="mb-2"
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="number"
                    placeholder="Número (Issue)"
                    value={selectedVolume?.issue || ""}
                    onChange={(e) =>
                      handleUpdateVolume("issue", parseInt(e.target.value, 10))
                    }
                    className="mb-2"
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="number"
                    placeholder="Año"
                    value={selectedVolume?.year || ""}
                    onChange={(e) =>
                      handleUpdateVolume("year", parseInt(e.target.value, 10))
                    }
                    className="mb-2"
                  />
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      )}

      {activeSection >= 3 && (
        <Card>
          <Card.Header className="d-flex align-items-center">
            <FileText className="me-2" />
            <Card.Title>Seleccionar un Artículo</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Control
                  type="number"
                  placeholder="Página de inicio"
                  value={selectedArticle?.pageStart || ""}
                  onChange={(e) =>
                    handleUpdateArticle("pageStart", parseInt(e.target.value, 10))
                  }
                  className="mb-2"
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="number"
                  placeholder="Página final"
                  value={selectedArticle?.pageEnd || ""}
                  onChange={(e) =>
                    handleUpdateArticle("pageEnd", parseInt(e.target.value, 10))
                  }
                  className="mb-2"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <div className="mt-4">
        <pre className="bg-light p-3 rounded">
          {JSON.stringify(
            {
              selectedArticle,
            },
            null,
            2
          )}
        </pre>
      </div>
    </Container>
  );
}
export default NewArticleByReference;
