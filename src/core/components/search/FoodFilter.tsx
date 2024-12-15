import { PlusCircle, XCircle } from "lucide-react";
import qs from "qs";
import { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FetchStatus, useFetch, useGroups, useNutrients, useOrigins, useTypes } from "../../hooks";
import { FoodResult } from "../../types/option";
import { Collection } from "../../utils/collection";
import FoodResultsTable from "./FoodResultsTable";
import SearchBox from "./SearchBox";
import "../../../assets/css/_foodFilter.css";

type Filters = {
  foodTypeFilter: Set<string>;
  regionsFilter: Set<string>;
  groupsFilter: Set<string>;
  nutrientsFilter: NutrientFilter[];
};

type NutrientFilter = {
  id: number;
  op: string;
  value: number;
};

export default function FoodFilter() {
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    foodTypeFilter: new Set(),
    regionsFilter: new Set(),
    groupsFilter: new Set(),
    nutrientsFilter: [{
      id: 0,
      op: "=",
      value: 0,
    }],
  });
  const [searchForName, setSearchForName] = useState("");

  const groups = useGroups();
  const { regions } = useOrigins();

  const regionOptions = new Collection<string, string>(
    Array.from(regions.values()).map((region) => [region.id.toString(), region.name])
  );
  const types = useTypes();
  const { nutrients } = useNutrients();

  const handleFilterChange = (
    filterKey: keyof typeof selectedFilters,
    values: string[]
  ) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: new Set(values),
    }));
  };

  const filters = {
    name: searchForName.trim(),
    type: Array.from(selectedFilters.foodTypeFilter),
    region: Array.from(selectedFilters.regionsFilter),
    group: Array.from(selectedFilters.groupsFilter),
    ...selectedFilters.nutrientsFilter.reduce((acc, n) => {
      if (n.id > 0) {
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
        value: 0,
      }],
    });
    setSearchForName("");
  };

  const foodsResult = useFetch<FoodResult[]>(`/foods?${queryString}`);
  const foods = foodsResult.status === FetchStatus.Success ? foodsResult.data : [];
  const { t } = useTranslation();

  const handleNutrientFilterChange = <K extends keyof NutrientFilter>(key: K, value: NutrientFilter[K], index: number) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      nutrientsFilter: selectedFilters.nutrientsFilter.map((nutrient, i) =>
        i === index ? { ...nutrient, [key]: value } : nutrient
      ),
    }));
  };

  const handleAddNutrientFilter = () => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      nutrientsFilter: [...prevFilters.nutrientsFilter, {
        id: 0,
        op: "=",
        value: 0,
      }],
    }));
  };

  const handleRemoveLastNutrientFilter = () => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      nutrientsFilter: [...prevFilters.nutrientsFilter.slice(0, -1)],
    }));
  };

  return (
    <div className="search-container">
      <div className="food-filter">
        <h2>{t("Filter.title")}</h2>

        {/* Filter Sections */}
        <div className="filter-group">
          <label htmlFor="other">{t("Filter.type")}</label>
          <SearchBox
            filterOptions={types.idToName}
            onChange={(values) => handleFilterChange("foodTypeFilter", values)}
            single={false}
            selectedOptions={Array.from(selectedFilters.foodTypeFilter)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="other">{t("Filter.regions")}</label>
          <SearchBox
            filterOptions={regionOptions}
            onChange={(values) => handleFilterChange("regionsFilter", values)}
            single={false}
            selectedOptions={Array.from(selectedFilters.regionsFilter)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="other">{t("Filter.group")}</label>
          <SearchBox
            filterOptions={groups.idToName}
            onChange={(values) => handleFilterChange("groupsFilter", values)}
            single={false}
            selectedOptions={Array.from(selectedFilters.groupsFilter)}
          />
        </div>

        {/* Measurement Section */}
        <Container className="mb-3 custom-container">
          <h3 className="measurement-title">{t("Measurement.title")}</h3>
          {selectedFilters.nutrientsFilter.map((nutrient, index) => (
            <Row className="align-items-start flex-column measurement-row">
              {selectedFilters.nutrientsFilter.length > 1 && index > 0 && (
                <Col className={"mb-3"}>
                  <span className={"measurement-separator"}/>
                </Col>
              )}

              <Col className="mb-3">
                <Form.Group controlId="nutrient-select">
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
                    {nutrients.map(nutrient => (
                      <option value={nutrient.id}>{`${nutrient.name} (${nutrient.measurementUnit})`}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col className="mb-3">
                <Form.Group controlId="operator-select">
                  <Form.Select
                    aria-label="Select operator"
                    value={nutrient.op}
                    onChange={(e) => handleNutrientFilterChange("op", e.target.value, index)}
                  >
                    <option value="<">{t("Measurement.operator.less")} (&lt;)</option>
                    <option value="<=">{t("Measurement.operator.less_equal")} (&le;)</option>
                    <option value="=">{t("Measurement.operator.equal")} (=)</option>
                    <option value=">=">{t("Measurement.operator.greater_equal")} (&ge;)</option>
                    <option value=">">{t("Measurement.operator.greater")} (&gt;)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col className="mb-3">
                <Form.Group controlId="value-input">
                  <InputGroup>
                    <Form.Control
                      type="number"
                      aria-label="Nutrient value"
                      value={nutrient.value}
                      min={0}
                      onChange={(e) => handleNutrientFilterChange("value", +e.target.value, index)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          ))}
          <Row className="align-items-start flex-column">
            <Col className="mb-3">
              <Button
                onClick={handleAddNutrientFilter}
                variant="outline-primary"
                className="largeButton"
              >
                <PlusCircle className="me-2"/>
                Agregar
              </Button>
            </Col>
            {selectedFilters.nutrientsFilter.length > 1 && (
              <Col className="mb-3">
                <Button
                  onClick={handleRemoveLastNutrientFilter}
                  variant="outline-secondary"
                  className="largeButton"
                >
                  <XCircle className="me-2"/>
                  Eliminar último
                </Button>
              </Col>
            )}
          </Row>
        </Container>

        <button onClick={resetFilters} className="reset-button">
          {t("Filter.reset")}
        </button>
      </div>

      <FoodResultsTable
        data={foods}
        searchForName={searchForName}
        setSearchForName={setSearchForName}
      />
    </div>
  );
}
