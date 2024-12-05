import React, { useState, useEffect } from "react";
import CheckboxFilter from "./CheckboxFilter";
import SingleOptionFilter from "./SingleOptionFilter";
import { Collection } from "../../utils/collection";

interface SearchBoxProps {
  filterOptions: Collection<string, string>;
  onChange: (selectedOptions: string[]) => void;
  single: boolean;
  selectedOptions: string[]; 
}

const SearchBox: React.FC<SearchBoxProps> = ({ filterOptions, onChange, single, selectedOptions, }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (single && selectedOptions.length > 0) {
      setSelectedOption(selectedOptions[0]);
    } else if (selectedOptions.length === 0) {
      setSelectedOption(null);
    }
  }, [selectedOptions, single]);

  const handleMultiSelectionChange = (newSelection: Set<string>) => {
    const newSelectionsArray = Array.from(newSelection);
    onChange(newSelectionsArray);
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
          selectedOptions={new Set(selectedOptions)}
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
