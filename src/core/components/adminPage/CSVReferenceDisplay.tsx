import {
  BadgeX,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  PlusCircle,
  RefreshCw,
  Tag,
  Users,
} from "lucide-react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { CSVReference, CSVValue } from "./FoodsFromCsv";
import { City, Journal, Author, Reference } from "../../hooks";

enum Flag {
  INVALID = 0,
  VALID = 1,
  IS_NEW = 1 << 1,
  UPDATED = 1 << 2,
}

const getFlagNames = (flags: number): string[] => {
  const names: string[] = [];
  if (flags === Flag.INVALID) return ["Invalid"];
  if (flags & Flag.VALID) names.push("Valid");
  if (flags & Flag.IS_NEW) names.push("New");
  if (flags & Flag.UPDATED) names.push("Updated");
  return names;
};

const getIconForFlags = (flags: number) => {
  if (flags === Flag.INVALID) return BadgeX;
  if (flags & Flag.IS_NEW) return PlusCircle;
  if (flags & Flag.UPDATED) return RefreshCw;
  if (flags & Flag.VALID) return CheckCircle;
  return null;
};

const renderCSVValueWithFlags = <T,>(value: CSVValue<T> | null | undefined) => {
  if (!value) return <span className="text-muted">N/A</span>;

  const displayValue =
    value.parsed !== null ? value.parsed?.toString() : value.raw;
  const IconComponent = getIconForFlags(value.flags);

  return (
    <div className="d-flex align-items-center gap-2">
      <span>{displayValue}</span>
      {(value.flags === Flag.INVALID || value.flags > 0) && IconComponent && (
        <Badge
          bg={
            value.flags === Flag.INVALID
              ? "danger" // Color rojo para INVALID
              : value.flags & Flag.VALID
              ? "success" // Color amarillo para VALID
              : value.flags & Flag.IS_NEW
              ? "info" // Color azul para IS_NEW
              : value.flags & Flag.UPDATED
              ? "success" // Color verde para UPDATED
              : "secondary" // Color gris por defecto
          }
        >
          {getFlagNames(value.flags)[0]}
        </Badge>
      )}
    </div>
  );
};

type CSVReferenceDisplayProps = {
  reference: CSVReference;
  citiesInfo: City[];
  authorsInfo: Author[];
  journalsInfo: Journal[];
  referencesInfo: Reference[];
};
export default function CSVReferenceDisplay({
  reference,
  citiesInfo,
  authorsInfo,
  journalsInfo,
  referencesInfo,
}: CSVReferenceDisplayProps) {
  const referenceMath = journalsInfo.find((journal)=>(journal.id===reference.journal?.parsed !== null ? reference.journal?.parsed : reference.journal?.raw.toString()))
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white d-flex align-items-center gap-2">
        <BookOpen size={24} />
        <Card.Title className="mb-0">
          {renderCSVValueWithFlags(reference.title)}
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <Tag size={20} className="text-secondary" />
                <strong>Code:</strong> {renderCSVValueWithFlags(reference.code)}
              </div>
              <div className="d-flex align-items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <strong>Year:</strong> {renderCSVValueWithFlags(reference.year)}
              </div>
              <div className="d-flex align-items-center gap-2">
                <FileText size={20} className="text-success" />
                <strong>Tipo de referencia:</strong>{" "}
                {renderCSVValueWithFlags(reference.type)}
              </div>
            </div>
          </Col>
          <Col md={6}>
            {reference.journal && (
              <div className="d-flex align-items-center gap-2">
                <BookOpen size={20} className="text-info" />
                <strong>Journal:</strong>{" "}
                {referenceMath?.name}
                {renderCSVValueWithFlags(reference.journal)}
              </div>
            )}
            {reference.volume && (
              <div className="d-flex align-items-center gap-2">
                <Tag size={20} className="text-secondary" />
                <strong>Volume:</strong>{" "}
                {renderCSVValueWithFlags(reference.volume)}
              </div>
            )}
            {reference.issue && (
              <div className="d-flex align-items-center gap-2">
                <Tag size={20} className="text-secondary" />
                <strong>Issue:</strong>{" "}
                {renderCSVValueWithFlags(reference.issue)}
              </div>
            )}
          </Col>
        </Row>

        <Card className="mb-3 border-light">
          <Card.Header className="bg-light d-flex align-items-center gap-2">
            <Users size={20} className="text-secondary" />
            <strong>Authors</strong>
          </Card.Header>
          <Card.Body>
            {reference.authors.map((author, index) => {
              // Determina el ID del autor
              const authorId = author.parsed !== null ? author.parsed : author.raw.toString();

              // Busca el autor en authorsInfo
              const matchedAuthor = authorsInfo.find(
                (authorMap) => authorMap.id === authorId
              );

              return (
                <div key={index} className="mb-2">
                  {matchedAuthor ? (
                    <span>{matchedAuthor.name}</span>
                  ) : (
                    <span className="text-muted">Author not found</span>
                  )}
                  {/* Renderiza siempre el valor CSV del autor */}
                  {renderCSVValueWithFlags(author)}
                </div>
              );
            })}
          </Card.Body>
        </Card>

        {reference.other && (
          <Card className="border-light">
            <Card.Header className="bg-light d-flex align-items-center gap-2">
              <FileText size={20} className="text-secondary" />
              <strong>Additional Information</strong>
            </Card.Header>
            <Card.Body>{renderCSVValueWithFlags(reference.other)}</Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
}
