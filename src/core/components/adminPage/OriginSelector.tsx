import React, { useState } from "react";
import "../../../assets/css/_OriginSelector.css"
type OriginsSelectorProps = {
    options: Array<{ id: number; name: string }>;
    placeholder: string;
    onSelect: (id: number) => void;
};
const OriginSelector: React.FC<OriginsSelectorProps> = ({
    options,
    placeholder,
    onSelect,
  }) => {
    const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (option: { id: number; name: string }) => {
    setSelectedValue(option.name);
    setIsActive(false);
    onSelect(option.id); 
  };

  return (
    <div className={`select-box-for-origin ${isActive ? "active" : ""}`}>
      <div className="select-option" onClick={() => setIsActive(!isActive)}>
        <input
          type="text"
          placeholder={placeholder}
          value={selectedValue}
          readOnly
        />
      </div>
      {isActive && (
        <div className="origins-content">
          <div className="search-origin">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="originsOptions">
            {filteredOptions.map((option) => (
              <li key={option.id} onClick={() => handleSelectOption(option)}>
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OriginSelector;