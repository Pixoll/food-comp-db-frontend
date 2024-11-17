import React, { useState } from "react";
import CheckboxFilter from "./CheckboxFilter";
import { Collection } from "../../utils/collection";
import { Language, Region, TypeFood, Group } from "../../types/option";

interface SearchBoxProps {
  filterOptions: Collection<string, string>;
  //data: Array<Language | Region | TypeFood | Group>;
}

const SearchBox: React.FC<SearchBoxProps> = ({ filterOptions }) => {
  const [selectedOptions, setSelectedOptions] = useState(new Set<string>());
  console.log(selectedOptions)
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
