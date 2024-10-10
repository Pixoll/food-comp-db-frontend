import FoodFilter from "../../core/components/search/FoodFilter";
import Footer from "../../core/components/Footer";
import "../../assets/css/_searchPage.css"

  const SearchPage = () => { 
    return (
      <div className="search-background">
        <FoodFilter />
        <Footer/>
      </div>
    );
  };

  export default SearchPage;
