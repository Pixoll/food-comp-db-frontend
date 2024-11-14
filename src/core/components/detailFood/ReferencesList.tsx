import { ListGroup } from "react-bootstrap";
import { Reference } from "../../types/SingleFoodResult";

interface ReferencesListProps {
  references: Reference[];
}

const ReferencesList: React.FC<ReferencesListProps> = ({ references }) => {
  return (
    <ListGroup>
      {references.map((reference, index) => (
        <ListGroup.Item key={index} id={reference.code.toString()}>
          <strong>{reference.title}</strong> 
          <div>Tipo: {reference.type}</div>
          <div>Autores: {reference.authors.join(", ")}</div>
          {reference.refYear && <div>Año: {reference.refYear}</div>}
          {reference.cityName && <div>Ciudad: {reference.cityName}</div>}
          {reference.journalName && <div>Revista: {reference.journalName}</div>}
          {reference.volume && (
            <div>
              Volumen: {reference.volume}
              {reference.issue && `, Número: ${reference.issue}`}
            </div>
          )}
          {reference.pageStart && (
            <div>Páginas: {reference.pageStart} - {reference.pageEnd}</div>
          )}
          
          {reference.other && <div>Otra información: {reference.other}</div>}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ReferencesList;
