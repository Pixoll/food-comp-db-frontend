'use client'
import {useLocation} from "react-router-dom";
import FoodFilter from "./components/FoodFilter";
import Footer from "../../core/components/Footer";

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
