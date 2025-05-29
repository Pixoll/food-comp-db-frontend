import {PlusCircle, XCircle} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useGroups, useNutrients, useOrigins, useTypes} from "@/core/hooks";
import {Collection} from "@/core/utils/collection";
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
                                   }: FilterBodyProps) {
    const {t} = useTranslation();
    const groups = useGroups().idToName;
    const types = useTypes().idToName;
    const {nutrients} = useNutrients();
    const {regions} = useOrigins();
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
    ) => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: new Set(values),
        }));
    };

    const handleNutrientFilterChange = <K extends keyof NutrientFilter>(key: K, value: NutrientFilter[K], index: number) => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            nutrientsFilter: selectedFilters.nutrientsFilter.map((nutrient, i) =>
                i === index ? {...nutrient, [key]: value} : nutrient
            ),
        }));
    };

    const handleAddNutrientFilter = () => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            nutrientsFilter: [...prevFilters.nutrientsFilter, {
                id: 0,
                op: "=",
            }],
        }));
    };

    const handleRemoveLastNutrientFilter = () => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            nutrientsFilter: [...prevFilters.nutrientsFilter.slice(0, -1)],
        }));
    };

    return <>
        {/* Filter Sections */}
        <div className="mb-[16px]"/*className="filter-group"*/>
            <label htmlFor="other">{t("Filter.type")}</label>
            <SearchBox
                filterOptions={types}
                onChange={(values) => handleFilterChange("foodTypeFilter", values)}
                single={false}
                selectedOptions={Array.from(selectedFilters.foodTypeFilter)}
            />
        </div>

        <div className="mb-[16px]">
            <label htmlFor="other">{t("Filter.regions")}</label>
            <SearchBox
                filterOptions={regionOptions}
                onChange={(values) => handleFilterChange("regionsFilter", values)}
                single={false}
                selectedOptions={Array.from(selectedFilters.regionsFilter)}
            />
        </div>

        <div className="mb-[16px]">
            <label htmlFor="other">{t("Filter.group")}</label>
            <SearchBox
                filterOptions={groups}
                onChange={(values) => handleFilterChange("groupsFilter", values)}
                single={false}
                selectedOptions={Array.from(selectedFilters.groupsFilter)}
            />
        </div>

        {/* Measurement Section */}
        <div
            className="mb-[16px] bg-[#cbe0d4] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] p-[20px] relative !my-[0]">
            <h3 className="flex items-center justify-center py-[12px] text-center gap-[10px] text-[#01190f] font-[500] text-[24px]">{t("Measurement.title")}</h3>
            {selectedFilters.nutrientsFilter.map((nutrient, index, array) => (
                <div key={index} className="align-items-start flex-column measurement-row mb-[0px]">
                    {selectedFilters.nutrientsFilter.length > 1 && index > 0 && (
                        <div className="mb-3">
                            <span className="block flex-grow border-b border-[#b0b0b0]"/>
                        </div>
                    )}

                    <div className="mb-3">
                        {/*<Form.Group controlId="nutrient-select">
                            <Form.Select
                                aria-label="Select nutrient"
                                value={nutrient.id || ""}
                                onChange={(e) => {
                                    const id = +e.target.value;
                                    if (Number.isSafeInteger(id)) {
                                        handleNutrientFilterChange("id", id, index);
                                    }
                                }}
                            >
                                <option value={""}>Nada seleccionado</option>
                                {getAvailableNutrients(array.slice(0, index)).map(nutrient => (
                                    <option key={nutrient.id}
                                            value={nutrient.id}>{`${nutrient.name} (${nutrient.measurementUnit})`}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>*/}
                    </div>

                    <div style={{padding: "0"}}>
                        <div>
                            {/*<Form.Group controlId="operator-select">
                                <Form.Select
                                    aria-label="Select operator"
                                    value={nutrient.op}
                                    onChange={(e) => handleNutrientFilterChange("op", e.target.value, index)}
                                >
                                    <option value="<">&lt;</option>
                                    <option value="<=">&le;</option>
                                    <option value="=">=</option>
                                    <option value=">=">&ge;</option>
                                    <option value=">">&gt;</option>
                                </Form.Select>
                            </Form.Group>*/}
                        </div>

                        <div>
                            {/*<Form.Group controlId="value-input">
                                <InputGroup>
                                    <Form.Control
                                        type="number"
                                        aria-label="Nutrient value"
                                        placeholder={t("Measurement.value")}
                                        value={nutrient.value ?? ""}
                                        isInvalid={typeof nutrient.value !== "undefined" && nutrient.value < 0}
                                        style={{borderRadius: "5px"}}
                                        onChange={(e) =>
                                            handleNutrientFilterChange(
                                                "value",
                                                e.target.value.length > 0 ? +e.target.value : undefined,
                                                index
                                            )
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Valor no puede ser negativo.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>*/}
                        </div>
                    </div>
                </div>
            ))}
            <div className="align-items-start flex-column">
                {selectedFilters.nutrientsFilter.length < nutrients.size && (
                    <div className={selectedFilters.nutrientsFilter.length > 1 ? "mb-3" : ""}>
                        <button
                            onClick={handleAddNutrientFilter}
                            className="large-button"
                        >
                            <PlusCircle className="me-2"/>
                            Agregar
                        </button>
                    </div>
                )}
                {selectedFilters.nutrientsFilter.length > 1 && (
                    <div>
                        <button
                            onClick={handleRemoveLastNutrientFilter}
                            className="large-button"
                        >
                            <XCircle className="me-[8px]"/>
                            Eliminar último
                        </button>
                    </div>
                )}
            </div>
        </div>

        <button onClick={resetFilters}
                className="bg-[#1D6735FF] text-[white] p-[10px] border-none w-full rounded-[5px]">
            {t("Filter.reset")}
        </button>
    </>;
}
