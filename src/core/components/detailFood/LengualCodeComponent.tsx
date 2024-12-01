import { LangualCode } from "../../types/SingleFoodResult";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";

interface LengualCodeComponentProps {
  data: LangualCode[];
}

const LengualCodeComponent: React.FC<LengualCodeComponentProps> = ({ data }) => {
  const {t} = useTranslation("global");
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
        {data.map((codeLengual, index) => (
          codeLengual.children.map((child, childIndex) => (
            <tr key={`${index}-${childIndex}`}>
              <td className={childIndex === 0 ? "fw-bold" : "text-muted"}>
                {childIndex === 0 ? codeLengual.descriptor : ""}
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

export default LengualCodeComponent;
