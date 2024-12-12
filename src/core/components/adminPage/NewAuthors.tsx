import React, { useState, useCallback } from "react";
import { Button, ListGroup, Row, Col, Container } from "react-bootstrap";
import { Author } from "./getters/UseReferences";
import SelectorWithInput from "../detailFood/SelectorWithInput";
import "../../../assets/css/_NewAuthors.css";


type NewAuthorsProps = {
  authorIds?: number[];
  newAuthors?: string[];
  data: Author[];
  updateAuthors: (authors: Author[]) => void;
};

const convert = (
  authorIds?: number[],
  newAuthors?: string[],
  authors?: Author[]
): Author[] => {
  const list: Author[] = [];

  if (authorIds) {
    authorIds.forEach((authorId) => {
      const existingAuthor = authors?.find((author) => author.id === authorId);
      if (existingAuthor){
        list.push({id:existingAuthor.id, name:existingAuthor.name})
      };
    });
  }

  if (newAuthors) {
    newAuthors.forEach((name, index) => {
      if (name) list.push({ id: -1, name });
    });
  }
  console.log(list)
  return list;
};

const NewAuthors: React.FC<NewAuthorsProps> = ({
  authorIds,
  newAuthors,
  data,
  updateAuthors,
}) => {
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>(
    convert(authorIds, newAuthors, data)
  );
  const [selectors, setSelectors] = useState<number[]>(
    Array(selectedAuthors.length || 1).fill(0).map((_, i) => i)
  );

  const updateParent = useCallback(() => {

      updateAuthors(selectedAuthors);
    
  }, [selectedAuthors, updateAuthors]);

  const handleSelectAuthor = (
    index: number,
    id: number | undefined,
    name: string
  ) => {
    const updatedAuthors = [...selectedAuthors];
    if (id) {
      const selectedAuthor = data.find((author) => author.id === id);
      if (selectedAuthor && !updatedAuthors.some((a) => a.id === id)) {
        updatedAuthors[index] = selectedAuthor;
      }
    } else if (name) {
      const newAuthor: Author = { id: -1, name };
      updatedAuthors[index] = newAuthor;
    }
    setSelectedAuthors(updatedAuthors);
    updateAuthors(updatedAuthors); 
  };
  

  const handleRemoveRow = (index: number) => {
    const updatedAuthors = selectedAuthors.filter((_, i) => i !== index);
    const updatedSelectors = selectors.filter((_, i) => i !== index);
    setSelectedAuthors(updatedAuthors);
    setSelectors(updatedSelectors);
    updateParent();
  };

  const handleAddSelector = () => {
    setSelectors([...selectors, selectors.length]);
    setSelectedAuthors([...selectedAuthors, { id: 0, name: "" }]);
  };

  return (
    <Container>
      <Row className="row">
        {selectors.map((_, index) => (
          <Col key={index} md={12} className="mb-2">
            <Row>
              <Col>
                <SelectorWithInput
                  options={data}
                  placeholder={"Selecciona o agregar un autor"}
                  selectedValue={selectedAuthors[index]?.name || ""}
                  onSelect={(id, name) => handleSelectAuthor(index, id, name)}
                />
              </Col>
              <Col xs="auto">
                <Button
                  variant="outline-danger"
                  onClick={() => handleRemoveRow(index)}
                >
                  Eliminar
                </Button>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
      <h4>Selecciona y agrega autores</h4>
      <ListGroup>
        {selectedAuthors.map((author, index) => (
          <ListGroup.Item key={author.id || index}>
            {author.name || "No se ha seleccionado un autor"}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button className="button" variant="primary" onClick={handleAddSelector}>
        Agregar autor
      </Button>
    </Container>
  );
};

export default NewAuthors;
