"use client";

import { Collection } from "@/utils/collection";
import { type JSX, useEffect, useState } from "react";
import CheckboxFilter from "./CheckboxFilter";
import SingleOptionFilter from "./SingleOptionFilter";

type SearchBoxProps = {
    filterOptions: Collection<string, string>;
    onChange: (selectedOptions: string[]) => void;
    single: boolean;
    selectedOptions: string[];
};

export default function SearchBox({
    filterOptions,
    onChange,
    single,
    selectedOptions,
}: SearchBoxProps): JSX.Element {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        if (single && selectedOptions.length > 0) {
            setSelectedOption(selectedOptions[0]);
        } else if (selectedOptions.length === 0) {
            setSelectedOption(null);
        }
    }, [selectedOptions, single]);
    const handleMultiSelectionChange = (newSelection: Set<string>): void => {
        const newSelectionsArray = Array.from(newSelection);
        onChange(newSelectionsArray);
    };

    const handleSingleSelectionChange = (newSelection: string | null): void => {
        setSelectedOption(newSelection);
        onChange(newSelection ? [newSelection] : []);
    };

    return (
        <div className="relative" /*className="search-box"*/>
            {!single ? (
                <CheckboxFilter
                    options={filterOptions}
                    selectedOptions={new Set(selectedOptions)}
                    setSelectedOptions={handleMultiSelectionChange}
                />
            ) : (
                <SingleOptionFilter
                    options={filterOptions}
                    selectedOption={selectedOption}
                    setSelectedOption={handleSingleSelectionChange}
                />
            )}
        </div>
    );
}
