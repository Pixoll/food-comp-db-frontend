'use client'
import qs from "qs";
import {useState, useEffect} from "react";
import {FetchStatus, useFetch} from "@/hooks";
import {useTranslation} from "react-i18next";
import { useSearchParams } from 'next/navigation';
import FilterBody, {Filters} from "./components/FilterBody";
import FoodResultsTable from "./components/nutrient-table/FoodResultsTable";
import {FoodResult} from "@/types/option";
import "@/assets/css/_searchPage.css"
import styles from "./search.module.css"

export default function SearchPage() {
    const {t} = useTranslation();
    const searchParams = useSearchParams();
    const paramFoodName = searchParams.get('foodName') || "";

    const [selectedFilters, setSelectedFilters] = useState<Filters>({
        foodTypeFilter: new Set(),
        regionsFilter: new Set(),
        groupsFilter: new Set(),
        nutrientsFilter: [{
            id: 0,
            op: "=",
        }],
    });
    const [searchForName, setSearchForName] = useState(paramFoodName);
    useEffect(() => {
        if (paramFoodName) {
            setSearchForName(paramFoodName);
        }
    }, [paramFoodName]);

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
        <div className={styles["search-container"]}>
            {/*<Accordion defaultActiveKey="0" className="w-full flex-col bg-[white] !rounded-[10px] relative shadow-[0_4px_8px_rgba(0,0,0,0.1)] block max-w-[600px] w-full lg-custom:hidden"
            className="food-filter food-filter-accordion">
                <AccordionItem eventKey={"0"}>
                    <AccordionHeader className="focus:!shadow-none">
                        <h5 className="m-0">{t("Filter.title")}</h5>
                    </AccordionHeader>
                    <AccordionBody>
                        <FilterBody
                            selectedFilters={selectedFilters}
                            setSelectedFilters={setSelectedFilters}
                            resetFilters={resetFilters}
                        />
                    </AccordionBody>
                </AccordionItem>
            </Accordion>*/}

            <div className="p-[20px] flex flex-col bg-[white] rounded-[10px] relative shadow-md lg-custom:w-[39%]"/*className="food-filter food-filter-static"*/>
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
