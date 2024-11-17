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
    foodTypeFilter: new Set<string>(),
    regionsFilter: new Set<string>(),
    groupsFilter: new Set<string>(),
    languagesFilter: new Set<string>(),
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchForName, setSearchForName] = useState<string>("");

  const { collectionGroups: groups } = GetGroups();
  const { collectionRegions: regions } = GetRegions();
  const { collectionTypes: types } = GetTypes();
  const { collectionLanguages: languages } = GetLanguages();

  const handleSort = (order: "asc" | "desc") => {
    if (order === "asc" || order === "desc") {
      setSortOrder(order);
    }
  };
  

  const handleFilterChange = (filterKey: keyof typeof selectedFilters, values: string[]) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: new Set(values), // Actualiza el filtro correspondiente
    }));
  };

  const filters = {
    name: searchForName.toString(),
    type: Array.from(selectedFilters.foodTypeFilter),
    region: Array.from(selectedFilters.regionsFilter),
    group: Array.from(selectedFilters.groupsFilter),
    language: Array.from(selectedFilters.languagesFilter),
  };
  const queryString = qs.stringify(filters, { arrayFormat: "repeat", skipNulls: true });

  const resetFilters = () => {
    setSelectedFilters({
      foodTypeFilter: new Set<string>(),
      regionsFilter: new Set<string>(),
      groupsFilter: new Set<string>(),
      languagesFilter: new Set<string>(),
    });
    setSearchForName("");
    setSortOrder("asc");
  };
    

  const {data:FoodResulst} = useFetch<FoodResult[]>(`http://localhost:3000/api/v1/foods?${queryString}`)

  return (
    <div className="search-container">
      <div className="food-filter">
        <h2>Filtros</h2>

        <div className="filter-group">
          <label htmlFor="other">Tipo de alimento</label>
          <SearchBox filterOptions={types} onChange={(values) => handleFilterChange("foodTypeFilter", values)}/>
        </div>

        <div className="filter-group">
          <label htmlFor="other">Regiones de Chile</label>
          <SearchBox filterOptions={regions} onChange={(values) => handleFilterChange("regionsFilter", values)}/>
        </div>

        <div className="filter-group">
          <label htmlFor="other">Grupo alimentario</label>
          <SearchBox filterOptions={groups} onChange={(values) => handleFilterChange("groupsFilter", values)}/>
        </div>

        <div className="filter-group">
          <label htmlFor="other">Lenguajes</label>
          <SearchBox filterOptions={languages} onChange={(values) => handleFilterChange("languagesFilter", values)} />
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
