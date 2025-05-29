'use client'
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Author } from "@/hooks";
import SelectorWithInput from "../detailFood/SelectorWithInput";
import "@/assets/css/_NewAuthors.css";

type NewAuthorsProps = {
  authorIds?: number[];
  newAuthors?: string[];
  data: Author[];
  updateAuthors: (authors: Author[]) => void;
};

const convert = (authorIds?: number[], newAuthors?: string[], authors?: Author[]): Author[] => {
  const list: Author[] = [];

  authorIds?.forEach((authorId) => {
    const existingAuthor = authors?.find((author) => author.id === authorId);
    if (existingAuthor) {
      list.push({ ...existingAuthor });
    }
  });

  newAuthors?.forEach((name) => {
    if (name) list.push({ id: -1, name });
  });

  return list;
};

export default function NewAuthors({ authorIds, newAuthors, data, updateAuthors }: NewAuthorsProps) {
  const { t } = useTranslation();
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>(convert(authorIds, newAuthors, data));
  const [selectors, setSelectors] = useState<number[]>(
    Array.from({ length: selectedAuthors.length }, (_, i) => i)
  );

  const updateParent = useCallback(() => {
    updateAuthors(selectedAuthors);
  }, [selectedAuthors, updateAuthors]);

  const handleSelectAuthor = (index: number, id: number | undefined, name: string) => {
    const updatedAuthors = [...selectedAuthors];
    if (id) {
      const selectedAuthor = data.find((author) => author.id === id);
      if (selectedAuthor && !updatedAuthors.some((a) => a.id === id)) {
        updatedAuthors[index] = selectedAuthor;
      }
    } else if (name) {
      updatedAuthors[index] = { id: -1, name };
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
                  newValueMaxLength={200}
                  placeholder={t("NewAuthors.author")}
                  selectedValue={selectedAuthors[index]?.name || ""}
                  onSelect={(id, name) => handleSelectAuthor(index, id, name)}
                />
              </Col>
              <Col xs="auto">
                <Button
                  variant="outline-danger"
                  onClick={() => handleRemoveRow(index)}
                >
                  {t("NewAuthors.Eliminate")}
                </Button>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
      <h4>{t("NewAuthors.Select")}</h4>
      <ListGroup>
        {selectedAuthors.map((author, index) => (
          <ListGroup.Item key={author.id || index}>
            {author.name || t("NewAuthors.No_selected")}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button className="button" variant="primary" onClick={handleAddSelector}>
        {t("NewAuthors.Add")}
      </Button>
    </Container>
  );
}
