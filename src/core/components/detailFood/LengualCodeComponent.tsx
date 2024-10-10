import { LangualCode } from "../../types/SingleFoodResult";
import Table from "react-bootstrap/Table";

interface LengualCodeComponentProps {
  data: LangualCode[];
}

const LengualCodeComponent: React.FC<LengualCodeComponentProps> = ({ data }) => {
  return (
    <Table responsive="sm" bordered hover striped className="mt-3">
      <thead className="table-primary">
        <tr>
          <th>Descripción Principal</th>
          <th>Código</th>
          <th>Descripción</th>
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
