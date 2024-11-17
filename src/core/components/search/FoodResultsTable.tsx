import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import "../../../assets/css/_foodResultsTable.css";
import { useAuth } from "../../context/AuthContext";
import { FoodResult } from "../../types/option";

interface FoodResultsListProps {
  data: FoodResult[];
  sortOrder: "asc" | "desc";
  handleSort: () => void;
  searchForName: string;
  setSearchForName: (value: string) => void;
}

const FoodResultsTable: React.FC<FoodResultsListProps> = ({ data, sortOrder, handleSort,searchForName, setSearchForName}) => {

  
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordsPerPage);

  const navigate = useNavigate();
  const { state } = useAuth();
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

  return (
    <div className="food-list">
      <div className="search-for-name-and-tittle">
        <h2>Lista de resultados</h2>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value = {searchForName}
          onChange={(e)=>setSearchForName(e.target.value)}
        />
      </div>
      <table className="content-table-foods">
        <thead>
          <tr>
            <th style={{fontSize:22 }}>ID</th>
            <th onClick={handleSort} style={{ cursor: "pointer", fontSize: 22 }}>Nombre {sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th style={{fontSize:22 }}>Tipo</th>
            <th style={{fontSize:22 }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item) => (
            <tr key={item.id}>
              <td data-label="ID">{item.id}</td>
              <td data-label="Nombre">{item.commonName.en}</td>

              <td data-label="Nombre cientifico">{item.scientificName}</td>
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

      <Pagination currentPage={currentPage} npage={npage} onPageChange={changePage} />
    </div>
  );
};

export default FoodResultsTable;

