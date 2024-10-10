import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import "../../../assets/css/_foodResultsTable.css";
import { useAuth } from "../../context/AuthContext";
import { FoodResult } from "../../types/option";

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

  const toFoodDetail = (code: string) => {
    navigate(`/search/details/${code}`);
  };

  const toModfyFoodDetail = (code: string) => {
    if (state.isAuthenticated) {
      navigate(`/search/Modifydetails/${code}`);
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
      <h2>Lista de resultados</h2>
      <div className="filter-name">
        <div className="input-name">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchForName}
          onChange={(e) => setSearchForName(e.target.value)}
        />
        </div>
        <div className="translation-name">
        <h4>Nombre en:</h4>
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="language-selector"
        >
          <option value="en">Inglés</option>
          <option value="es">Español</option>
          <option value="pt">Portugués</option>
        </select>
        </div>
        <div className="order-by-name">
        <h4>Orden del nombre:</h4>
        <select
          value={sortOrder}
          onChange={(e) => handleOrderChange(e.target.value as "asc" | "desc")}
          className="sortOrder-selector"
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
        </div>
      </div>

      {!Array.isArray(data) || data.length === 0 ? (
        <p>No hay resultados que mostrar.</p>
      ) : (
        <>
          <table className="content-table-foods">
            <thead>
              <tr>
                <th style={{ fontSize: 22 }}>ID</th>
                <th style={{ fontSize: 22 }}>Nombre</th>

                <th style={{ fontSize: 22 }}>Tipo</th>
                <th style={{ fontSize: 22 }}>Acción</th>
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
                      Detalles
                    </button>
                    {state.isAuthenticated && (
                      <button onClick={() => toModfyFoodDetail(item.code)}>
                        Modificar
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
