import React, { useState } from "react";
import {
  Card,
  Accordion,
  Table,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Info } from "lucide-react";
import {
  CSVValue,
  CSVStringTranslation,
  CSVFood,
  CSVMeasurement,
} from "./FoodsFromCsv";

enum Flag {
  VALID = 1,
  IS_NEW = 1 << 1,
  UPDATED = 1 << 2,
}

const getFlagNames = (flags: number): string[] => {
  const names: string[] = [];
  if (flags & Flag.VALID) names.push("Valid");
  if (flags & Flag.IS_NEW) names.push("New");
  if (flags & Flag.UPDATED) names.push("Updated");
  return names;
};
const renderCSVValueWithFlags = <T,>(value: CSVValue<T> | null | undefined) => {
  if (!value) return "N/A";

  const displayValue = value.parsed !== null ? String(value.parsed) : value.raw;
  const flagNames = getFlagNames(value.flags);

  return (
    <div className="d-flex align-items-center gap-2">
      <span className={flagNames.length ? "text-warning fw-bold" : ""}>
        {displayValue}
      </span>
      {flagNames.length > 0 && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`flag-tooltip-${Math.random()}`}>
              {flagNames.map((name, idx) => (
                <div key={idx}>{name}</div>
              ))}
            </Tooltip>
          }
        >
          <span>
            <Info className="text-warning" size={16} />
          </span>
        </OverlayTrigger>
      )}
    </div>
  );
};

const NutritionalMeasurements: React.FC<{ measurements: CSVMeasurement[] }> = ({
  measurements,
}) => (
  <Accordion.Item eventKey="0">
    <Accordion.Header>
      Mediciones nutricionales ({measurements.length})
    </Accordion.Header>
    <Accordion.Body>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nutrient ID</th>
            <th>Average</th>
            <th>Min</th>
            <th>Max</th>
            <th>Data Type</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement, idx) => (
            <tr key={idx}>
              <td>{measurement.nutrientId}</td>
              <td>{renderCSVValueWithFlags(measurement.average)}</td>
              <td>{renderCSVValueWithFlags(measurement.min ?? null)}</td>
              <td>{renderCSVValueWithFlags(measurement.max ?? null)}</td>
              <td>{renderCSVValueWithFlags(measurement.dataType)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Accordion.Body>
  </Accordion.Item>
);

const CSVFoodDisplay: React.FC<{ food: CSVFood }> = ({ food }) => {
  const [activeLanguage, setActiveLanguage] =
    useState<keyof CSVStringTranslation>("en");

  return (
    <Card className="w-100">
      <Card.Header>
        <Card.Title>
          {renderCSVValueWithFlags(food.commonName[activeLanguage])}
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="d-flex gap-2 mb-4">
          {(["es", "en", "pt"] as const).map((lang) => (
            <Button
              key={lang}
              variant={activeLanguage === lang ? "primary" : "secondary"}
              onClick={() => setActiveLanguage(lang)}
              size="sm"
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <p>
              <strong>Code:</strong> {renderCSVValueWithFlags(food.code)}
            </p>
            {food.strain && (
              <p>
                <strong>Strain:</strong> {renderCSVValueWithFlags(food.strain)}
              </p>
            )}
            {food.brand && (
              <p>
                <strong>Brand:</strong> {renderCSVValueWithFlags(food.brand)}
              </p>
            )}
          </div>
          <div className="col-md-6">
            <p>
              <strong>Group:</strong> {renderCSVValueWithFlags(food.group)}
            </p>
            <p>
              <strong>Type:</strong> {renderCSVValueWithFlags(food.type)}
            </p>
            {food.origin && (
              <p>
                <strong>Origin:</strong> {renderCSVValueWithFlags(food.origin)}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <strong>Ingredients ({activeLanguage}):</strong>
          {renderCSVValueWithFlags(food.ingredients[activeLanguage])}
        </div>

        <Accordion defaultActiveKey="0">
          <NutritionalMeasurements measurements={food.measurements} />
        </Accordion>
      </Card.Body>
    </Card>
  );
};
export default CSVFoodDisplay;
