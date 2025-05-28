'use client'
import { Book, Calendar, FileText, Globe, Info, MapPin, TagIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { City } from "../../hooks";
import RequiredFieldLabel from "../detailFood/RequiredFieldLabel";
import SelectorWithInput from "../detailFood/SelectorWithInput";
import "../../../assets/css/_newReference.css";

export type ReferenceForm = {
  code: number;
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
  code: number;
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
  if (!id) return;
  const city = cities.find((city) => city.id === id);
  return city?.name;
};

export default function NewReference({
  code,
  type,
  title,
  year,
  cityId,
  newCity,
  other,
  cities,
  onFormUpdate,
}: NewReferenceProps) {
  const { t } = useTranslation();
  const [referenceForm, setReferenceForm] = useState<ReferenceForm>({
    code,
    type,
    title,
    year,
    cityId,
    newCity,
    other,
  });

  const handleInputChange = <K extends keyof ReferenceForm>(field: K, value: ReferenceForm[K]) => {
    const updatedForm = { ...referenceForm } as ReferenceForm;

    if (field === "cityId") {
      updatedForm.cityId = value as ReferenceForm["cityId"];
      updatedForm.newCity = undefined;
    } else if (field === "newCity") {
      updatedForm.newCity = value as ReferenceForm["newCity"];
      updatedForm.cityId = undefined;
    } else {
      updatedForm[field] = value;
    }

    if (field === "type" && value !== "article") {
      updatedForm.newArticle = undefined;
    }

    setReferenceForm(updatedForm);
    onFormUpdate(updatedForm);
  };

  const getReferenceTypeIcon = () => {
    switch (type) {
      case "book":
        return <Book className="me-2"/>;
      case "article":
        return <FileText className="me-2"/>;
      case "website":
        return <Globe className="me-2"/>;
      case "report":
        return <Info className="me-2"/>;
      case "thesis":
        return <FileText className="me-2"/>;
      default:
        return null;
    }
  };

  const isTypeNotArticleOrWebsite = type !== "article" && type !== "website";
  const isYearDefined = typeof referenceForm.year !== "undefined";
  const isYearBelow1 = (referenceForm.year ?? 0) < 1;
  const isYearOverCurrent = (referenceForm.year ?? 0) > new Date().getUTCFullYear();
  const isYearNotInteger = !Number.isSafeInteger(referenceForm.year ?? 0);

  const isTypeWebsiteOrBook = type === "website" || type === "book";

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header className="card-header">
        {getReferenceTypeIcon()}
        <Card.Title className="mb-0">{t("NewReference.Add")}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formReferenceCode" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <TagIcon className="me-2"/>
                  {t("NewReference.Code")}
                  <RequiredFieldLabel tooltipMessage={t("NewReference.required")}/>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder={t("NewReference.Code")}
                  value={code}
                  disabled
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formReferenceType" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <Book className="me-2"/>
                  {t("NewReference.Type")}
                  <RequiredFieldLabel tooltipMessage={t("NewReference.required")}/>
                </Form.Label>
                <Form.Select
                  value={referenceForm.type}
                  onChange={(e) => handleInputChange("type", e.target.value as ReferenceForm["type"])}
                >
                  <option value="report">{t("NewReference.Report")}</option>
                  <option value="thesis">{t("NewReference.Thesis")}</option>
                  <option value="article">{t("NewReference.Article")}</option>
                  <option value="website">{t("NewReference.Website")}</option>
                  <option value="book">{t("NewReference.Book")}</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group controlId="formReferenceTitle" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FileText className="me-2"/>
                  {t("NewReference.Title")}
                  <RequiredFieldLabel tooltipMessage={t("NewReference.required")}/>
                </Form.Label>
                <Form.Control
                  type="text"
                  maxLength={300}
                  isInvalid={referenceForm.title.length === 0}
                  placeholder={t("NewReference.Enter_t")}
                  value={referenceForm.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Ingrese el título.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formReferenceCity" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <MapPin className="me-2"/>
                  {t("NewReference.City")}
                </Form.Label>
                <SelectorWithInput
                  options={cities}
                  newValueMaxLength={100}
                  placeholder={t("NewReference.Select")}
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
                  <Calendar className="me-2"/>
                  {t("NewReference.Year")}
                  {isTypeNotArticleOrWebsite && (
                    <RequiredFieldLabel tooltipMessage={t("NewReference.required")}/>
                  )}
                </Form.Label>
                <Form.Control
                  type="number"
                  isInvalid={
                    (isYearDefined || isTypeNotArticleOrWebsite)
                    && (isYearBelow1 || isYearOverCurrent || isYearNotInteger)
                  }
                  placeholder={t("NewReference.Enter_y")}
                  value={referenceForm.year ?? ""}
                  onChange={(e) =>
                    handleInputChange("year", e.target.value.length > 0 ? +e.target.value : undefined)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {!isYearDefined ? "Ingrese el año."
                      : isYearBelow1 ? "Año debe ser al menos 1."
                        : isYearOverCurrent ? "Año debe ser menor o igual al actual."
                          : "Año debe ser un entero."}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="formReferenceOther" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <Info className="me-2"/>
                  {t("NewReference.Other")}
                  {isTypeWebsiteOrBook && (
                    <RequiredFieldLabel tooltipMessage={t("NewReference.required")}/>
                  )}
                </Form.Label>
                <Form.Control
                  type="text"
                  maxLength={100}
                  isInvalid={isTypeWebsiteOrBook && !referenceForm.other?.length}
                  placeholder={t("NewReference.Additional")}
                  value={referenceForm.other || ""}
                  onChange={(e) => handleInputChange("other", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Ingrese la información adicional.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};
