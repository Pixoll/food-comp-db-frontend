import { useState } from "react";
import SearchBox from "./SearchBox";
import "../../../assets/css/_foodFilter.css";
import FoodResultsTable from "./FoodResultsTable";
import GetGroups from "./gets/GetGroups";
import GetLanguages from "./gets/GetLanguages";
import GetRegions from "./gets/GetRegions";
import GetTypes from "./gets/getTypes";
import { FoodResult } from "../../types/option";
import useFetch from "../../hooks/useFetch";
import qs from "qs";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
const FoodFilter = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    foodTypeFilter: new Set<string>(),
    regionsFilter: new Set<string>(),
    groupsFilter: new Set<string>(),
    languagesFilter: new Set<string>(),
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchForName, setSearchForName] = useState<string>("");

  const { collectionGroups: groups } = GetGroups();
  const { collectionRegions: regions } = GetRegions();
  const { collectionTypes: types } = GetTypes();
  const { collectionLanguages: languages } = GetLanguages();

  const handleSort = (order: "asc" | "desc") => {
    if (order === "asc" || order === "desc") {
      setSortOrder(order);
    }
  };

  const handleFilterChange = (
    filterKey: keyof typeof selectedFilters,
    values: string[]
  ) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: new Set(values), // Actualiza el filtro correspondiente
    }));
  };

  const filters = {
    name: searchForName.toString(),
    type: Array.from(selectedFilters.foodTypeFilter),
    region: Array.from(selectedFilters.regionsFilter),
    group: Array.from(selectedFilters.groupsFilter),
    language: Array.from(selectedFilters.languagesFilter),
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
    });
    setSearchForName("");
    setSortOrder("asc");
  };

  const { data: FoodResulst } = useFetch<FoodResult[]>(
    `http://localhost:3000/api/v1/foods?${queryString}`
  );

  return (
    <div className="search-container">
      <div className="food-filter">
        <h2>Filtros</h2>

        <div className="filter-group">
          <label htmlFor="other">Tipo de alimento</label>
          <SearchBox
            filterOptions={types}
            onChange={(values) => handleFilterChange("foodTypeFilter", values)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="other">Regiones de Chile</label>
          <SearchBox
            filterOptions={regions}
            onChange={(values) => handleFilterChange("regionsFilter", values)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="other">Grupo alimentario</label>
          <SearchBox
            filterOptions={groups}
            onChange={(values) => handleFilterChange("groupsFilter", values)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="other">Lenguajes</label>
          <SearchBox
            filterOptions={languages}
            onChange={(values) => handleFilterChange("languagesFilter", values)}
          />
        </div>

        <Container className="mb-3 custom-container">
          <h3 className="measurent-title">
            <i className="bi bi-funnel-fill"></i> Medición de nutrientes
          </h3>
          <Row className="align-items-start flex-column">
            <Col className="mb-3">
              <div className="filter-group">
                <SearchBox
                  filterOptions={languages}
                  onChange={(values) =>
                    handleFilterChange("languagesFilter", values)
                  }
                />
              </div>
            </Col>

            <Col className="mb-3">
              <Form.Group controlId="operator-select">
                <Form.Select aria-label="Select operator">
                  <option value="">Operador</option>
                  <option value="<">Menor que (&lt;)</option>
                  <option value="<=">Menor o igual (&le;)</option>
                  <option value="=">Igual a (=)</option>
                  <option value=">=">Mayor o igual (&ge;)</option>
                  <option value=">">Mayor que (&gt;)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="content-input">
                <Form.Label>Contenido</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    placeholder="Valor"
                    aria-label="Content value"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Container>

        <button onClick={resetFilters} className="reset-button">
          Reestablecer filtro
        </button>
      </div>
      <FoodResultsTable
        data={FoodResulst ?? []}
        sortOrder={sortOrder}
        handleSort={handleSort}
        searchForName={searchForName}
        setSearchForName={setSearchForName}
      />
    </div>
  );
};
export default FoodFilter;
