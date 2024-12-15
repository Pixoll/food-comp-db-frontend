import React, { useState } from "react";
import "../../../assets/css/_SelectorWithInput.css";
import { useTranslation } from "react-i18next";

type SelectorWithInputProps = {
  options: Array<{ id: number; name: string }>;
  placeholder: string;
  selectedValue: string | undefined;
  onSelect: (id: number | undefined, name: string) => void;
};

export default function SelectorWithInput({ options, placeholder, selectedValue, onSelect }: SelectorWithInputProps) {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customOption, setCustomOption] = useState("");
  const [isCustomOptionActive, setIsCustomOptionActive] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (option: { id: number; name: string }) => {
    setIsActive(false);
    setIsCustomOptionActive(false);
    setCustomOption("");
    onSelect(option.id, option.name);
  };

  const handleCustomOption = () => {
    setIsCustomOptionActive(true);
    setIsActive(false);
    onSelect(undefined, "");
  };

  const handleCustomOptionSubmit = () => {
    setIsActive(false);
    onSelect(undefined, customOption);
  };

  return (
    <div className={`select-box-for ${isActive ? "active" : ""}`}>
      <div className="select-option-with-input" onClick={() => setIsActive(!isActive)}>
        <input
          type="text"
          placeholder={placeholder}
          value={isCustomOptionActive ? customOption : selectedValue}
          readOnly
        />
      </div>
      {isActive && (
        <div className="content-box">
          <div className="search-options">
            <input
              type="text"
              placeholder={t("search.button")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="options">
            {filteredOptions.map((option) => (
              <li key={option.id} onClick={() => handleSelectOption(option)}>
                {option.name}
              </li>
            ))}
            <li
              onClick={handleCustomOption}
              style={{ fontStyle: "italic", color: "#555" }}
            >
              {"Otro valor"}
            </li>
          </ul>
        </div>
      )}
      {isCustomOptionActive && (
        <div className="custom-option-input">
          <input
            type="text"
            placeholder={"Escriba otro valor"}
            value={customOption}
            onChange={(e) => setCustomOption(e.target.value)}
            onBlur={handleCustomOptionSubmit}
          />
        </div>
      )}
    </div>
  );
}
