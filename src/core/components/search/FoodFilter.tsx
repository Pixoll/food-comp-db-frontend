import React, { useState } from "react";
import SearchBox from "./SearchBox";
import "../../../assets/css/_foodFilter.css";
import { Collection } from "../../utils/collection";
import FoodResultsTable from "./FoodResultsTable";

const filterOptions = new Collection<string, string>([
  ["bear", "Bear"],
  ["ant", "Ant"],
  ["salamander", "Salamander"],
]);

const FoodFilter = () => {
  const [foodType, setFoodType] = useState<string>("");
  const [nutrients, setNutrients] = useState<string>("");
  const [other, setOther] = useState<string>("");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const resetFilters = () => {
    setFoodType("");
    setNutrients("");
    setOther("");
  };

  return (
    <div>
      <div className="food-filter">
        <h2>Filtros</h2>

        <div className="filter-group">
          <label htmlFor="other">Tipo de alimento</label>
          <SearchBox filterOptions={filterOptions} />
        </div>

        <div className="filter-group">
          <label htmlFor="other">Nutriente</label>
          <SearchBox filterOptions={filterOptions} />
        </div>

        <div className="filter-group">
          <label htmlFor="other">Otro...</label>
          <SearchBox filterOptions={filterOptions} />
        </div>

        <button onClick={resetFilters} className="reset-button">
          Reestablecer filtro
        </button>
      </div>
      <FoodResultsTable url={"xd"} sortOrder={sortOrder} handleSort={handleSort} />
  </div>
  );
};
export default FoodFilter;
