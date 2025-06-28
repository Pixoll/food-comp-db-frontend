"use client";

import { ChevronDownIcon } from "lucide-react";
import { type MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";

type Option = {
    id: number;
    name: string;
};

type SelectorProps = {
    options: Option[];
    placeholder: string;
    selectedValue: string;
    onSelect: (id: number | null, name: string) => void;
};

export default function Selector({
    options,
    placeholder,
    selectedValue,
    onSelect,
}: SelectorProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownWidth, setDropdownWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            setDropdownWidth(buttonRect.width);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleToggleDropdown = (): void => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setSearchTerm("");
        }
    };

    const handleSelectOption = (option: Option): void => {
        onSelect(option.id, option.name);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleClear = (e: ReactMouseEvent): void => {
        e.stopPropagation();
        onSelect(null, "");
        setSearchTerm("");
    };

    return (
        <div ref={containerRef} className="w-full h-full">
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggleDropdown}
                className="
                flex
                items-center
                justify-between
                w-full
                px-[12px]
                py-[8px]
                text-[14px]
                bg-[white]
                border-[1px]
                rounded-[6px]
                shadow-sm
                hover:bg-[#f9fafb]
                focus:outline-none
                focus:ring-2
                focus:ring-[#53bb63]
                focus:border-[#53bb63]
                "
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={`block truncate pr-[6px] ${!selectedValue ? "text-[#9ca3af]" : "text-[#4b5563]"}`}>
                    {selectedValue || placeholder}
                </span>
                <div className="flex items-center">
                    {selectedValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-[4px] mr-[4px] text-[#9ca3af] hover:text-[#4b5563]"
                            aria-label="Clear selection"
                        >
                            ×
                        </button>
                    )}
                    <ChevronDownIcon className="w-[16px] h-[16px] text-[#9ca3af]" aria-hidden="true"/>
                </div>
            </button>

            {isOpen && (
                <div
                    className="
                    fixed
                    z-[50]
                    bg-[white]
                    border
                    border-[#d1d5db]
                    rounded-[6px]
                    shadow-lg
                    overflow-auto
                    max-h-[240px]
                    box-content
                    "
                    style={{
                        width: `${dropdownWidth - 2}px`,
                        top: (buttonRef.current?.getBoundingClientRect().bottom || 0) + 2 + "px",
                        left: buttonRef.current?.getBoundingClientRect().left + "px",
                    }}
                >
                    <div className="sticky top-[0px] z-[10] bg-[white] border-[1px] border-[#e5e7eb]">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="
                            w-full
                            px-[12px]
                            py-[8px]
                            text-[14p]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#53bb63]
                            "
                            placeholder="Buscar..."
                        />
                    </div>

                    {filteredOptions.length > 0 ? (
                        <ul
                            className="pl-[8px] overflow-auto text-[16px] max-h-[224px] list-none"
                        >
                            {filteredOptions.map((option) => (
                                <li
                                    key={option.id}
                                    className={`
                                    cursor-pointer
                                    select-none
                                    relative
                                    py-[8px]
                                    pl-[0px]
                                    hover:bg-[#dff2d2]
                                    hover:rounded-[3px]
                                    ${selectedValue === option.name ? "bg-blue-100" : ""}
                                    `}
                                    role="option"
                                    aria-selected={selectedValue === option.name}
                                    onClick={() => handleSelectOption(option)}
                                    data-value={option.id}
                                >
                                    <span className="block truncate font-[400]">
                                        {option.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-[12px] py-[8px] text-[14px] text-[#a1ada4]">No hay resultados</div>
                    )}
                </div>
            )}
        </div>
    );
}
