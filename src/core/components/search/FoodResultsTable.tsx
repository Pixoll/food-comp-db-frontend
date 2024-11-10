import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import "../../../assets/css/_foodResultsTable.css";
import { useAuth } from "../../context/AuthContext";

interface FoodResultsListProps {
  url: string;
  sortOrder: "asc" | "desc";
  handleSort: () => void;
  searchForName: string;
  setSearchForName: (value: string) => void;
}

const FoodResultsTable: React.FC<FoodResultsListProps> = ({ url, sortOrder, handleSort,searchForName, setSearchForName}) => {
  const data = [];

  for (let i = 0; i < 1000; i++) {
    data.push({ id: i, name: "Item" + i, nutrient: "nutrient" + i });

  }
  const sortedData = [...data].sort((a, b) => 
    sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
  
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = sortedData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(sortedData.length / recordsPerPage);

  const navigate = useNavigate();
  const { state } = useAuth();
  const toFoodDetail = (id: number) => {
    navigate(`/search/details/${id}`);
  };

  const toModfyFoodDetail = (id: number) => {
    if (state.isAuthenticated) {
      navigate(`/search/Modifydetails/${id}`);
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
            <th style={{fontSize:22 }}>Nutriente</th>
            <th style={{fontSize:22 }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item) => (
            <tr key={item.id}>
              <td data-label="ID">{item.id}</td>
              <td data-label="Nombre">{item.name}</td>
              <td data-label="Nutriente">{item.nutrient}</td>
              <td>
                <button onClick={() => toFoodDetail(item.id)}>
                  Detalles
                </button>
                {state.isAuthenticated && (
                  <button onClick={() => toModfyFoodDetail(item.id)}>
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

