import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import { LangualCode } from "../../types/SingleFoodResult";

interface LangualCodeComponentProps {
  data: LangualCode[];
}

export default function LangualCodeComponent({ data }: LangualCodeComponentProps) {
  const { t } = useTranslation();
  return (
    <Table responsive="sm" bordered hover striped className="mt-3">
      <thead className="table-primary">
      <tr>
        <th>{t('LangualCode.description_main')}</th>
        <th>{t('LangualCode.code')}</th>
        <th>{t('LangualCode.description')}</th>
      </tr>
      </thead>
      <tbody>
      {data.map((codeLangual, index) => (
        codeLangual.children.map((child, childIndex) => (
          <tr key={`${index}-${childIndex}`}>
            <td className={childIndex === 0 ? "fw-bold" : "text-muted"}>
              {childIndex === 0 ? codeLangual.descriptor : ""}
            </td>
            <td>{child.code}</td>
            <td>{child.descriptor}</td>
          </tr>
        ))
      ))}
      </tbody>
    </Table>
  );
};
