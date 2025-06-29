"use client";

import { useTranslation } from "@/context/I18nContext";
import { Collection } from "@/utils/collection";
import { type JSX, useState } from "react";
import "@/app/search/components/SearchBox.css";

type SingleOptionFilterProps = {
    options: Collection<string, string>;
    selectedOption: string | null;
    setSelectedOption: (option: string | null) => void;
};

export default function SingleOptionFilter({
    options,
    selectedOption,
    setSelectedOption,
}: SingleOptionFilterProps): JSX.Element {
    const { t } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const handleOptionChange = (optionValue: string): void => {
        setSelectedOption(selectedOption === optionValue ? null : optionValue);
    };

    const filteredOptions = options.filter((_, label) =>
        label.toLowerCase().includes("".toLowerCase())
    );

    const getSelectedLabel = (): string => {
        if (!selectedOption) {
            return t.checkboxFilter.nothingSelected;
        }
        return options.get(selectedOption)!;
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
                                <span className="float-right text-[#81c784] text-xl">✔</span>
                            )}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
