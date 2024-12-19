import { BookOpen, FileText, Layers, PlusCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Article, Journal, JournalVolume } from "../../hooks";
import { NewArticle, NewVolume } from "./NewReference";
import "../../../assets/css/_NewVolumByReference.css";
import "../../../assets/css/_newReference.css";

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

  const isVolumeUndefined = typeof selectedVolume?.volume === "undefined";
  const isVolumeBelow1 = (selectedVolume?.volume ?? 0) < 1;
  const isVolumeNotInteger = !Number.isSafeInteger(selectedVolume?.volume ?? 0);

  const isIssueUndefined = typeof selectedVolume?.issue === "undefined";
  const isIssueBelow1 = (selectedVolume?.issue ?? 0) < 1;
  const isIssueNotInteger = !Number.isSafeInteger(selectedVolume?.issue ?? 0);

  const isYearUndefined = typeof selectedVolume?.year === "undefined";
  const isYearBelow1 = (selectedVolume?.year ?? 0) < 1;
  const isYearOverCurrent = (selectedVolume?.year ?? 0) > new Date().getUTCFullYear();
  const isYearNotInteger = !Number.isSafeInteger(selectedVolume?.year ?? 0);

  const isPageStartUndefined = typeof selectedArticle?.pageStart === "undefined";
  const isPageStartBelow1 = (selectedArticle?.pageStart ?? 0) < 1;
  const isPageStartNotInteger = !Number.isSafeInteger(selectedArticle?.pageStart ?? 0);

  const isPageEndUndefined = typeof selectedArticle?.pageEnd === "undefined";
  const isPageEndBelow1 = (selectedArticle?.pageEnd ?? 0) < 1;
  const isPageEndBelowPageStart = (selectedArticle?.pageEnd ?? 1) <= (selectedArticle?.pageStart ?? 1);
  const isPageEndNotInteger = !Number.isSafeInteger(selectedArticle?.pageEnd ?? 0);

  return (
    <Container className="p-4">
      <Card className="mb-4">
        <Card.Header className="card-header">
          <BookOpen className="me-2"/>
          <Card.Title className="card-title-Article">Seleccionar una revista</Card.Title>
        </Card.Header>
        <Card.Body>
          {newJournal ? (
            <Row>
              <Col md={8}>
                <Form.Control
                  type="text"
                  maxLength={100}
                  isInvalid={!newJournalName?.length}
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
                <Form.Control.Feedback type="invalid">
                  Ingrese el nombre de la revista.
                </Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Button
                  onClick={handleAddJournal}
                  variant="outline-secondary"
                  className="large-button"
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
                  value={selectedIdJournal || ""}
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
                  className="large-button"
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
          <Card.Header className="card-header">
            <Layers className="me-2"/>
            <Card.Title className="card-title-Article">Seleccionar un volumen</Card.Title>
          </Card.Header>
          <Card.Body>
            {!newVolume ? (
              <Row>
                <Col md={8}>
                  <Form.Select
                    value={selectedIdVolume || ""}
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
                    className="large-button"
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
                    isInvalid={isVolumeUndefined || isVolumeBelow1 || isVolumeNotInteger}
                    placeholder="Volumen"
                    value={selectedVolume?.volume ?? ""}
                    onChange={(e) =>
                      handleUpdateVolume("volume", e.target.value.length > 0 ? +e.target.value : undefined)
                    }
                    className="mb-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {isVolumeUndefined ? "Ingrese el volúmen."
                      : isVolumeBelow1 ? "Volúmen debe ser al menos 1."
                        : "Volúmen debe ser un entero."}
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    isInvalid={isIssueUndefined || isIssueBelow1 || isIssueNotInteger}
                    placeholder="Número (Issue)"
                    value={selectedVolume?.issue ?? ""}
                    onChange={(e) =>
                      handleUpdateVolume("issue", e.target.value.length > 0 ? +e.target.value : undefined)
                    }
                    className="mb-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {isIssueUndefined ? "Ingrese el número."
                      : isIssueBelow1 ? "Número debe ser al menos 1."
                        : "Número debe ser un entero."}
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    isInvalid={isYearUndefined || isYearBelow1 || isYearOverCurrent || isYearNotInteger}
                    placeholder="Año"
                    value={selectedVolume?.year ?? ""}
                    onChange={(e) =>
                      handleUpdateVolume("year", e.target.value.length > 0 ? +e.target.value : undefined)
                    }
                    className="mb-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {isYearUndefined ? "Ingrese el año."
                      : isYearBelow1 ? "Año debe ser al menos 1."
                        : isYearOverCurrent ? "Año debe ser menor o igual al actual."
                          : "Año debe ser un entero."}
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Button
                    onClick={handleAddVolume}
                    variant="outline-secondary"
                    className="large-button"
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
          <Card.Header className="card-header">
            <FileText className="me-2"/>
            <Card.Title className="card-title-Article">Seleccionar un Artículo</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Control
                  type="number"
                  isInvalid={isPageStartUndefined || isPageStartBelow1 || isPageStartNotInteger}
                  placeholder="Página de inicio"
                  value={selectedArticle?.pageStart ?? ""}
                  onChange={(e) =>
                    handleUpdateArticle("pageStart", parseInt(e.target.value, 10))
                  }
                  className="mb-2"
                />
                <Form.Control.Feedback type="invalid">
                  {isPageStartUndefined ? "Ingrese la página de inicio."
                    : isPageStartBelow1 ? "Página de inicio debe ser al menos 1."
                      : "Página de inicio debe ser un entero."}
                </Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="number"
                  isInvalid={isPageEndUndefined || isPageEndBelow1 || isPageEndBelowPageStart || isPageEndNotInteger}
                  placeholder="Página final"
                  value={selectedArticle?.pageEnd ?? ""}
                  onChange={(e) =>
                    handleUpdateArticle("pageEnd", parseInt(e.target.value, 10))
                  }
                  className="mb-2"
                />
                <Form.Control.Feedback type="invalid">
                  {isPageEndUndefined ? "Ingrese la página final."
                    : isPageEndBelow1 ? "Página final debe ser al menos 1."
                      : isPageEndBelowPageStart ? "Página final debe ser mayor a página de inicio."
                        : "Página final debe ser un entero."}
                </Form.Control.Feedback>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};
