import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FoodResult } from "../../types/option";
import Pagination from "./Pagination";
import "../../../assets/css/_foodResultsTable.css";

interface FoodResultsListProps {
  data: FoodResult[];
  searchForName: string;
  setSearchForName: (value: string) => void;
}

enum SortType {
  CODE,
  NAME,
  SCIENTIFIC_NAME,
}

enum SortOrder {
  ASC,
  DESC,
}

export default function FoodResultsTable({
  data,
  searchForName,
  setSearchForName,
}: FoodResultsListProps) {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { t, i18n } = useTranslation();
  const [selectedSort, setSelectedSort] = useState(SortType.NAME);
  const [sortOrder, setSortOrder] = useState(SortOrder.ASC);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedData, setSortedData] = useState<FoodResult[]>([]);
  const selectedLanguage = i18n.language as "en" | "es" | "pt";

  const npage = Array.isArray(sortedData)
    ? Math.ceil(sortedData.length / resultsPerPage)
    : 0;
  const lastIndex = currentPage * resultsPerPage;
  const firstIndex = lastIndex - resultsPerPage;
  const records = Array.isArray(sortedData)
    ? sortedData.slice(firstIndex, lastIndex)
    : [];

  const toFoodDetail = (code: string) => {
    navigate(`/search/details/${code}`);
  };

  const toModifyFoodDetail = (code: string) => {
    if (state.isAuthenticated) {
      navigate(`/search/modify-details-food/${code}`);
    } else {
      navigate("/login");
    }
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= npage) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const sorted = [...data].sort((a, b) => {
      let stringA: string;
      let stringB: string;

      switch (selectedSort) {
        case SortType.CODE: {
          stringA = a.code;
          stringB = b.code;
          break;
        }
        case SortType.NAME: {
          stringA = a.commonName[selectedLanguage]?.toLowerCase() ?? "~";
          stringB = b.commonName[selectedLanguage]?.toLowerCase() ?? "~";
          break;
        }
        case SortType.SCIENTIFIC_NAME: {
          const scientificNameA = a.scientificName?.toLowerCase() ?? "";
          const subspeciesA = a.subspecies?.toLowerCase() ?? "";
          const scientificNameB = b.scientificName?.toLowerCase() ?? "";
          const subspeciesB = b.subspecies?.toLowerCase() ?? "";
          stringA = (subspeciesA ? `${scientificNameA} ${subspeciesA}` : scientificNameA) || "~";
          stringB = (subspeciesB ? `${scientificNameB} ${subspeciesB}` : scientificNameB) || "~";
          break;
        }
      }

      if (stringA > stringB) {
        return sortOrder === SortOrder.ASC ? 1 : -1;
      }

      if (stringA < stringB) {
        return sortOrder === SortOrder.ASC ? -1 : 1;
      }

      return 0;
    });

    setSortedData(sorted);

    const maxPage = Math.max(Math.ceil(sorted.length / resultsPerPage), 1);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
    // eslint-disable-next-line
  }, [data, selectedLanguage, selectedSort, sortOrder, resultsPerPage, searchForName]);

  const handleSortClick = (type: SortType) => {
    if (selectedSort === type) {
      setSortOrder(sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC);
    } else {
      setSelectedSort(type);
      setSortOrder(SortOrder.ASC);
    }
  };

  return (
    <div className="food-list">
      <h2>{t("Table.title")}</h2>
      <div className="filter-name">
        <Row className="g-3">
          <Col xs={12} className="input-name">
            <input
              type="text"
              placeholder={t("Table.search")}
              value={searchForName}
              onChange={(e) => setSearchForName(e.target.value)}
              className="form-control"
            />
          </Col>

          <Col xs={12} sm={4} className="sort-selector">
            <h5>{t("Table.sort.by")}</h5>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(+e.target.value)}
              className="form-select"
            >
              <option value={SortType.CODE}>{t("Table_FoodResults.code")}</option>
              <option value={SortType.NAME}>{t("Table_FoodResults.name")}</option>
              <option value={SortType.SCIENTIFIC_NAME}>{t("Table_FoodResults.scientific_name")}</option>
            </select>
          </Col>

          <Col xs={12} sm={4} className="sort-selector">
            <h5>{t("Table.sort.order")}</h5>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(+e.target.value)}
              className="form-select"
            >
              <option value={SortOrder.ASC}>{t("Table.sort.ascending")}</option>
              <option value={SortOrder.DESC}>{t("Table.sort.descending")}</option>
            </select>
          </Col>

          <Col xs={12} sm={4}>
            <h5>{t("Table.results_per_page")}</h5>
            <select
              value={resultsPerPage}
              onChange={(e) => setResultsPerPage(+e.target.value)}
              className="form-select"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </Col>
        </Row>
      </div>

      {!Array.isArray(sortedData) || sortedData.length === 0 ? (
        <p>{t("Table.no_results")}</p>
      ) : (
        <>
          <table className="content-table-foods">
            <thead>
            <tr>
              <th>
                <div onClick={() => handleSortClick(SortType.CODE)}>
                  {selectedSort === SortType.CODE && (
                    sortOrder === SortOrder.ASC ? <ArrowUp height={24}/> : <ArrowDown height={24}/>
                  )}
                  {t("Table_FoodResults.code")}
                </div>
              </th>
              <th>
                <div onClick={() => handleSortClick(SortType.NAME)}>
                  {selectedSort === SortType.NAME && (
                    sortOrder === SortOrder.ASC ? <ArrowUp height={24}/> : <ArrowDown height={24}/>
                  )}
                  {t("Table_FoodResults.name")}
                </div>
              </th>
              <th>
                <div onClick={() => handleSortClick(SortType.SCIENTIFIC_NAME)}>
                  {selectedSort === SortType.SCIENTIFIC_NAME && (
                    sortOrder === SortOrder.ASC ? <ArrowUp height={24}/> : <ArrowDown height={24}/>
                  )}
                  {t("Table_FoodResults.scientific_name")}
                </div>
              </th>
              <th>
                {t("Table_FoodResults.action")}
              </th>
            </tr>
            </thead>
            <tbody>
            {records.map((item) => (
              <tr key={item.code}>
                <td data-label="Code">{item.code}</td>
                <td data-label="Nombre">{item.commonName[selectedLanguage] || "N/A"}</td>
                <td data-label="Nombre científico">
                  {(item.subspecies
                    ? `${item.scientificName} ${item.subspecies.toLowerCase()}`
                    : item.scientificName) || "N/A"}
                </td>
                <td>
                  <button
                    onClick={() => toFoodDetail(item.code)}
                    style={{ marginRight: state.isAuthenticated ? "10px" : "" }}
                  >
                    {t("Table_FoodResults.details")}
                  </button>
                  {state.isAuthenticated && (
                    <button
                      onClick={() => toModifyFoodDetail(item.code)}
                      style={{ backgroundColor: "#3b7791" }}
                    >
                      {t("Table_FoodResults.modify")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
          {npage > 1 && (
            <Pagination
              currentPage={currentPage}
              npage={npage}
              onPageChange={changePage}
            />
          )}
        </>
      )}
    </div>
  );
}
