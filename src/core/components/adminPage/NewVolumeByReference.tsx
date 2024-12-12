import React, { useState , useEffect} from "react";
import { NewArticle, NewVolume } from "./NewReference";
import { Journal, JournalVolume, Article } from "./getters/UseReferences";
import OriginSelector from "./OriginSelector";
import { Button, Row, Col, Container, Form } from "react-bootstrap";
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
const searchArticleNameById = (id: number | undefined, articles: Article[]) => {
  const article = articles.find((article) => article.id === id);
  return article ? `Páginas: ${article.pageEnd}-${article.pageStart}` : "";
};

const searchIdJournalByIdVolume = (
  id: number | undefined,
  volumes: JournalVolume[]
) => {
  const volume = volumes.find((volume) => volume.id === id);
  return volume?.journalId;
};
type NewVolumeByReferenceProps = {
  data: {
    journals: Journal[];
    journalVolumes: JournalVolume[];
    articles: Article[];
  };
  dataForm: {
    newArticle?: NewArticle;
  };
  updateNewArticle: (updatedArticle: NewArticle) => void;
};

const NewVolumeByReference: React.FC<NewVolumeByReferenceProps> = ({
  data,
  dataForm,
  updateNewArticle,
}) => {
  const [activeSection, setActiveSection] = useState<number>(1);

  const { journals, journalVolumes, articles } = data;

  const [selectedIdJournal, setSelectedIdJournal] = useState<
    number | undefined
  >(searchIdJournalByIdVolume(dataForm.newArticle?.volumeId, journalVolumes) || dataForm.newArticle?.newVolume?.journalId);
  const [newJournalName, setNewJournalName] = useState<string | undefined>(
    dataForm.newArticle?.newVolume?.newJournal
  );
  const [newJournal, setNewJournal] = useState<boolean>(
    !!newJournalName 
  );
  
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
  const [newVolume, setnewVolume] = useState(!!selectedVolume);
  
  const [selectedArticle, setSelectedArticle] = useState<
    Partial<NewArticle> | undefined
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
    setnewVolume(!newVolume);

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

  const handleUpdateArticle = <K extends keyof NewArticle>(
    field: K,
    value: NewArticle[K]
  ) => {
    setSelectedArticle((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  

  const handleAddArticle = () => {
    if (
      selectedArticle &&
      selectedArticle.pageStart !== undefined &&
      selectedArticle.pageEnd !== undefined
    ) {
      const newArticle: Partial<NewArticle> = {
        ...selectedArticle,
        volumeId: selectedIdVolume,
      };
      updateNewArticle(newArticle as NewArticle); 
    } else {
      console.error("Los valores de 'pageStart' y 'pageEnd' son obligatorios.");
    }
  };
  

  const goToNextSection = () => {
    if (activeSection < 3) {
      switch (activeSection) {
        case 1:
          if (selectedIdJournal || newJournalName?.trim()) {
            setActiveSection((prev) => prev + 1);
          } else {
            alert("Por favor, seleccione o agregue una revista.");
          }
          break;
        case 2:
          if (
            selectedIdVolume ||
            (selectedVolume?.volume &&
              selectedVolume?.issue &&
              selectedVolume?.year)
          ) {
            setSelectedArticle((prev) => ({
              ...prev,
              volumeId: selectedIdVolume,
              newVolume:
                selectedVolume?.volume &&
                selectedVolume?.issue &&
                selectedVolume?.year
                  ? {
                      volume: selectedVolume.volume,
                      issue: selectedVolume.issue,
                      year: selectedVolume.year,
                      journalId: selectedIdJournal,
                      newJournal: newJournalName,
                    }
                  : undefined,
            }));
            const article: NewArticle = {
              pageStart: selectedArticle?.pageStart!,
              pageEnd: selectedArticle?.pageEnd!,
              volumeId: selectedIdVolume,
              newVolume:
                selectedVolume?.volume &&
                selectedVolume?.issue &&
                selectedVolume?.year
                  ? {
                      volume: selectedVolume.volume,
                      issue: selectedVolume.issue,
                      year: selectedVolume.year,
                      journalId: selectedIdJournal,
                      newJournal: newJournalName,
                    }
                  : undefined,
            };

            updateNewArticle(article);
            setActiveSection((prev) => prev + 1);
          } else {
            alert("Por favor, seleccione o agregue un volumen.");
          }
          break;
      }
    }
  };

  const goToPreviousSection = () => {
    if (activeSection > 1) {
      setActiveSection((prev) => prev - 1);
    }
  };

  const renderSectios = () => {
    switch (activeSection) {
      case 1:
        return (
          <Row className="mb-4">
            <h4>Seleccionar una revista</h4>
            {newJournal ? (
              <Row>
                <Col md={8}>
                  <Form.Control
                    type="text"
                    placeholder="Agregar nueva revista"
                    value={newJournalName || ""}
                    onChange={(e) => setNewJournalName(e.target.value)}
                  />
                </Col>
                <Col md={4}>
                  <Button onClick={handleAddJournal} variant="primary">
                    Cancelar nueva revista
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col md={8}>
                  <OriginSelector
                    options={journals}
                    placeholder="Selecciona una revista existente"
                    selectedValue={
                      searchJournalNameById(selectedIdJournal, journals) || ""
                    }
                    onSelect={(id, name) => {
                      setSelectedIdJournal(id || undefined);
                      setNewJournalName(undefined);
                    }}
                  />
                </Col>
                <Col md={4}>
                  <Button onClick={handleAddJournal} variant="secondary">
                    Agregar nueva revista
                  </Button>
                </Col>
              </Row>
            )}
          </Row>
        );

      case 2:
        return (
          <Row className="mb-3">
            <h4>Seleccionar un volumen</h4>
            {!newVolume ? (
              <Row>
                <Col md={8}>
                  <OriginSelector
                    options={journalVolumes.map((v) => ({
                      id: v.id,
                      name: `Volumen: ${v.volume}, Número: (${v.issue}), Año: ${v.year}`,
                    }))}
                    placeholder="Selecciona un volumen existente"
                    selectedValue={
                      searchVolumeNameById(selectedIdVolume, journalVolumes) ||
                      ""
                    }
                    onSelect={(id) => {
                      handleSelectVolume(id || undefined);
                    }}
                  />
                </Col>
                <Col md={4}>
                  <Button onClick={handleAddVolume} variant="secondary">
                    Agregar nuevo volumen
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    placeholder="Volumen"
                    value={selectedVolume?.volume || ""}
                    onChange={(e) =>
                      handleUpdateVolume("volume", parseInt(e.target.value, 10))
                    }
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    placeholder="Número (Issue)"
                    value={selectedVolume?.issue || ""}
                    onChange={(e) =>
                      handleUpdateVolume("issue", parseInt(e.target.value, 10))
                    }
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    placeholder="Año"
                    value={selectedVolume?.year || ""}
                    onChange={(e) =>
                      handleUpdateVolume("year", parseInt(e.target.value, 10))
                    }
                  />
                </Col>
                <Button onClick={handleAddVolume} variant="secondary">
                  Agregar volumen existente
                </Button>
              </Row>
            )}
          </Row>
        );

      case 3:
        return (
          <Row className="mb-3">
            <h4>Seleccionar un Artículo</h4>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Página de inicio"
                value={selectedArticle?.pageStart || ""}
                onChange={(e) =>
                  handleUpdateArticle("pageStart", parseInt(e.target.value, 10))
                }
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Página final"
                value={selectedArticle?.pageEnd || ""}
                onChange={(e) =>
                  handleUpdateArticle("pageEnd", parseInt(e.target.value, 10))
                }
              />
            </Col>
            <Col md={2}>
              <Button onClick={handleAddArticle} variant="secondary">
                Agregar Artículo
              </Button>
            </Col>
          </Row>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      {renderSectios()}
      <Row className="mt-3">
        <Col>
          <Button
            variant="secondary"
            onClick={goToPreviousSection}
            disabled={activeSection === 1}
            className="me-2"
          >
            Atrás
          </Button>
          <Button
            variant="primary"
            onClick={goToNextSection}
            disabled={activeSection === 3}
          >
            Siguiente
          </Button>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <pre>
            {JSON.stringify(
              {
                selectedArticle,
              },
              null,
              2
            )}
          </pre>
        </Col>
      </Row>
    </Container>
  );
};

export default NewVolumeByReference;
