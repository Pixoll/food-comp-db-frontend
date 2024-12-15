import { ListGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Reference } from "../../types/SingleFoodResult";

interface ReferencesListProps {
  references: Reference[];
}

export default function ReferencesList({ references }: ReferencesListProps) {
  const { t } = useTranslation();
  return (
    <ListGroup>
      {references.map((reference, index) => (
        <ListGroup.Item key={index} id={reference.code.toString()}>
          <strong>{reference.title}</strong>
          <div>{t('References.type')} {reference.type}</div>
          <div>{t('References.authors')} {reference.authors.join(", ")}</div>
          {reference.refYear && <div>{t('References.year')} {reference.refYear}</div>}
          {reference.cityName && <div>{t('References.city')} {reference.cityName}</div>}
          {reference.journalName && <div>{t('References.magazine')} {reference.journalName}</div>}
          {reference.volume && (
            <div>
              {t('References.Volume')} {reference.volume}
              {reference.issue && `, Número: ${reference.issue}`}
            </div>
          )}
          {reference.pageStart && (
            <div>{t('References.pages')} {reference.pageStart} - {reference.pageEnd}</div>
          )}

          {reference.other && <div>{t('References.additional')} {reference.other}</div>}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
