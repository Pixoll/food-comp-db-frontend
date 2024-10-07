import { useState } from "react";
import AppNavbar from "../../core/components/Navbar";
import FoodFilter from "../../core/components/search/FoodFilter";
import FoodResultsTable from "../../core/components/search/FoodResultsTable";
import OrderByAndSearch from "../../core/components/search/OrderByAndSearch";
import "../../assets/css/_searchPage.css"

  const SearchPage = () => {
    const [url, setUrl] = useState<string>("/api/foods"); 
    return (
      <div className="search-page">
        <AppNavbar />
        <div className="search-container">
          <div className="filter-section">
            <OrderByAndSearch />
            <FoodFilter />
          </div>
            <FoodResultsTable url={url} />
          </div>
      </div>
    );
  };

  export default SearchPage;
