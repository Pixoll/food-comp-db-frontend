import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/_foodResultsTable.css"
interface FoodResultsListProps {
  url: string;
}

const FoodResultsTable: React.FC<FoodResultsListProps> = ({ url }) => {
  const navigate = useNavigate();

  const data = [
    { id: 1, name: "Item1" },
    { id: 2, name: "Item2" },
    { id: 3, name: "Item3" },
    { id: 4, name: "Item4" },
  ];

  const handleRowClick = (id: number) => {
    navigate('/search/details/${id}');
  };

  return (
    <table className="content-table-foods">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} onClick={() => handleRowClick(item.id)}>
            <td data-label="ID">{item.id}</td>
            <td data-label="Nombre">{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FoodResultsTable;