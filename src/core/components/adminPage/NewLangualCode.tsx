import React, { useState } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { PlusCircle , Trash2  } from "lucide-react";
import {LangualCode}from "./getters/useLangualCodes";
import Pagination from "../search/Pagination";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 5;
type NewLangualCodesProps = {
    langualCodes:LangualCode[];
    selectedLangualCodes: number[];
  onLangualCodesChange: (id: number) => void;
}
const NewLangualCodes: React.FC<NewLangualCodesProps> = ({langualCodes, selectedLangualCodes, onLangualCodesChange}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLangualCodes = langualCodes.filter((langualCode) =>
    langualCode.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = filteredLangualCodes.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredLangualCodes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const { t } = useTranslation();
  return (
    <div className="langual-codes-container space-y-4 py-4">
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder={t("LangualCode.Search")}
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form>
      {currentItems.map((langualCode) => {
        const isSelected = selectedLangualCodes.includes(langualCode.id);

        return (
          <Card
            key={langualCode.id}
            className="shadow-lg border-0 overflow-hidden mb-4 hover:scale-[1.01] transition-transform duration-300"
          >
            <Row className="g-0 h-100 align-items-stretch">
              <Col md={9} className="p-4">
                <div className="space-y-2 h-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Codigo Langual: {langualCode.code}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div>
                      <span className="font-semibold">Descriptor:</span>{" "}
                      {langualCode.descriptor}
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={3} className="d-flex">
                <Button
                  variant={isSelected ? "danger" : "success"}
                  className="w-100 d-flex align-items-center justify-content-center border-0 rounded-0 hover:scale-105 transition-transform duration-300"
                  onClick={() => onLangualCodesChange(langualCode.id)}
                >
                  <div className="text-center">
                    {isSelected ? (
                      <>
                        <Trash2 className="mx-auto mb-2" size={24} />
                        <span className="d-block">{t("LangualCode.Eliminate")}</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mx-auto mb-2" size={24} />
                        <span className="d-block">{t("LangualCode.Add")}</span>
                      </>
                    )}
                  </div>
                </Button>
              </Col>
            </Row>
          </Card>
        );
      })}

      <Pagination
        currentPage={currentPage}
        npage={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default NewLangualCodes;
