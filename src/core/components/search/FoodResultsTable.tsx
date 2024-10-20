import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/_foodResultsTable.css";
import Pagination from "./Pagination";

interface FoodResultsListProps {
  url: string;
  sortOrder: "asc" | "desc";
  handleSort: () => void;
}

const FoodResultsTable: React.FC<FoodResultsListProps> = ({ url, sortOrder, handleSort}) => {
  const data = [];

  for (let i = 0; i < 100; i++) {
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

  const handleRowClick = (id: number) => {
    navigate(`/search/details/${id}`);
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= npage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="food-list">
      <table className="content-table-foods">
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={handleSort} style={{ cursor: "pointer" }}>Nombre {sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th>Nutriente</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item) => (
            <tr key={item.id}>
              <td data-label="ID">{item.id}</td>
              <td data-label="Nombre">{item.name}</td>
              <td data-label="Nutriente">{item.nutrient}</td>
              <td>
                <button onClick={() => handleRowClick(item.id)}>
                  Detalles
                </button>
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

