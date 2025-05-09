import { useLocation } from "react-router-dom";
import Footer from "../../core/components/Footer";
import FoodFilter from "../../core/components/search/FoodFilter";
import "../../assets/css/_searchPage.css";

export default function SearchPage() {
  const location = useLocation();
  const foodName = location.state?.foodName || "";
  return (
    <div className="search-background">
      <FoodFilter foodName={foodName ?? ""}/>
      <Footer/>
    </div>
  );
}
