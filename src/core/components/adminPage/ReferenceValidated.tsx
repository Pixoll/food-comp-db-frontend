import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Table } from "react-bootstrap";
import { City, Journal, Author, Reference } from "../../hooks";
import Pagination from "../search/Pagination";
import CSVReferenceDisplay from "./CSVReferenceDisplay";
import { CSVReference } from "./FoodsFromCsv";
import "../../../assets/css/_ReferenceValidated.css";

type ReferenceValidatedProps = {
  data: CSVReference[];
  citiesInfo: City[];
  authorsInfo: Author[];
  journalsInfo: Journal[];
  referencesInfo: Reference[];
  handleView: (change:boolean) => void;
};

export default function ReferenceValidated({
  data,
  citiesInfo,
  authorsInfo,
  journalsInfo,
  referencesInfo,
  handleView
}: ReferenceValidatedProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [filteredData, setFilteredData] = useState(data);

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
  const handleReferences = () =>{
    console.log("Se ha enviado las referencias") 
    handleView(false)
  }
  const [view, setView] = useState("list");
  const [selectedReference, setSelectedReference] =
    useState<CSVReference | null>(null);

  return (
    <Container fluid className="py-4">
      {view === "list" && (
        <Card>
          <Card.Header as="h2" className="titleStyle">
            {"Lista de referencias"}
          </Card.Header>
          <Card.Body>
            {filteredData.length === 0 ? (
              <Alert variant="info">Referencia no disponibles</Alert>
            ) : (
              <>
                <Table className="custom-table" bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Titulo</th>
                      <th>Año</th>
                      <th>Tipo de referencia</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((item, index) => (
                      <tr key={index}>
                        <td>{firstIndex + index + 1}</td>
                        <td>
                          {item.title?.parsed || item.title?.raw || "N/A"}
                        </td>
                        <td>{item.year?.parsed || item.year?.raw || "N/A"}</td>
                        <td>{item.type?.parsed || item.type?.raw || "N/A"}</td>
                        <td>
                          <Button
                            className="button-check"
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedReference(item);
                              setView("verificar");
                            }}
                          >
                            Ver
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
            Check
          </Card.Header>
          <Card.Body>
            {selectedReference && (
              <div className="mb-4">
                <CSVReferenceDisplay 
                reference={selectedReference}
                authorsInfo={authorsInfo}
                citiesInfo={citiesInfo}
                journalsInfo={journalsInfo}
                referencesInfo={referencesInfo} 
                />
              </div>
            )}
            <Button
              className="button-check"
              variant="succes"
              onClick={() => {
                setView("list");
                setSelectedReference(null);
              }}
            >
              Volver a la lista
            </Button>
          </Card.Body>
        </Card>
      )}
    <Container>
      <button className="button-form-of-food" onClick={handleReferences}>
        Enviar
      </button>
      </Container>
    </Container>
  );
}
