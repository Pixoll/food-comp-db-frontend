import React, { useState, useEffect } from "react";
import { NewArticle, NewVolume } from "./NewReference";
import { Journal, JournalVolume, Article } from "./getters/UseReferences";
import OriginSelector from "./OriginSelector";
import { Button, Row, Col, Container, Form } from "react-bootstrap";

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

type NewVolumeByReferenceProps = {
  data: {
    journals: Journal[];
    journalVolumes: JournalVolume[];
    articles: Article[];
  };
  dataForm: {
    articleId?: number;
    newArticle?: NewArticle;
  };
};

const NewVolumeByReference: React.FC<NewVolumeByReferenceProps> = ({
  data,
  dataForm,
}) => {
  const { journals, journalVolumes, articles } = data;

  const [selectedIdJournal, setSelectedIdJournal] = useState<
    number | undefined
  >(undefined);
  const [newJournalName, setNewJournalName] = useState<string | undefined>(
    undefined
  );

  const [selectedIdVolume, setSelectedIdVolume] = useState<number | undefined>(
    undefined
  );
  const [selectedVolume, setSelectedVolume] = useState<Partial<NewVolume> | undefined>({
    volume: undefined,
    issue: undefined,
    year: undefined,
    journalId: undefined,
    newJournal: undefined,
  });

  const [selectedIdArticle, setSelectedIdArticle] = useState<number | undefined>(undefined);
  const [selectedArticle, setSelectedArticle] = useState<Partial<NewArticle> | undefined>(undefined);
  
  //para seleccionar el volumen por id
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

  //para añadir un nuevo volumen
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

  //para añadir una nueva revista
  const handleAddJournal = () => {
    if (newJournalName?.trim()) {
      setSelectedVolume((prev) => ({
        ...prev,
        newJournal: newJournalName.trim(),
        journalId: undefined,
      }));
      setNewJournalName(undefined);
    }
  };

const handleAddVolume = () => {
  if (selectedVolume) {
    setSelectedIdVolume(undefined); 

    setSelectedVolume((prev) => ({
      ...prev, 
      journalId: selectedVolume.journalId,
      newJournal: selectedVolume.newJournal,
    }));
  }
};


  return (
    <Container>
      <Row className="mb-4">
        <h4>Seleccionar una revista</h4>
        <Col md={4}>
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
        <Col md={6}>
          {selectedIdJournal === undefined && (
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
                  Agregar Revista
                </Button>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      <Row className="mb-3">
        <h4>Seleccionar un volumen</h4>
        <Col md={4}>
          <OriginSelector
            options={journalVolumes.map((v) => ({
              id: v.id,
              name: `Volumen: ${v.volume}, Número: (${v.issue}), Año: ${v.year}`,
            }))}
            placeholder="Selecciona un volumen existente"
            selectedValue={
              searchVolumeNameById(selectedIdVolume, journalVolumes) || ""
            }
            onSelect={(id) => handleSelectVolume(id || undefined)}
          />
        </Col>
        {selectedIdVolume === undefined && (
          <>
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
            <Col md={2}>
              <Button onClick={handleAddVolume} variant="secondary">
                Agregar Volumen
              </Button>
            </Col>
          </>
        )}
      </Row>
      <Row>
        <h4>Estado Actual del Artículo</h4>
        <Col>
          <pre>
            {JSON.stringify({ selectedIdVolume, selectedVolume }, null, 2)}
          </pre>
        </Col>
      </Row>
    </Container>
  );
};

export default NewVolumeByReference;
