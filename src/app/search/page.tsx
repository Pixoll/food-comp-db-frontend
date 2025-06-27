"use client";

import { GetFoodsData } from "@/api";
import { useApi } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterBody, { Filters } from "./components/FilterBody";
import FoodResultsTable from "./components/nutrient-table/FoodResultsTable";
import styles from "./search.module.css";

type Operator = NonNullable<NonNullable<GetFoodsData["query"]>["operators"]>[number];

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

    const foodsResult = useApi([searchForName, selectedFilters], (api, name, filters) => api.getFoods({
        query: {
            name: name.trim(),
            types: Array.from(filters.foodTypeFilter).map(n => +n),
            regions: Array.from(filters.regionsFilter).map(n => +n),
            groups: Array.from(filters.groupsFilter).map(n => +n),
            ...filters.nutrientsFilter.reduce((acc, n) => {
                if (n.id > 0 && typeof n.value !== "undefined" && n.value >= 0) {
                    acc.nutrients.push(n.id);
                    acc.operators.push(n.op as Operator);
                    acc.values.push(n.value);
                }
                return acc;
            }, {
                nutrients: [] as number[],
                operators: [] as Operator[],
                values: [] as number[],
            }),
        }
    }));

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
                data={foodsResult}
                status={foodsResult.status}
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
