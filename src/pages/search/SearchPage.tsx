import AppNavbar from "../../core/components/Navbar";
import SearchForName from "../../core/components/search/SearchForName";
import FoodFilter from "../../core/components/search/FoodFilter";
import "../../assets/css/_searchPage.css"

  const SearchPage = () => {
    return (
      <div className="search-page">
        <AppNavbar />
        <div className="search-container">
          <div className="filter-section">
            <SearchForName />
            <FoodFilter />
          </div>
  
          <div className="food-list">
            <h2>Lista de alimentos</h2>
          </div>
        </div>
      </div>
    );
  };
  
  export default SearchPage;
