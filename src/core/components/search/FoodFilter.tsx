import { useState } from "react";
import SearchBox from "./SearchBox";
import "../../../assets/css/_foodFilter.css";
import FoodResultsTable from "./FoodResultsTable";
import GetGroups from "./gets/GetGroups";
import GetLanguages from "./gets/GetLanguages";
import GetRegions from "./gets/GetRegions";
import GetTypes from "./gets/getTypes";
import { FoodResult } from "../../types/option";
import useFetch from "../../hooks/useFetch";
import qs from "qs";

const FoodFilter = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    foodTypeFilter: [],
    regionsFilter: [],
    groupsFilter: [],
    languagesFilter: [],
  });
  

  const {data:FoodResulst} = useFetch<FoodResult[]>("http://localhost:3000/api/v1/foods")
  console.log(FoodResulst)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchForName, setSearchForName] = useState<string>("");

  const { collectionGroups: groups } = GetGroups();
  const { collectionRegions: regions } = GetRegions();
  const { collectionTypes: types } = GetTypes();
  const { collectionLanguages: languages } = GetLanguages();

  const handleSort = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const resetFilters = () => {
    setSelectedFilters({
      foodTypeFilter: [],
      regionsFilter: [],
      groupsFilter: [],
      languagesFilter: [],
    });
    setSearchForName("");
    setSortOrder("asc");
  };

  return (
    <div className="search-container">
      <div className="food-filter">
        <h2>Filtros</h2>

        <div className="filter-group">
          <label htmlFor="other">Tipo de alimento</label>
          <SearchBox filterOptions={types} />
        </div>

        <div className="filter-group">
          <label htmlFor="other">Regiones de Chile</label>
          <SearchBox filterOptions={regions} />
        </div>

        <div className="filter-group">
          <label htmlFor="other">Grupo alimentario</label>
          <SearchBox filterOptions={groups} />
        </div>

        <div className="filter-group">
          <label htmlFor="other">Lenguajes</label>
          <SearchBox filterOptions={languages} />
        </div>

        <button onClick={resetFilters} className="reset-button">
          Reestablecer filtro
        </button>
      </div>
      <FoodResultsTable
        data = {FoodResulst ?? []}
        sortOrder={sortOrder}
        handleSort={handleSort}
        searchForName={searchForName}
        setSearchForName={setSearchForName}
      />
    </div>
  );
};
export default FoodFilter;
