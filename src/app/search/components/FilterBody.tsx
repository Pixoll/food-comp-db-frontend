import NumericField from "@/app/components/Fields/NumericField";
import { useTranslation } from "@/context/I18nContext";
import { useGroups, useNutrients, useOrigins, useTypes } from "@/hooks";
import { Collection } from "@/utils/collection";
import { PlusCircle, XCircle } from "lucide-react";
import type { JSX } from "react";
import SearchBox from "./SearchBox";

export type Filters = {
    foodTypeFilter: Set<string>;
    regionsFilter: Set<string>;
    groupsFilter: Set<string>;
    nutrientsFilter: NutrientFilter[];
};

type NutrientFilter = {
    id: number;
    op: string;
    value?: number;
};

type FilterBodyProps = {
    selectedFilters: Filters;
    setSelectedFilters: (value: Filters | ((value: Filters) => Filters)) => void;
    resetFilters: () => void;
};

export default function FilterBody({
    selectedFilters,
    setSelectedFilters,
    resetFilters,
}: FilterBodyProps): JSX.Element {
    const { t } = useTranslation();
    const groups = useGroups().idToName;
    const types = useTypes().idToName;
    const { nutrients } = useNutrients();
    const { regions } = useOrigins();
    const regionOptions = new Collection<string, string>(
        Array.from(regions.values()).map((region) => [region.id.toString(), region.name])
    );

    const getAvailableNutrients = (array: NutrientFilter[]): typeof nutrients => {
        const values = new Set(array.map(n => n.id));
        return nutrients.filter(n => !values.has(n.id));
    };

    const handleFilterChange = (
        filterKey: keyof typeof selectedFilters,
        values: string[]
    ): void => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: new Set(values),
        }));
    };

    const handleNutrientFilterChange = <K extends keyof NutrientFilter>(
        key: K,
        value: NutrientFilter[K],
        index: number
    ): void => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            nutrientsFilter: selectedFilters.nutrientsFilter.map((nutrient, i) =>
                i === index ? { ...nutrient, [key]: value } : nutrient
            ),
        }));
    };

    const handleAddNutrientFilter = (): void => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            nutrientsFilter: [...prevFilters.nutrientsFilter, {
                id: 0,
                op: "=",
            }],
        }));
    };

    const handleRemoveLastNutrientFilter = (): void => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            nutrientsFilter: [...prevFilters.nutrientsFilter.slice(0, -1)],
        }));
    };

    return <>
        {/* Filter Sections */}
        <div className="mb-[16px]"/*className="filter-group"*/>
            <label htmlFor="other">{t.foodsFilter.type}</label>
            <SearchBox
                filterOptions={types}
                onChange={(values) => handleFilterChange("foodTypeFilter", values)}
                single={false}
                selectedOptions={Array.from(selectedFilters.foodTypeFilter)}
            />
        </div>

        <div className="mb-[16px]">
            <label htmlFor="other">{t.foodsFilter.regions}</label>
            <SearchBox
                filterOptions={regionOptions}
                onChange={(values) => handleFilterChange("regionsFilter", values)}
                single={false}
                selectedOptions={Array.from(selectedFilters.regionsFilter)}
            />
        </div>

        <div className="mb-[16px]">
            <label htmlFor="other">{t.foodsFilter.group}</label>
            <SearchBox
                filterOptions={groups}
                onChange={(values) => handleFilterChange("groupsFilter", values)}
                single={false}
                selectedOptions={Array.from(selectedFilters.groupsFilter)}
            />
        </div>

        {/* Measurement Section */}
        <div className="flex flex-col w-full bg-[#ffffff] rounded-[8px] p-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <h3 className="text-[18px] font-[600] text-[#333333] mb-[16px]">{t.foodsFilter.nutrients.title}</h3>

            {selectedFilters.nutrientsFilter.map((nutrient, index, array) => (
                <div key={index} className="flex flex-col w-full mb-[20px]">
                    {selectedFilters.nutrientsFilter.length > 1 && index > 0 && (
                        <div className="w-full mb-[16px]">
                            <span className="block w-full h-[1px] bg-[#e0e0e0]"></span>
                        </div>
                    )}

                    <div className="w-full mb-[16px]">
                        <div className="relative">
                            <select
                                id={`nutrient-select-${index}`}
                                aria-label={t.foodsFilter.nutrients.select}
                                value={nutrient.id || ""}
                                onChange={(e) => {
                                    const id = +e.target.value;
                                    if (Number.isSafeInteger(id)) {
                                        handleNutrientFilterChange("id", id, index);
                                    }
                                }}
                                className="
                                appearance-none
                                w-full
                                bg-[#f8f9fa]
                                border-[1.5px]
                                border-[#ced4da]
                                rounded-[6px]
                                py-[10px]
                                px-[12px]
                                pr-[36px]
                                text-[16px]
                                font-[400]
                                text-[#495057]
                                focus:outline-none
                                focus:border-[#80bdff]
                                focus:shadow-[0_0_0_0.2rem_rgba(0,123,255,0.25)]
                                transition-colors
                                duration-[200ms]
                                "
                            >
                                <option value={""}>{t.foodsFilter.nutrients.nothingSelected}</option>
                                {getAvailableNutrients(array.slice(0, index)).map(nutrient => (
                                    <option key={nutrient.id} value={nutrient.id}>
                                        {`${nutrient.name} (${nutrient.measurementUnit})`}
                                    </option>
                                ))}
                            </select>
                            <div
                                className="
                                absolute
                                right-[12px]
                                top-[50%]
                                transform
                                translate-y-[-50%]
                                pointer-events-none
                                text-[#6c757d]
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        // eslint-disable-next-line max-len
                                        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row gap-[12px] w-full">
                        <div className="w-[35%] sm:w-[30%] md:w-[25%]">
                            <div className="relative">
                                <select
                                    id={`operator-select-${index}`}
                                    aria-label={t.foodsFilter.nutrients.operator}
                                    value={nutrient.op}
                                    onChange={(e) => handleNutrientFilterChange("op", e.target.value, index)}
                                    className="
                                    appearance-none
                                    w-full
                                    bg-[#f8f9fa]
                                    border-[1.5px]
                                    border-[#ced4da]
                                    rounded-[6px]
                                    py-[10px]
                                    px-[12px]
                                    pr-[36px]
                                    text-[16px]
                                    font-[400]
                                    text-[#495057]
                                    focus:outline-none
                                    focus:border-[#80bdff]
                                    focus:shadow-[0_0_0_0.2rem_rgba(0,123,255,0.25)]
                                    transition-colors
                                    duration-[200ms]
                                    "
                                >
                                    <option value="<" aria-label={t.foodsFilter.nutrients.less}>&lt;</option>
                                    <option value="<=" aria-label={t.foodsFilter.nutrients.lessEqual}>&le;</option>
                                    <option value="=" aria-label={t.foodsFilter.nutrients.equal}>=</option>
                                    <option value=">=" aria-label={t.foodsFilter.nutrients.greaterEqual}>&ge;</option>
                                    <option value=">" aria-label={t.foodsFilter.nutrients.greater}>&gt;</option>
                                </select>
                                <div
                                    className="
                                    absolute
                                    right-[12px]
                                    top-[50%]
                                    transform
                                    translate-y-[-50%]
                                    pointer-events-none
                                    text-[#6c757d]
                                    "
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            // eslint-disable-next-line max-len
                                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="w-[65%] sm:w-[70%] md:w-[75%]">
                            <NumericField
                                id={`value-input-${index}`}
                                value={nutrient.value}
                                onChange={(value) => handleNutrientFilterChange("value", value, index)}
                                allowDecimals={true}
                                min={0}
                                error={typeof nutrient.value !== "undefined" && nutrient.value < 0}
                                errorMessage={t.foodsFilter.nutrients.noNegative}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-[12px] mt-[8px]">
                {selectedFilters.nutrientsFilter.length < nutrients.size && (
                    <button
                        onClick={handleAddNutrientFilter}
                        className="
                        flex
                        items-center
                        justify-center
                        px-[16px]
                        py-[10px]
                        bg-[#ffffff]
                        border-[1.5px]
                        border-[#007bff]
                        text-[#007bff]
                        rounded-[6px]
                        text-[14px]
                        font-[500]
                        transition-all
                        duration-[200ms]
                        hover:bg-[#007bff]
                        hover:text-[#ffffff]
                        focus:outline-none
                        focus:shadow-[0_0_0_0.2rem_rgba(0,123,255,0.25)]
                        "
                    >
                        <PlusCircle className="w-[18px] h-[18px] mr-[8px]"/>
                        {t.foodsFilter.nutrients.add}
                    </button>
                )}

                {selectedFilters.nutrientsFilter.length > 1 && (
                    <button
                        onClick={handleRemoveLastNutrientFilter}
                        className="
                        flex
                        items-center
                        justify-center
                        px-[16px]
                        py-[10px]
                        bg-[#ffffff]
                        border-[1.5px]
                        border-[#6c757d]
                        text-[#6c757d]
                        rounded-[6px]
                        text-[14px]
                        font-[500]
                        transition-all
                        duration-[200ms]
                        hover:bg-[#6c757d]
                        hover:text-[#ffffff]
                        focus:outline-none
                        focus:shadow-[0_0_0_0.2rem_rgba(108,117,125,0.25)]
                        "
                    >
                        <XCircle className="w-[18px] h-[18px] mr-[8px]"/>
                        {t.foodsFilter.nutrients.removeLast}
                    </button>
                )}
            </div>
        </div>

        <button
            onClick={resetFilters}
            className="
            bg-[#1d6735]
            text-[white]
            p-[10px]
            transition-all
            duration-300
            ease-in-out
            border-none
            w-full
            rounded-[5px]
            hover:bg-[#388e60]
            "
        >
            {t.foodsFilter.reset}
        </button>
    </>;
}
