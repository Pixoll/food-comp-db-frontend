import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Table, Button, Card, Alert } from 'react-bootstrap';
import Pagination from "../search/Pagination";
import CSVReferenceDisplay from "./CSVReferenceDisplay";
import { CSVReference } from "./FoodsFromCsv";

type ReferenceValidatedProps = {
  data: CSVReference[];
}

const ReferenceValidated: React.FC<ReferenceValidatedProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [filteredData, setFilteredData] = useState(data);
  const { t } = useTranslation();
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const changePage = (page: number) => {
    if (page >= 1 && page <= npage) {
      setCurrentPage(page);
    }
  };

  const [view, setView] = useState("list");
  const [selectedReference, setSelectedReference] = useState<CSVReference | null>(null);

  return (
    <Container fluid className="py-4">
      {view === "list" && (
        <Card>
          <Card.Header as="h2" className=" text-black" >
            {"Lista de referencias"}
          </Card.Header>
          <Card.Body>
            {filteredData.length === 0 ? (
              <Alert variant="info">
                {t("ReferenceTableAdmin.NoAvailable")}
              </Alert>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>#</th>
                      <th>{t("ReferenceTableAdmin.Title")}</th>
                      <th>{t("ReferenceTableAdmin.Year")}</th>
                      <th>{t("ReferenceTableAdmin.Type")}</th>
                      <th>{t("ReferenceTableAdmin.Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((item, index) => (
                      <tr key={index}>
                        <td>{firstIndex + index + 1}</td>
                        <td>{item.title?.parsed || item.title?.raw || 'N/A'}</td>
                        <td>{item.year?.parsed || item.year?.raw || 'N/A'}</td>
                        <td>{item.type?.parsed || item.type?.raw || 'N/A'}</td>
                        <td>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => {
                              setSelectedReference(item);
                              setView("verificar");
                            }}
                          >
                            {t("ReferenceTableAdmin.Check")}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {npage > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination
                      currentPage={currentPage}
                      npage={npage}
                      onPageChange={changePage}
                    />
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      )}

      {view === "verificar" && (
        <Card>
          <Card.Header as="h2" className="bg-secondary text-white">
            {t("ReferenceTableAdmin.Check")}
          </Card.Header>
          <Card.Body>
            {selectedReference && (
              <div className="mb-4">
                <CSVReferenceDisplay reference={selectedReference} />
              </div>
            )}
            <Button 
              variant="succes" 
              onClick={() => {
                setView("list");
                setSelectedReference(null);
              }}
            >
              {"Checkear"}
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ReferenceValidated;