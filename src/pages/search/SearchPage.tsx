import { useState } from "react";
import AppNavbar from "../../core/components/Navbar";
import SearchForName from "../../core/components/search/SearchForName";
import FoodFilter from "../../core/components/search/FoodFilter";
import FoodResultsTable from "../../core/components/search/FoodResultsTable";
import "../../assets/css/_searchPage.css"

  const SearchPage = () => {
    const [url, setUrl] = useState<string>("/api/foods"); // URL inicial
    return (
      <div className="search-page">
        <AppNavbar />
        <div className="search-container">
          <div className="filter-section">
            <SearchForName />
            <FoodFilter />
          </div>

          <div className="food-list">
            <h2>Tabla de alimentos</h2>
            <FoodResultsTable url={url} />
          </div>
        </div>
      </div>
    );
  };

  export default SearchPage;
