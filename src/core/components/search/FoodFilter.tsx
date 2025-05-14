import qs from "qs";
import {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {FetchStatus, useFetch} from "../../hooks";
import {FoodResult} from "../../types/option";
import FilterBody, {Filters} from "./FilterBody";
import FoodResultsTable from "./FoodResultsTable";
import "../../../assets/css/_foodFilter.css";

type FoodFilterProps = {
    foodName: string
}

export default function FoodFilter({foodName = ""}: FoodFilterProps) {
    const {t} = useTranslation();
    const [searchParams] = useSearchParams();
    const paramFoodName = searchParams.get("name") || "";

    const [selectedFilters, setSelectedFilters] = useState<Filters>({
        foodTypeFilter: new Set(),
        regionsFilter: new Set(),
        groupsFilter: new Set(),
        nutrientsFilter: [{
            id: 0,
            op: "=",
        }],
    });
    const [searchForName, setSearchForName] = useState(paramFoodName || foodName);
    useEffect(() => {
        if (paramFoodName || foodName) {
            setSearchForName(paramFoodName || foodName);
        }
    }, [paramFoodName, foodName]);

    const filters = {
        name: searchForName.trim(),
        types: Array.from(selectedFilters.foodTypeFilter),
        regions: Array.from(selectedFilters.regionsFilter),
        groups: Array.from(selectedFilters.groupsFilter),
        ...selectedFilters.nutrientsFilter.reduce((acc, n) => {
            if (n.id > 0 && typeof n.value !== "undefined" && n.value >= 0) {
                acc.nutrients.push(n.id);
                acc.operators.push(n.op);
                acc.values.push(n.value);
            }
            return acc;
        }, {
            nutrients: [] as number[],
            operators: [] as string[],
            values: [] as number[],
        }),
    };

    const queryString = qs.stringify(filters, {
        arrayFormat: "comma",
        skipNulls: true,
    });

    const resetFilters = () => {
        setSelectedFilters({
            foodTypeFilter: new Set(),
            regionsFilter: new Set(),
            groupsFilter: new Set(),
            nutrientsFilter: [{
                id: 0,
                op: "=",
            }],
        });
        setSearchForName("");
    };

    const foodsResult = useFetch<FoodResult[]>(`/foods?${queryString}`);
    const foods = foodsResult.status === FetchStatus.Success ? foodsResult.data : [];

    return (
        <div /*className="w-full flex flex-col items-stretch justify-between gap-5 p-5 lg-custom:flex lg-custom:flex-row lg-custom:items-start">*/
            className="search-container">
            <Accordion defaultActiveKey="0" className="food-filter food-filter-accordion">
                <AccordionItem eventKey={"0"}>
                    <AccordionHeader>
                        <h5>{t("Filter.title")}</h5>
                    </AccordionHeader>
                    <AccordionBody>
                        <FilterBody
                            selectedFilters={selectedFilters}
                            setSelectedFilters={setSelectedFilters}
                            resetFilters={resetFilters}
                        />
                    </AccordionBody>
                </AccordionItem>
            </Accordion>

            <div className="food-filter food-filter-static">
                <h4>{t("Filter.title")}</h4>
                <FilterBody
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    resetFilters={resetFilters}
                />
            </div>

            <FoodResultsTable
                data={foods}
                searchForName={searchForName}
                setSearchForName={setSearchForName}
            />
        </div>
    );
}
