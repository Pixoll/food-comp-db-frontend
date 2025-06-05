"use client";
import { FetchStatus, useFetch } from "@/hooks";
import { FoodResult } from "@/types/option";
import { useSearchParams } from "next/navigation";
import qs from "qs";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterBody, { Filters } from "./components/FilterBody";
import FoodResultsTable from "./components/nutrient-table/FoodResultsTable";
import styles from "./search.module.css";

function Search() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const paramFoodName = searchParams.get("foodName") || "";

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
            <div className={`${styles["filter-body-container"]} p-[20px] flex flex-col bg-[white] rounded-[10px] relative shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)]`}/*className="food-filter food-filter-static"*/>
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

export default function SearchPage() {
    return (
        <Suspense>
            <Search/>
        </Suspense>
    );
}
