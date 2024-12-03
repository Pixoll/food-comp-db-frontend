import React, { useState } from "react";
import "../../../assets/css/_OriginSelector.css";
import { useTranslation } from "react-i18next";

type OriginsSelectorProps = {
  options: Array<{ id: number; name: string }>;
  placeholder: string;
  selectedValue: string; // Recibirá el valor seleccionado desde el padre
  onSelect: (id: number | null, name: string) => void; // Enviará el valor seleccionado al padre
};

const OriginSelector: React.FC<OriginsSelectorProps> = ({
  options,
  placeholder,
  selectedValue,
  onSelect,
}) => {
  const { t } = useTranslation("global");
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (option: { id: number; name: string }) => {
    setIsActive(false); 
    if (selectedValue === option.name) {
      onSelect(null, ""); 
    } else {
      onSelect(option.id, option.name); 
    }
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
              placeholder={t("search.button")}
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
