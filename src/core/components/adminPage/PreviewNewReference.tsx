import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { ReferenceForm } from "./NewReference";
import { City, Author, Journal, JournalVolume } from "./getters/UseReferences";
import { NewArticle } from "./NewReference";
import "../../../assets/css/_PreviewNewReference.css";
type PreviewNewReferenceProps = {
  data: ReferenceForm;
  cities: City[];
  authors: Author[];
  journals: Journal[];
  journalVolumes: JournalVolume[];
};

const searchCityNameByID = (
  id: number | undefined,
  cities: City[]
): string | undefined => {
  if (!id) return;
  return cities.find((city) => city.id === id)?.name;
};

const searchAuthorNameByID = (
  id: number | undefined,
  authors: Author[]
): string | undefined => {
  if (!id) return;
  return authors.find((author) => author.id === id)?.name;
};
const searchVolumeInfoById = (
  id: number | undefined,
  journalVolumes: JournalVolume[],
  journals: Journal[]
): string => {
  if (!id) return "Sin información de volumen";

  const volumeJ = journalVolumes.find((jvolume) => jvolume.id === id);
  if (volumeJ) {
    const journal = journals.find((j) => j.id === volumeJ.journalId);
    return journal
      ? `${journal.name}, Volumen: ${volumeJ.volume}, Número: ${volumeJ.issue}, Año: ${volumeJ.year}`
      : `Volumen: ${volumeJ.volume}, Número: ${volumeJ.issue}, Año: ${volumeJ.year}`;
  }
  return "Volumen no encontrado";
};

const PreviewNewReference: React.FC<PreviewNewReferenceProps> = ({
  data,
  cities,
  authors,
  journals,
  journalVolumes,
}) => {
  const formatNewArticle = (newArticle: NewArticle): string => {
    const { pageStart, pageEnd, volumeId, newVolume } = newArticle;

    let articleInfo = `Páginas: ${pageStart}-${pageEnd}`;

    if (newVolume) {
      const { volume, issue, year, journalId, newJournal } = newVolume;
      articleInfo += `, Volumen: ${volume}, Número: ${issue}, Año: ${year}`;
      if (newJournal) {
        articleInfo += `, Revista: ${newJournal}`;
      }
    } else if (volumeId) {
      articleInfo += `, ${searchVolumeInfoById(
        volumeId,
        journalVolumes,
        journals
      )}`;
    }

    return articleInfo;
  };

  const cityName = data.cityId
    ? searchCityNameByID(data.cityId, cities)
    : data.newCity;

  const authorNames = data.authorIds
    ? data.authorIds
        .map((id) => searchAuthorNameByID(id, authors))
        .filter((name) => name)
    : [];
  return (
    <Col>
      <Row className="justify-content-md-center">
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-primary">{data.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {data.type.charAt(0).toUpperCase() + data.type.slice(1)} -{" "}
              {data.year}
            </Card.Subtitle>
            <Card.Text>
              {authorNames.length > 0 && (
                <div>
                  <strong>Autores:</strong> {authorNames.join(", ")}
                </div>
              )}
              {data.newAuthors && data.newAuthors.length > 0 && (
                <div>
                  <strong>Nuevos Autores:</strong> {data.newAuthors.join(", ")}
                </div>
              )}
              {data.newArticle && (
                <div>
                  <strong>Artículo Nuevo:</strong>{" "}
                  {formatNewArticle(data.newArticle)}
                </div>
              )}
              {cityName && (
                <div>
                  <strong>Ciudad:</strong> {cityName}
                </div>
              )}
              {data.other && (
                <div>
                  <strong>Otro:</strong> {data.other}
                </div>
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <button className="button-form-of-reference">Validar y enviar</button>
      </Row>
    </Col>
  );
};

export default PreviewNewReference;
