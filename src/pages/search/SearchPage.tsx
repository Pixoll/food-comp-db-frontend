import { useState } from "react";
import AppNavbar from "../../core/components/Navbar";
import FoodFilter from "../../core/components/search/FoodFilter";
import "../../assets/css/_searchPage.css"

  const SearchPage = () => {
    const [url, setUrl] = useState<string>("/api/foods"); 
    return (
      <div className="search-background">
        <AppNavbar />
        <FoodFilter />
      </div>
    );
  };

  export default SearchPage;
