import qs from "qs";
import { useState } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useFetch, { FetchStatus } from "../../hooks/useFetch";
import { FoodResult } from "../../types/option";
import { Collection } from "../../utils/collection";
import useOrigins from "../adminPage/getters/useOrigins";
import FoodResultsTable from "./FoodResultsTable";
import { useGroups, useLanguages, useNutrients, useTypes } from "./gets";
import SearchBox from "./SearchBox";
import "../../../assets/css/_foodFilter.css";

export default function FoodFilter() {
  const [selectedFilters, setSelectedFilters] = useState({
    foodTypeFilter: new Set<string>(),
    regionsFilter: new Set<string>(),
    groupsFilter: new Set<string>(),
    languagesFilter: new Set<string>(),
    nutrientFilter: new Set<string>(),
    operator: "=",
    value: 0,
  });
  const [searchForName, setSearchForName] = useState<string>("");

  const { collectionGroups: groups } = useGroups();
  const { regions } = useOrigins();

  const regionOptions = new Collection<string, string>(
    Array.from(regions.values()).map((region) => [region.id.toString(), region.name])
  );
  const { collectionTypes: types } = useTypes();
  const { collectionLanguages: languages } = useLanguages();
  const { collectionNutrients: nutrients } = useNutrients();

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
    language: Array.from(selectedFilters.languagesFilter),
    ...(selectedFilters.nutrientFilter.size > 0 &&
      selectedFilters.operator &&
      selectedFilters.value && {
        nutrient: Array.from(selectedFilters.nutrientFilter),
        operator: selectedFilters.operator,
        value: selectedFilters.value,
      }),
  };

  const queryString = qs.stringify(filters, {
    arrayFormat: "repeat",
    skipNulls: true,
  });

  const resetFilters = () => {
    setSelectedFilters({
      foodTypeFilter: new Set<string>(),
      regionsFilter: new Set<string>(),
      groupsFilter: new Set<string>(),
      languagesFilter: new Set<string>(),
      nutrientFilter: new Set<string>(),
      operator: "=",
      value: 0,
    });
    setSearchForName("");
  };

  const FoodResults = useFetch<FoodResult[]>(`/foods?${queryString}`);
  const foods = FoodResults.status === FetchStatus.Success ? FoodResults.data : [];
  console.log(`/foods?${queryString}`);
  const { t } = useTranslation();

  return (
    <div className="search-container">
      <div className="food-filter">
        <h2>{t('Filter.title')}</h2>

        {/* Filter Sections */}
        <div className="filter-group">
          <label htmlFor="other">{t('Filter.type')}</label>
          <SearchBox
            filterOptions={types}
            onChange={(values) => handleFilterChange("foodTypeFilter", values)}
            single={false}
            selectedOptions={Array.from(selectedFilters.foodTypeFilter)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="other">{t('Filter.regions')}</label>
          <SearchBox
            filterOptions={regionOptions}
            onChange={(values) => handleFilterChange("regionsFilter", values)}
            single={false}
            selectedOptions={Array.from(selectedFilters.regionsFilter)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="other">{t('Filter.group')}</label>
          <SearchBox
            filterOptions={groups}
            onChange={(values) => handleFilterChange("groupsFilter", values)}
            single={false}
            selectedOptions={Array.from(selectedFilters.groupsFilter)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="other">{t('Filter.Languages')}</label>
          <SearchBox
            filterOptions={languages}
            onChange={(values) => handleFilterChange("languagesFilter", values)}
            single={false}
            selectedOptions={Array.from(selectedFilters.languagesFilter)}
          />
        </div>

        {/* Measurement Section */}
        <Container className="mb-3 custom-container">
          <h3 className="measurent-title">
            <i className="bi bi-funnel-fill"></i> {t('Measurement.title')}
          </h3>
          <Row className="align-items-start flex-column">
            <Col className="mb-3">
              <div className="filter-group">
                <SearchBox
                  filterOptions={nutrients}
                  onChange={(values) =>
                    handleFilterChange("nutrientFilter", values)
                  }
                  single={true}
                  selectedOptions={Array.from(selectedFilters.nutrientFilter)}
                />
              </div>
            </Col>

            <Col className="mb-3">
              <Form.Group controlId="operator-select">
                <Form.Select
                  aria-label="Select operator"
                  value={selectedFilters.operator}
                  onChange={(e) =>
                    setSelectedFilters((prevFilters) => ({
                      ...prevFilters,
                      operator: e.target.value || "=",
                    }))
                  }
                >
                  <option value="">{t('Measurement.operator.title')}</option>
                  <option value="<">{t('Measurement.operator.type.less')}(&lt;)</option>
                  <option value="<=">{t('Measurement.operator.type.less_equal')} (&le;)</option>
                  <option value="=">{t('Measurement.operator.type.equal')}(=)</option>
                  <option value=">=">{t('Measurement.operator.type.greater_equal')} (&ge;)</option>
                  <option value=">">{t('Measurement.operator.type.greater')}(&gt;)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="content-input">
                <Form.Label>{t('Measurement.content.title')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    placeholder={t('Measurement.content.value')}
                    aria-label="Content value"
                    value={selectedFilters.value || 0}
                    onChange={(e) =>
                      setSelectedFilters((prevFilters) => ({
                        ...prevFilters,
                        value: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Container>

        <button onClick={resetFilters} className="reset-button">
          {t('Filter.reset')}
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
