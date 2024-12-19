import qs from "qs";
import { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FetchStatus, useFetch } from "../../hooks";
import { FoodResult } from "../../types/option";
import FilterBody, { Filters } from "./FilterBody";
import FoodResultsTable from "./FoodResultsTable";
import "../../../assets/css/_foodFilter.css";

export default function FoodFilter() {
  const { t } = useTranslation();
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    foodTypeFilter: new Set(),
    regionsFilter: new Set(),
    groupsFilter: new Set(),
    nutrientsFilter: [{
      id: 0,
      op: "=",
    }],
  });
  const [searchForName, setSearchForName] = useState("");

  const filters = {
    name: searchForName.trim(),
    type: Array.from(selectedFilters.foodTypeFilter),
    region: Array.from(selectedFilters.regionsFilter),
    group: Array.from(selectedFilters.groupsFilter),
    ...selectedFilters.nutrientsFilter.reduce((acc, n) => {
      if (n.id > 0 && typeof n.value !== "undefined" && n.value >= 0) {
        acc.nutrient.push(n.id);
        acc.operator.push(n.op);
        acc.value.push(n.value);
      }
      return acc;
    }, {
      nutrient: [] as number[],
      operator: [] as string[],
      value: [] as number[],
    }),
  };

  const queryString = qs.stringify(filters, {
    arrayFormat: "repeat",
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
    <div className="search-container">
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
