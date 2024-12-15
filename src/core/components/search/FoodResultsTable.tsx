import { ChangeEvent, useEffect, useState } from "react";
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

export default function FoodResultsTable({ data, searchForName, setSearchForName }: FoodResultsListProps) {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es" | "pt">(
    "en"
  );
  const [sortedData, setSortedData] = useState<FoodResult[]>([]);

  const recordsPerPage = 7;
  const npage = Array.isArray(sortedData) ? Math.ceil(sortedData.length / recordsPerPage) : 0;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = Array.isArray(sortedData) ? sortedData.slice(firstIndex, lastIndex) : [];
  const { t } = useTranslation();

  const toFoodDetail = (code: string) => {
    navigate(`/search/details/${code}`);
  };

  const toModfyFoodDetail = (code: string) => {
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

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as "en" | "es" | "pt");
  };

  useEffect(() => {
    // Filtrar los datos según el idioma y el nombre de búsqueda
    const filteredData = data.filter((item) =>
      item.commonName[selectedLanguage]?.toLowerCase().includes(searchForName.toLowerCase())
    );

    // Ordenar los datos filtrados
    const sorted = [...filteredData].sort((a, b) => {
      const nameA = a.commonName[selectedLanguage]?.toLowerCase() || "";
      const nameB = b.commonName[selectedLanguage]?.toLowerCase() || "";

      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    // Establecer los datos ordenados en el estado
    setSortedData(sorted);
  }, [data, selectedLanguage, sortOrder, searchForName]);

  return (
    <div className="food-list">
      <h2>{t('Table.title')}</h2>
      <div className="filter-name">
        <div className="input-name">
          <input
            type="text"
            placeholder={t('Table.search')}
            value={searchForName}
            onChange={(e) => setSearchForName(e.target.value)}
          />
        </div>
        <div className="translation-name">
          <h4>{t('Table.name.title')}</h4>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="language-selector"
          >
            <option value="en">{t('Table.name.English')}</option>
            <option value="es">{t('Table.name.Spanish')}</option>
            <option value="pt">{t('Table.name.Portuguese')}</option>
          </select>
        </div>
        <div className="order-by-name">
          <h4>{t('Table.order.title')}</h4>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="sortOrder-selector"
          >
            <option value="asc">{t('Table.order.ascending')}</option>
            <option value="desc">{t('Table.order.descending')}</option>
          </select>
        </div>
      </div>

      {!Array.isArray(sortedData) || sortedData.length === 0 ? (
        <p>{t('Table.no_results')}</p>
      ) : (
        <>
          <table className="content-table-foods">
            <thead>
            <tr>
              <th style={{ fontSize: 22 }}>{t('Table_FoodResults.id')}</th>
              <th style={{ fontSize: 22 }}>{t('Table_FoodResults.name')}</th>
              <th style={{ fontSize: 22 }}>{t('Table_FoodResults.scientific_name')}</th>
              <th style={{ fontSize: 22 }}>{t('Table_FoodResults.action')}</th>
            </tr>
            </thead>
            <tbody>
            {records.map((item) => (
              <tr key={item.id}>
                <td data-label="ID">{item.id}</td>
                <td data-label="Nombre">
                  {item.commonName[selectedLanguage] || "N/A"}
                </td>
                <td data-label="Nombre científico">{item.scientificName}</td>
                <td>
                  <button onClick={() => toFoodDetail(item.code)}>
                    {t('Table_FoodResults.details')}
                  </button>
                  {state.isAuthenticated && (
                    <button onClick={() => toModfyFoodDetail(item.code)}>
                      {t('Table_FoodResults.modify')}
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
