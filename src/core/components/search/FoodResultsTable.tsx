import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/_foodResultsTable.css";
import Pagination from "./Pagination"; // Importamos el nuevo componente de paginación

interface FoodResultsListProps {
  url: string;
}

const FoodResultsTable: React.FC<FoodResultsListProps> = ({ url }) => {
  const data = [];

  for (let i = 0; i < 100; i++) {
    data.push({ id: i, name: "Item" + i, nutrient: "nutrient" + i });
  }

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordsPerPage);

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
            <th>Nombre</th>
            <th>Nutriente</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item) => (
            <tr key={item.id} onClick={() => handleRowClick(item.id)}>
              <td data-label="ID">{item.id}</td>
              <td data-label="Nombre">{item.name}</td>
              <td data-label="Nombre">{item.nutrient}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} npage={npage} onPageChange={changePage} />
    </div>
  );
};

export default FoodResultsTable;

