'use client'
import React, { useState } from "react";
import "../../../assets/css/_SelectorWithInput.css";
import { useTranslation } from "react-i18next";

type SelectorWithInputProps = {
  options: Array<{ id: number; name: string }>;
  placeholder: string;
  selectedValue: string | undefined;
  onSelect: (id: number | undefined, name: string) => void;
  onCustomOpen?: () => void;
  newValueMaxLength?: number;
};

export default function SelectorWithInput({
  options,
  placeholder,
  selectedValue,
  onSelect,
  onCustomOpen,
  newValueMaxLength,
}: SelectorWithInputProps) {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customOption, setCustomOption] = useState("");
  const [isCustomOptionActive, setIsCustomOptionActive] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (option: { id: number; name: string }) => {
    if (selectedValue === option.name) {
      onSelect(undefined, ""); 
    } else {
      onSelect(option.id, option.name);
    }
    setIsActive(false);
    setIsCustomOptionActive(false); 
    setCustomOption(""); 
  };

  const handleCustomOption = () => {
    setIsCustomOptionActive(true);
    setIsActive(false);
    onSelect(undefined, "");
    onCustomOpen?.();
  };

  const handleCustomOptionSubmit = () => {
    setIsActive(false); 
    onSelect(undefined, customOption); 
  };

  return (
    <div className={`select-box-for ${isActive ? "active" : ""}`}>
      <div
        className="select-option-with-input"
        onClick={() => setIsActive((prev) => !prev)}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={isCustomOptionActive ? customOption : selectedValue || ""}
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
              <li
                key={option.id}
                className={selectedValue === option.name ? "selected" : ""}
                onClick={() => handleSelectOption(option)}
              >
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
            maxLength={newValueMaxLength}
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
