import { useState } from "react";
import SearchBox from "./SearchBox";
import "../../../assets/css/_foodFilter.css";
import { Collection } from "../../utils/collection";
import FoodResultsTable from "./FoodResultsTable";

const filterOptions = new Collection<string, string>([]);
for (let i = 0; i < 100; i++) {
  filterOptions.set(`animal${i}`, `Animal ${i}`);
}
const FoodFilter = () => {

  const [foodType, setFoodType] = useState<string>("");
  const [nutrients, setNutrients] = useState<string>("");
  const [other, setOther] = useState<string>("");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchForName, setSearchForName] = useState<string>("");

  
  const handleSort = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const resetFilters = () => {
    setFoodType("");
    setNutrients("");
    setOther("");
    setSearchForName("");
    setSortOrder("asc")
  };

  return (
    <div className="search-container">
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
      <FoodResultsTable 
        url={"xd"} 
        sortOrder={sortOrder} 
        handleSort={handleSort} 
        searchForName={searchForName}
        setSearchForName={setSearchForName}
      />
  </div>
  );
};
export default FoodFilter;
