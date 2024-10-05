import SearchForName from "./SearchForName";
import OrderBy from "./OrderBy";
import "../../../assets/css/_orderByAndSearch.css"
const OrderByAndSearch = () =>{
    return(
        <div className="search-and-orderBy">
            <SearchForName />
            <OrderBy />
        </div>
    )
}

export default OrderByAndSearch;