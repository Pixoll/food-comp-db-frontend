import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/_foodResultsTable.css"
interface FoodResultsListProps {
  url: string;
}

const FoodResultsTable: React.FC<FoodResultsListProps> = ({ url }) => {
  const data = [];

for (let i = 0; i < 50; i++) {
  data.push({ id: i, name: 'Item' + i , nutrient: 'nutrient'+ i});   
}

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const navigate = useNavigate();

  const handleRowClick = (id: number) => {
    navigate(`/search/details/${id}`); 
  };

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changePage = (n: number) => {
    setCurrentPage(n);
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
      <nav>
        <ul className="pagination-table">
          <li className="page-item-table">
            <a href="#" className="page-link" onClick={prePage}>
              Prev
            </a>
          </li>
          {numbers.map((n, i) => (
            <li
              className={`page-item-table ${currentPage === n ? "active" : ""}`}
              key={i}
            >
              <a
                href="#"
                className="page-link"
                onClick={() => changePage(n)}
              >
                {n}
              </a>
            </li>
          ))}
          <li className="page-item-table">
            <a href="#" className="page-link" onClick={nextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default FoodResultsTable;