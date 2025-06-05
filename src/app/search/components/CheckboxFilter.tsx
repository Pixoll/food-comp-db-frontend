'use client'
import React, {useState} from "react";
import "@/assets/css/_searchBox.css";
import {Collection} from "@/utils/collection";

interface CheckboxFilterProps {
    options: Collection<string, string>;
    selectedOptions: Set<string>;
    setSelectedOptions: (options: Set<string>) => void;
}

export default function CheckboxFilter({options, selectedOptions, setSelectedOptions}: CheckboxFilterProps) {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const handleCheckboxChange = (optionValue: string) => {
        if (selectedOptions.has(optionValue)) {
            selectedOptions.delete(optionValue);
        } else {
            selectedOptions.add(optionValue);
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
        label.toLowerCase().includes("".toLowerCase())
    );

    const getSelectedLabel = () => {
        if (selectedOptions.size === 0) {
            return "Nada seleccionado";
        } else if (selectedOptions.size > 0 && selectedOptions.size < 3) {
            return [...selectedOptions
                .values()]
                .reduce((text, opt) => text ? text + ", " + options.get(opt) : options.get(opt)!, "");
        } else {
            return `${selectedOptions.size} Items`;
        }
    };

    return (<>
            <div
                className="flex justify-between items-center rounded-[8px] bg-[#4e9f6f] text-[white] p-[12px]
                border-[2px] border-solid border-[#388e60] cursor-pointer transition-all duration-300 ease-in-out
                hover:bg-[#388e60] hover:border-[#2c6b49]"
                //className="selected-options-display"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {getSelectedLabel()}
                <span className="text-[14px]">{dropdownOpen ? "▲" : "▼"}</span>
            </div>

            {dropdownOpen && (
                <div className="w-full absolute p-[12px] left-[0px] right-[0px] max-h-[250px] overflow-y-auto shadow-[6px_12px_rgba(0,0,0,0.1) bg-[white]
                    border-[px] border-solid border-[#d6f4e9] z-[20] rounded-[6px] transition-all
                    duration-300 ease-in-out md:max-w-[250px] mt-[4px]"
                    //className="dropdown-options"
                >

                    <label className="block p-[12px] bg-[#f7f7f7] cursor-pointer mb-[10px] rounded-[10xp]
                        transition-colors duration-300 ease-in-out hover:bg-[#e0e0e0] md:text-base"
                        //className="select-all-label"
                    >
                        <div className="flex justify-between items-center">
                            <span>Seleccionar todos</span>
                            <input
                                type="checkbox"
                                checked={selectedOptions.size === options.size}
                                onChange={handleSelectAll}
                                className="hidden"
                            />
                            {selectedOptions.size === options.size && (
                                <span className="text-[#81c784] text-[20px]">✔</span>
                            )}
                        </div>
                    </label>

                    {filteredOptions.map((label, option) => (
                        <label
                            className="block p-[12px] bg-[#f7f7f7] cursor-pointer mb-[10px] rounded-[6px]
                                transition-colors duration-300 ease-in-out hover:bg-[#e0e0e0] md:text-base"
                            key={option}>
                            <div className="flex justify-between items-center">
                                <span>{label}</span>
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={selectedOptions.has(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                    className="hidden"
                                />
                                {selectedOptions.has(option) && (
                                    <span className="text-[#81c784] text-[20px]">✔</span>
                                )}
                            </div>
                        </label>
                    ))}
                </div>
            )}
        </>
    );
}
