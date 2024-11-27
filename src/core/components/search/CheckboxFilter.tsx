import React, { useState } from "react";
import "../../../assets/css/_searchBox.css";
import { Collection } from "../../utils/collection";

interface CheckboxFilterProps {
  options: Collection<string, string>;
  selectedOptions: Set<string>;
  setSelectedOptions: (options: Set<string>) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleCheckboxChange = (optionValue: string) => {
    if (selectedOptions.has(optionValue)) {
      selectedOptions.delete(optionValue)
    } else {
      selectedOptions.add(optionValue)
    }
    setSelectedOptions(new Set(selectedOptions));
  };

  const handleSelectAll = () => {
    if (selectedOptions.size === options.size) {
      setSelectedOptions(new Set());
    } else {
      setSelectedOptions(new Set(options.keys()));
    }
  };

  const filteredOptions = options.filter((_, label) =>
    label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedLabel = () => {
    if (selectedOptions.size === 0) {
      return "Nada seleccionado";
    } else if (selectedOptions.size > 0 && selectedOptions.size < 3) {
      return [...selectedOptions
        .values()]
        .reduce((text, opt) => text ? text + ", " + options.get(opt) : options.get(opt)!, "")
    } else {
      return `${selectedOptions.size} Items`;
    }
  };

  return (
    <div className={`checkbox-filter ${dropdownOpen ? "show" : ""}`}>
      <div
        className="selected-options-display"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {getSelectedLabel()}
        <span>▼</span>
      </div>
      {dropdownOpen && (
        <div className="dropdown-options">
            <label className="select-all-label">
              <input
                type="checkbox"
                checked={selectedOptions.size === options.size}
                readOnly
                onChange={handleSelectAll}
              />
              Seleccionar todos
              {selectedOptions.size === options.size && (
                <span className="checked">✔</span>
              )}
            </label>

          {filteredOptions.map((label, option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.has(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {label}
              {selectedOptions.has(option) && (
                <span className="checked">✔</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
export default CheckboxFilter;
