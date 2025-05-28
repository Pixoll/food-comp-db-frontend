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
import { CSVReference, CSVValue } from "./DataFromCsv";
import { City, Journal, Author, Reference } from "../../hooks";

enum Flag {
  VALID = 1,
  IS_NEW = 1 << 1,
  UPDATED = 1 << 2,
}

type Info = {
  id: number;
  name: string;
};

const getFlagNames = (flags: number): string[] => {
  const names: string[] = [];
  if (!(flags & Flag.VALID)) return ["Invalid"];
  if (flags & Flag.VALID) names.push("Valid");
  if (flags & Flag.IS_NEW) names.push("New");
  if (flags & Flag.UPDATED) names.push("Updated");
  return names;
};

const getIconForFlags = (flags: number) => {
  if (!(flags & Flag.VALID)) return BadgeX;
  if (flags & Flag.IS_NEW) return PlusCircle;
  if (flags & Flag.UPDATED) return RefreshCw;
  if (flags & Flag.VALID) return CheckCircle;
  return null;
};

const getBadgeVariant = (flags: number) => {
  if (!(flags & Flag.VALID)) return "danger";
  if (flags & Flag.IS_NEW) return "info";
  if (flags & Flag.UPDATED) return "warning";
  if (flags & Flag.VALID) return "success";
  return "secondary";
};

const renderCSVValueWithFlags = <T,>(value: CSVValue<T> | null | undefined, info?: Info[]) => {
  if (!value) return <span className="text-muted">N/A</span>;

  const displayValue = value.parsed !== null
    ? info?.find(i => i.id === value.parsed)?.name ?? value.parsed?.toString()
    : value.raw;
  const IconComponent = getIconForFlags(value.flags);
  const flagNames = getFlagNames(value.flags);

  return (
    <div className="d-flex align-items-start gap-2">
      <div className="d-flex flex-column">
        <span>{displayValue}</span>
        {!!(value.flags & (Flag.UPDATED | Flag.VALID)) && value.old !== undefined && (
          <small className="text-muted">Anterior: {value.old?.toString()}</small>
        )}
      </div>
      {IconComponent && (
        <div className="d-flex gap-1">
          {flagNames.map((flagName, index) => (
            <Badge
              key={index}
              bg={getBadgeVariant(value.flags)}
              className="ms-1"
            >
              {flagName}
            </Badge>
          ))}
        </div>
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

const CSVReferenceDisplay = ({
  reference,
  citiesInfo,
  authorsInfo,
  journalsInfo,
  referencesInfo,
}: CSVReferenceDisplayProps) => {
  const matchedJournal = journalsInfo.find(
    (journal) => journal.id === (reference.journal?.parsed ?? reference.journal?.raw.toString())
  );

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex align-items-center gap-2">
          <BookOpen size={24} />
          <Card.Title className="mb-0">
            {renderCSVValueWithFlags(reference.title)}
          </Card.Title>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={6}>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-2">
                <Tag size={20} className="text-secondary" />
                <strong>Código de la referencia:</strong> {renderCSVValueWithFlags(reference.code)}
              </div>
              <div className="d-flex align-items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <strong>Año:</strong> {renderCSVValueWithFlags(reference.year)}
              </div>
              <div className="d-flex align-items-center gap-2">
                <FileText size={20} className="text-success" />
                <strong>Tipo de referencia:</strong> {renderCSVValueWithFlags(reference.type)}
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="d-flex flex-column gap-3">
              {reference.journal && (
                <div className="d-flex align-items-start gap-2">
                  <BookOpen size={20} className="text-info" />
                  <div>
                    <strong>Revista:</strong>
                    <div className="d-flex align-items-center gap-2">
                      {matchedJournal?.name && (
                        <span>{matchedJournal.name}</span>
                      )}
                      {renderCSVValueWithFlags(reference.journal)}
                    </div>
                  </div>
                </div>
              )}
              {reference.volume && (
                <div className="d-flex align-items-center gap-2">
                  <Tag size={20} className="text-secondary" />
                  <strong>Volumen:</strong> {renderCSVValueWithFlags(reference.volume)}
                </div>
              )}
              {reference.issue && (
                <div className="d-flex align-items-center gap-2">
                  <Tag size={20} className="text-secondary" />
                  <strong>Issue:</strong> {renderCSVValueWithFlags(reference.issue)}
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Card className="mb-3 border-light">
          <Card.Header className="bg-light">
            <div className="d-flex align-items-center gap-2">
              <Users size={20} className="text-secondary" />
              <strong>Autores</strong>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-column gap-3">
              {reference.authors.map((author, index) => {
                const authorId = author.parsed !== null ? author.parsed : author.raw.toString();
                const matchedAuthor = authorsInfo.find(
                  (authorInfo) => authorInfo.id === authorId
                );

                return (
                  <div key={index} className="d-flex align-items-start gap-2">
                    <div className="d-flex flex-column">
                      {matchedAuthor && (
                        <span>{matchedAuthor.name}</span>
                      )}
                      {renderCSVValueWithFlags(author, authorsInfo)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        {reference.other && (
          <Card className="border-light">
            <Card.Header className="bg-light">
              <div className="d-flex align-items-center gap-2">
                <FileText size={20} className="text-secondary" />
                <strong>Additional Information</strong>
              </div>
            </Card.Header>
            <Card.Body>
              {renderCSVValueWithFlags(reference.other)}
            </Card.Body>
          </Card>
        )}
        {reference.city && (
          <Card className="border-light mt-3">
            <Card.Header className="bg-light">
              <div className="d-flex align-items-center gap-2">
                <Tag size={20} className="text-secondary" />
                <strong>Ciudad</strong>
              </div>
            </Card.Header>
            <Card.Body>
              {renderCSVValueWithFlags(reference.city, citiesInfo)}
            </Card.Body>
          </Card>
        )}
        {(reference.volumeYear || reference.pageStart || reference.pageEnd) && (
          <Card className="border-light mt-3">
            <Card.Header className="bg-light">
              <div className="d-flex align-items-center gap-2">
                <FileText size={20} className="text-secondary" />
                <strong>Detalles del volumén:</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                {reference.volumeYear && (
                  <Col md={4}>
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={20} className="text-primary" />
                      <strong>Volume Year:</strong> {renderCSVValueWithFlags(reference.volumeYear)}
                    </div>
                  </Col>
                )}
                {(reference.pageStart || reference.pageEnd) && (
                  <Col md={8}>
                    <div className="d-flex align-items-center gap-2">
                      <FileText size={20} className="text-secondary" />
                      <strong>Paginas:</strong>{" "}
                      {reference.pageStart && renderCSVValueWithFlags(reference.pageStart)}
                      {reference.pageEnd && (
                        <>
                          {" - "}
                          {renderCSVValueWithFlags(reference.pageEnd)}
                        </>
                      )}
                    </div>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
};

export default CSVReferenceDisplay;
