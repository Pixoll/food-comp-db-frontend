import Footer from "../../core/components/Footer";
import FoodFilter from "../../core/components/search/FoodFilter";
import "../../assets/css/_searchPage.css";

export default function SearchPage() {
  return (
    <div className="search-background">
      <FoodFilter/>
      <Footer/>
    </div>
  );
}
