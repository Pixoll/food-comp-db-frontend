import React, {useState} from "react";
import "../../../assets/css/_searchBox.css";
import {Collection} from "../../utils/collection";

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

    return (
        <div className={`w-full relative font-poppins ${dropdownOpen ? "block" : ""}`}>
            <div
                className="
                flex
                justify-between
                items-center
                rounded-[8px]
                bg-[#4e9f6f]
                text-white
                p-3
                border-2
                border-solid
                border-[#388e60]
                cursor-pointer
                transition-all
                duration-300
                ease-in-out
                hover:bg-[#388e60]
                hover:border-[#2c6b49]
                md:text-base
                "
                //className="selected-options-display"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {getSelectedLabel()}
                <span>▼</span>
            </div>
            {dropdownOpen && (
                <div
                    className="
                    absolute
                    w-full
                    block
                    max-w-64
                    overflow-y-auto
                    shadow-lg
                    bg-white
                    border-2
                    border-solid
                    border-[#d6f4e9]
                    z-10
                    p-3
                    rounded-md
                    transition-colors
                    duration-300
                    ease-in-out
                    md:w-max-[250px]
                    "
                    //className="dropdown-options"
                >
                    <label
                        className="
                        block
                        p-3
                        bg-[#f7f7f7]
                        cursor-pointer
                        mb-2.5
                        rounded-[5px]
                        transition-colors
                        duration-300
                        ease-in-out
                        hover:bg-[#e0e0e0]
                        md:text-base
                        [&>input[type=checkbox]]:hidden
                        "
                        //className="select-all-label"
                    >
                        <input
                            type="checkbox"
                            checked={selectedOptions.size === options.size}
                            readOnly
                            onChange={handleSelectAll}
                        />
                        Seleccionar todos
                        {selectedOptions.size === options.size && (
                            <span className="float-right text-[#81c784] text-xl" /*className="checked"*/>✔</span>
                        )}
                    </label>

                    {filteredOptions.map((label, option) => (
                        <label
                            className="
                            block
                            p-3
                            bg-[#f7f7f7]
                            cursor-pointer
                            mb-2.5
                            rounded-[5px]
                            transition-colors
                            duration-300
                            ease-in-out
                            hover:bg-[#e0e0e0]
                            md:text-base
                            [&>input[type=checkbox]]:hidden
                            "
                            key={option}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={selectedOptions.has(option)}
                                onChange={() => handleCheckboxChange(option)}
                            />
                            {label}
                            {selectedOptions.has(option) && (
                                <span className="float-right text-[#81c784] text-xl" /*className="checked"*/>✔</span>
                            )}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
