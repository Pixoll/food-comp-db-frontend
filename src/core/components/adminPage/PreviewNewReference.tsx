import { useTranslation } from "react-i18next";
import { useAuth } from "@/core/context/AuthContext";
import { useToast } from "@/core/context/ToastContext";
import { Author, City, Journal, JournalVolume } from "@/core/hooks";
import makeRequest from "@/core/utils/makeRequest";
import "@/assets/css/_PreviewNewReference.css";
import { NewArticle, ReferenceForm } from "./NewReference";

type PreviewNewReferenceProps = {
  data: ReferenceForm;
  cities: City[];
  authors: Author[];
  journals: Journal[];
  journalVolumes: JournalVolume[];
  forceReload: () => void;
  handleResetReferenceForm: (nextCode: number) => void;
};

const searchCityNameByID = (id: number | undefined, cities: City[]): string | undefined => {
  if (!id) return;
  return cities.find((city) => city.id === id)?.name;
};

const searchAuthorNameByID = (id: number | undefined, authors: Author[]): string | undefined => {
  if (!id) return;
  return authors.find((author) => author.id === id)?.name;
};

const searchVolumeInfoById = (
  id: number | undefined,
  journalVolumes: JournalVolume[],
  journals: Journal[],
  pageStart?: number,
  pageEnd?: number
): string => {
  if (!id) return "Sin información de volumen";

  const volume = journalVolumes.find((volume) => volume.id === id);
  if (volume) {
    const journal = journals.find((j) => j.id === volume.journalId);
    return journal
      ? `${journal.name}, Vol. ${volume.volume}(${volume.issue}), ${pageStart}-${pageEnd} - Año: ${volume.year}`
      : `Vol. ${volume.volume}(${volume.issue}), ${pageStart}-${pageEnd} - Año: ${volume.year}`;
  }

  return "Volumen no encontrado";
};

export default function PreviewNewReference({
  data,
  cities,
  authors,
  journals,
  journalVolumes,
  forceReload,
  handleResetReferenceForm,
}: PreviewNewReferenceProps) {
  const { state } = useAuth();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const formatNewArticle = (newArticle: NewArticle): string => {
    const { pageStart, pageEnd, volumeId, newVolume } = newArticle;

    let articleInfo = "";

    if (newVolume) {
      const { volume, issue, year, newJournal } = newVolume;
      if (newJournal) {
        articleInfo += newJournal;
      }
      articleInfo += `Vol. ${volume}(${issue}), ${pageStart}-${pageEnd} - Año: ${year}`;
    } else if (volumeId) {
      articleInfo += searchVolumeInfoById(
        volumeId,
        journalVolumes,
        journals,
        pageStart,
        pageEnd,
      );
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

  const handleSubmit = () => {
    makeRequest("post", `/references/${data.code}`, {
      token: state.token,
      payload: data,
      successCallback: () => {
        addToast({
          message: "Se creo exitosamente",
          title: "Éxito",
          type: "Success",
          position: "middle-center",
        });
        forceReload();
        handleResetReferenceForm(data.code + 1);
      },
      errorCallback: (error) => {
        addToast({
          message: error.response?.data?.message ?? error.message ?? "Error",
          title: "Fallo",
          type: "Danger",
          position: "middle-center",
        });
      },
    });
  };

  return (
    <Col>
      <Row className="justify-content-md-center">
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-primary">{data.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
              {data.year && <>
                {" "}- Año: {data.year}
              </>}
            </Card.Subtitle>
            <Card.Text>
              <div>
                <strong>{t("PreviewNewReference.Code")}</strong> {data.code}
              </div>
              {authorNames.length > 0 && (
                <div>
                  <strong>{t("PreviewNewReference.Authors")}</strong> {authorNames.join(" - ")}
                </div>
              )}
              {data.newAuthors && data.newAuthors.length > 0 && (
                <div>
                  <strong>{t("PreviewNewReference.New_A")}</strong> {data.newAuthors.join(" - ")}
                </div>
              )}
              {data.newArticle && (
                <div>
                  <strong>{t("PreviewNewReference.New")}</strong>{" "}
                  {formatNewArticle(data.newArticle)}
                </div>
              )}
              {cityName && (
                <div>
                  <strong>{t("PreviewNewReference.City")}</strong> {cityName}
                </div>
              )}
              {data.other && (
                <div>
                  <strong>{t("PreviewNewReference.Other")}</strong> {data.other}
                </div>
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <button className="button-form-of-reference" onClick={handleSubmit}>
          {t("PreviewNewReference.button")}
        </button>
      </Row>
    </Col>
  );
};
