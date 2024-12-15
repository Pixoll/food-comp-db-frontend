import React, { useState } from "react";
import "../../../assets/css/_searchBox.css";
import { Collection } from "../../utils/collection";

interface SingleOptionFilterProps {
  options: Collection<string, string>;
  selectedOption: string | null;
  setSelectedOption: (option: string | null) => void;
}

export default function SingleOptionFilter({ options, selectedOption, setSelectedOption }: SingleOptionFilterProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleOptionChange = (optionValue: string) => {
    setSelectedOption(selectedOption === optionValue ? null : optionValue);
  };

  const filteredOptions = options.filter((_, label) =>
    label.toLowerCase().includes("".toLowerCase())
  );

  const getSelectedLabel = () => {
    if (!selectedOption) {
      return "Nada seleccionado";
    }
    return options.get(selectedOption) ?? "Opción desconocida";
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
          {filteredOptions.map((label, option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
              />
              {label}
              {selectedOption === option && (
                <span className="checked">✔</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
