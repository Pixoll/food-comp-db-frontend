import React, { useState } from "react";
import "../../../assets/css/_search.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const SearchForName = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    return(
        <div className="search-for-name">
            <input 
                className="input-for-name"
                type="text"
                placeholder="Enter name"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="button-for-search">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div>
    )
};
export default SearchForName;