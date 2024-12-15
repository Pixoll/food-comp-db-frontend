import { BookOpen, FileText, Layers, PlusCircle, XCircle } from 'lucide-react';
import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Article, Journal, JournalVolume } from "./getters/UseReferences";
import { NewArticle, NewVolume } from "./NewReference";
import "../../../assets/css/_NewVolumByReference.css";

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

const searchIdJournalByIdVolume = (id: number | undefined, volumes: JournalVolume[]) => {
  const volume = volumes.find((volume) => volume.id === id);
  return volume?.journalId;
};

export default function NewArticleByReference({ data, dataForm, updateNewArticle }: NewArticleByReferenceProps) {
  const { journals, journalVolumes } = data;

  const [selectedIdJournal, setSelectedIdJournal] = useState<number | undefined>(
    searchIdJournalByIdVolume(dataForm.newArticle?.volumeId, journalVolumes)
    ?? dataForm.newArticle?.newVolume?.journalId
  );
  const [newJournalName, setNewJournalName] = useState(dataForm.newArticle?.newVolume?.newJournal);
  const [newJournal, setNewJournal] = useState(!!newJournalName);

  const doesJournalHaveValue = !!(selectedIdJournal ?? newJournalName);

  const [selectedIdVolume, setSelectedIdVolume] = useState<number | undefined>(
    doesJournalHaveValue ? dataForm.newArticle?.volumeId : undefined
  );
  const [selectedVolume, setSelectedVolume] = useState<Partial<NewVolume> | undefined>(
    doesJournalHaveValue && dataForm.newArticle?.newVolume
      ? { ...dataForm.newArticle.newVolume }
      : undefined
  );
  const [newVolume, setNewVolume] = useState(!!selectedVolume);

  const doesVolumeHaveValue = doesJournalHaveValue
    && !!(selectedIdVolume ?? (selectedVolume?.volume && selectedVolume.issue && selectedVolume.year));

  const [selectedArticle, setSelectedArticle] = useState<RecursivePartial<NewArticle> | undefined>(
    doesVolumeHaveValue ? dataForm.newArticle : undefined
  );

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

  const handleUpdateVolume = <K extends keyof NewVolume>(field: K, value: NewVolume[K]) => {
    setSelectedIdVolume(undefined);
    setSelectedVolume((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSelectedArticle(undefined);
    if (selectedVolume) {
      selectedVolume[field] = value;
    }
  };

  const handleAddJournal = () => {
    setNewJournal(!newJournal);
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
    setSelectedArticle(undefined);

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
  };

  const handleUpdateArticle = <K extends keyof NewArticle>(field: K, value: NewArticle[K]) => {
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

  return (
    <Container className="p-4">
      <Card className="mb-4">
        <Card.Header className="d-flex align-items-center">
          <BookOpen className="me-2"/>
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
                    setSelectedIdJournal(undefined);
                    setSelectedIdVolume(undefined);
                    setSelectedVolume(undefined);
                    setSelectedArticle(undefined);
                  }}
                />
              </Col>
              <Col md={4}>
                <Button
                  onClick={handleAddJournal}
                  variant="outline-secondary"
                  className="w-100 d-flex align-items-center justify-content-center"
                >
                  <XCircle className="me-2"/>
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
                  <PlusCircle className="me-2"/>
                  Nueva revista
                </Button>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {doesJournalHaveValue && (
        <Card className="mb-4">
          <Card.Header className="d-flex align-items-center">
            <Layers className="me-2"/>
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
                    <PlusCircle className="me-2"/>
                    Nuevo volumen
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col md={3}>
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
                <Col md={3}>
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
                <Col md={3}>
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
                <Col md={3}>
                  <Button
                    onClick={handleAddVolume}
                    variant="outline-secondary"
                    className="w-100 d-flex align-items-center justify-content-center"
                  >
                    <PlusCircle className="me-2"/>
                    Cancelar
                  </Button>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      )}

      {doesVolumeHaveValue && (
        <Card>
          <Card.Header className="d-flex align-items-center">
            <FileText className="me-2"/>
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
    </Container>
  );
};
