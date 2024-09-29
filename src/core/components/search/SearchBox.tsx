import React, { useState } from "react";
import CheckboxFilter from "./CheckboxFilter";
import { Collection } from "../../utils/collection";

interface SearchBoxProps {
  filterOptions: Collection<string, string>;
}

const SearchBox: React.FC<SearchBoxProps> = ({ filterOptions }) => {
  const [selectedOptions, setSelectedOptions] = useState(new Set<string>());

  return (
    <div className="search-box">
      <CheckboxFilter
        options={filterOptions}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    </div>
  );
};

export default SearchBox;
