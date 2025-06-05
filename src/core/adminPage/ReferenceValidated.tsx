'use client'

import { BadgeX, CheckCircle, PlusCircle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Author, City, Journal, JournalVolume, Reference } from "@/hooks";
import makeRequest from "@/utils/makeRequest";
import Pagination from "@/app/search/components/Pagination";
import CSVReferenceDisplay from "./CSVReferenceDisplay";
import { CSVReference } from "./DataFromCsv";
import "@/core/adminPage/ReferenceValidated.css";

type ReferenceValidatedProps = {
  data: CSVReference[];
  citiesInfo: City[];
  authorsInfo: Author[];
  journalsInfo: Journal[];
  journalVolumesInfo: JournalVolume[];
  referencesInfo: Reference[];
  handleView: (change: boolean) => void;
};

enum Flag {
  VALID = 1,
  IS_NEW = 1 << 1,
  UPDATED = 1 << 2,
}

const getIconForFlags = (flags: number) => {
  if (!(flags & Flag.VALID)) {
    return <BadgeX color="red"></BadgeX>;
  }
  if (flags & Flag.IS_NEW) {
    return <PlusCircle color="blue"/>;
  }
  if (flags & Flag.UPDATED) {
    return <RefreshCw color="orange"/>;
  }
  if (flags & Flag.VALID) {
    return <CheckCircle color="green"/>;
  }
  return null;
};

const filterByFlag = (
  references: CSVReference[],
  filterOption: string
): CSVReference[] => {
  switch (filterOption) {
    case "Invalidos":
      return references.filter((ref) => !(ref.flags & Flag.VALID));
    case "Actualizados":
      return references.filter(
        (ref) => ref.flags & Flag.UPDATED && ref.flags & Flag.VALID
      );
    case "Validos":
      return references.filter(
        (ref) => ref.flags & Flag.VALID && !(ref.flags & Flag.UPDATED)
      );
    case "Nuevos":
      return references.filter((ref) => ref.flags & Flag.IS_NEW);
    default:
      return references;
  }
};

function separate(references: CSVReference[]) {
  const updated: CSVReference[] = [];
  const isNew: CSVReference[] = [];

  for (const ref of references) {
    if (!(ref.flags & Flag.VALID)) {
      continue;
    }

    if (ref.flags & Flag.UPDATED) {
      updated.push(ref);
    }

    if (ref.flags & Flag.IS_NEW) {
      isNew.push(ref);
    }
  }

  return { updated, isNew };
}

