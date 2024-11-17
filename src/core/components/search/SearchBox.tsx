import React, { useState } from "react";
import CheckboxFilter from "./CheckboxFilter";
import { Collection } from "../../utils/collection";

interface SearchBoxProps {
  filterOptions: Collection<string, string>;
  onChange: (selectedOptions: string[]) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ filterOptions , onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState(new Set<string>());

  const handleSelectionChange = (newSelection: Set<string>) => {
    setSelectedOptions(newSelection);
    onChange(Array.from(newSelection)); 
  };
  return (
    <div className="search-box">
      <CheckboxFilter
        options={filterOptions}
        selectedOptions={selectedOptions}
        setSelectedOptions={handleSelectionChange}
      />
    </div>
  );
};

export default SearchBox;
