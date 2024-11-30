import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import "../../../assets/css/_foodResultsTable.css";
import { useAuth } from "../../context/AuthContext";
import { FoodResult } from "../../types/option";
import { useTranslation } from "react-i18next";

interface FoodResultsListProps {
  data: FoodResult[];
  sortOrder: "asc" | "desc";
  handleSort: (order: "asc" | "desc") => void;
  searchForName: string;
  setSearchForName: (value: string) => void;
}

const FoodResultsTable: React.FC<FoodResultsListProps> = ({
  data,
  sortOrder,
  handleSort,
  searchForName,
  setSearchForName,
}) => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es" | "pt">(
    "en"
  );

  const recordsPerPage = 5;
  const npage = Array.isArray(data)
    ? Math.ceil(data.length / recordsPerPage)
    : 0;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = Array.isArray(data) ? data.slice(firstIndex, lastIndex) : [];
  const {t} = useTranslation("global");
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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as "en" | "es" | "pt");
  };

  const handleOrderChange = (order: "asc" | "desc") => {
    handleSort(order);
  };

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
          onChange={(e) => handleOrderChange(e.target.value as "asc" | "desc")}
          className="sortOrder-selector"
        >
          <option value="asc">{t('Table.order.ascending')}</option>
          <option value="desc">{t('Table.order.descending')}</option>
        </select>
        </div>
      </div>

      {!Array.isArray(data) || data.length === 0 ? (
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
};

export default FoodResultsTable;
