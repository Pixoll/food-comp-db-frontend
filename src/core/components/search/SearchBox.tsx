import React, { useState } from "react";
import CheckboxFilter from "./CheckboxFilter";
import SingleOptionFilter from "./SingleOptionFilter";
import { Collection } from "../../utils/collection";

interface SearchBoxProps {
  filterOptions: Collection<string, string>;
  onChange: (selectedOptions: string[]) => void;
  single: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ filterOptions, onChange, single }) => {
  const [selectedOptions, setSelectedOptions] = useState(new Set<string>());
  const [selectedOption, setSelectedOption] = useState<string | null>(null); 

  const handleMultiSelectionChange = (newSelection: Set<string>) => {
    setSelectedOptions(newSelection);
    onChange(Array.from(newSelection));
  };

  const handleSingleSelectionChange = (newSelection: string | null) => {
    setSelectedOption(newSelection);
    onChange(newSelection ? [newSelection] : []); 
  };

  return (
    <div className="search-box">
      {!single ? (
        <CheckboxFilter
          options={filterOptions}
          selectedOptions={selectedOptions}
          setSelectedOptions={handleMultiSelectionChange}
        />
      ) : (
        <SingleOptionFilter
          options={filterOptions}
          selectedOption={selectedOption}
          setSelectedOption={handleSingleSelectionChange}
        />
      )}
    </div>
  );
};

export default SearchBox;