export default function ReferenceValidated({
  data,
  citiesInfo,
  authorsInfo,
  journalsInfo,
  journalVolumesInfo,
  referencesInfo,
  handleView,
}: ReferenceValidatedProps) {
  const [view, setView] = useState("list");
  const [selectedReference, setSelectedReference] =
    useState<CSVReference | null>(null);

  const { addToast } = useToast();
  const { state } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [filteredData, setFilteredData] = useState(data);
  const [selectedOption, setSelectedOption] = useState("Mostrar todos");

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const options = [
    "Mostrar todos",
    "Invalidos",
    "Actualizados",
    "Validos",
    "Nuevos",
  ];

  useEffect(() => {
    setFilteredData(filterByFlag(data, selectedOption));
    setCurrentPage(1);
  }, [data, selectedOption]);

  const changePage = (page: number) => {
    if (page >= 1 && page <= npage) {
      setCurrentPage(page);
    }
  };

  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const submitReferences = async () => {
    const { isNew } = separate(filteredData);

    const newReferences = isNew.map((ref) => {
      const type = ref.type.parsed ?? ref.type.old ?? undefined;
      const cityId = ref.city?.parsed ?? ref.city?.old ?? undefined;
      const volumeNumber = ref.volume?.parsed ?? ref.volume?.old ?? undefined;
      const issue = ref.issue?.parsed ?? ref.issue?.old ?? undefined;
      const volumeYear =
        ref.volumeYear?.parsed ?? ref.volumeYear?.old ?? undefined;
      const journalId = ref.journal?.parsed ?? ref.volumeYear?.old ?? undefined;
      const volumeId = journalVolumesInfo.find(
        (v) =>
          v.volume === volumeNumber &&
          v.issue === issue &&
          v.year === volumeYear &&
          v.journalId === journalId
      )?.id;

      const authorIds: number[] = [];
      const newAuthors: string[] = [];

      for (const author of ref.authors) {
        const id = author.parsed ?? author.old;
        if (id) {
          authorIds.push(id);
        } else {
          newAuthors.push(author.raw);
        }
      }

      return {
        code: ref.code.parsed ?? ref.code.old ?? undefined,
        type,
        title: ref.title.parsed ?? ref.title.old ?? undefined,
        authorIds,
        newAuthors,
        ...(type === "article" && {
          newArticle: {
            pageStart: ref.pageStart?.parsed ?? ref.pageStart?.old ?? undefined,
            pageEnd: ref.pageEnd?.parsed ?? ref.pageEnd?.old ?? undefined,
            volumeId,
            ...(!volumeId && {
              volume: volumeNumber,
              issue,
              year: volumeYear,
              journalId,
              ...(!journalId && {
                newJournal: ref.journal?.raw,
              }),
            }),
          },
        }),
        year: ref.year?.parsed ?? ref.year?.old ?? undefined,
        cityId,
        ...(!cityId && {
          newCity: ref.city?.raw,
        }),
        other: ref.other?.raw,
      };
    });

    // const updatedReferences = updated.map(x => x);

    if (newReferences.length > 0) {
      makeRequest("post", "/references", {
        token: state.token,
        payload: {
          references: newReferences,
        },
        successCallback: () => {
          addToast({
            message: "Las referencias se han enviado correctamente",
            title: "Éxito",
            type: "Success",
          });
          // para habilitar la vista de los alimentos
          handleView(false);
        },
        errorCallback: (error) => {
          addToast({
            message: error.response?.data?.message ?? error.message ?? "Error",
            title: "Fallo",
            type: "Danger",
          });
        }
      });
    } else {
      addToast({
        message: "No existen referencias nuevas para enviar",
        type: "Light",
      });

      handleView(false);
    }

    // for (const ref of updatedReferences) {
    //   await makeRequest(
    //     "patch",
    //     `/references/${ref.code}`,
    //     ref,
    //     state.token,
    //     () => {},
    //     (error) => {
    //       addToast({
    //         message: error.response?.data?.message ?? error.message ?? "Error",
    //         title: "Fallo",
    //         type: "Danger",
    //       });
    //     }
    //   );
    // }
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <Container fluid className="py-4">
      {view === "list" && (
        <Container>
          <h4>Mostrar </h4>
          <div className="dropdown-wrapper" ref={dropdownRef}>
            <div className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
              <span id="selected-option">{selectedOption}</span>
              <span>
                <i
                  className={`fa-solid fa-caret-down ${
                    isOpen ? "fa-rotate-180" : ""
                  }`}
                ></i>
              </span>
            </div>
            <div className={`dropdown-menu ${isOpen ? "active" : ""}`}>
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`order-item ${
                    selectedOption === option ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
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
                      <th>Código</th>
                      <th>Estado</th>
                      <th>Titulo</th>
                      <th>Año</th>
                      <th>Tipo de referencia</th>
                      <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {records.map((item, index) => (
                      <tr key={index}>
                        <td>{item.code.parsed}</td>
                        <td>{getIconForFlags(item.flags)}</td>
                        <td>
                          {item.title?.parsed || item.title?.raw || "N/A"}
                        </td>
                        <td>
                          {item.year?.parsed || item.year?.raw || "N/A"}
                        </td>
                        <td>
                          {item.type?.parsed || item.type?.raw || "N/A"}
                        </td>
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
        </Container>
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
        <button className="button-form-of-food" onClick={submitReferences}>
          Enviar
        </button>
      </Container>
    </Container>
  );
}
