import React, { useState } from "react";
import {
  Card,
  Accordion,
  Table,
  Button,
  OverlayTrigger,
  Tooltip,
  Col,
  Row
} from "react-bootstrap";
import { Info, Globe, Tag, Leaf, ShoppingBag, MapPin } from "lucide-react";
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

const getFlagColor = (flags: number): string => {
  if (flags & Flag.IS_NEW) return "success";
  if (flags & Flag.UPDATED) return "warning";
  if (flags & Flag.VALID) return "primary";
  return "secondary";
};

const renderCSVValueWithFlags = <T,>(value: CSVValue<T> | null | undefined) => {
  if (!value) return <span className="text-muted">N/A</span>;

  const displayValue = value.parsed !== null ? String(value.parsed) : value.raw;
  const flagColor = getFlagColor(value.flags);

  return (
    <div className="d-flex align-items-center gap-2">
      <span className={`text-${flagColor} fw-semibold`}>{displayValue}</span>
      {value.flags > 0 && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`flag-tooltip-${Math.random()}`}>
              {getFlagNames(value.flags).map((name, idx) => (
                <div key={idx}>{name}</div>
              ))}
            </Tooltip>
          }
        >
          <span>
            <Info className={`text-${flagColor}`} size={16} />
          </span>
        </OverlayTrigger>
      )}
    </div>
  );
};

const getFlagNames = (flags: number): string[] => {
  const names: string[] = [];
  if (flags & Flag.VALID) names.push("Valid");
  if (flags & Flag.IS_NEW) names.push("New");
  if (flags & Flag.UPDATED) names.push("Updated");
  return names;
};

const NutritionalMeasurements: React.FC<{ measurements: CSVMeasurement[] }> = ({
  measurements,
}) => (
  <Accordion.Item eventKey="0">
    <Accordion.Header>
      <div className="d-flex align-items-center gap-2">
        <Leaf size={20} className="text-success" />
        Nutritional Measurements ({measurements.length})
      </div>
    </Accordion.Header>
    <Accordion.Body>
      <Table striped bordered hover responsive size="sm">
        <thead className="table-light">
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
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0 d-flex align-items-center gap-2">
          <Globe size={24} />
          {renderCSVValueWithFlags(food.commonName[activeLanguage])}
        </Card.Title>
        <div className="d-flex gap-2">
          {(["es", "en", "pt"] as const).map((lang) => (
            <Button
              key={lang}
              variant={activeLanguage === lang ? "light" : "outline-light"}
              onClick={() => setActiveLanguage(lang)}
              size="sm"
              className="text-uppercase"
            >
              {lang}
            </Button>
          ))}
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <Tag size={20} className="text-secondary" />
                <strong>Code:</strong> {renderCSVValueWithFlags(food.code)}
              </div>
              {food.strain && (
                <div className="d-flex align-items-center gap-2">
                  <Leaf size={20} className="text-success" />
                  <strong>Strain:</strong> {renderCSVValueWithFlags(food.strain)}
                </div>
              )}
              {food.brand && (
                <div className="d-flex align-items-center gap-2">
                  <ShoppingBag size={20} className="text-primary" />
                  <strong>Brand:</strong> {renderCSVValueWithFlags(food.brand)}
                </div>
              )}
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <Leaf size={20} className="text-success" />
                <strong>Group:</strong> {renderCSVValueWithFlags(food.group)}
              </div>
              <div className="d-flex align-items-center gap-2">
                <Tag size={20} className="text-secondary" />
                <strong>Type:</strong> {renderCSVValueWithFlags(food.type)}
              </div>
              {food.origin && (
                <div className="d-flex align-items-center gap-2">
                  <MapPin size={20} className="text-danger" />
                  <strong>Origin:</strong> {renderCSVValueWithFlags(food.origin)}
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Card className="mb-3 border-light">
          <Card.Header className="bg-light d-flex align-items-center gap-2">
            <Tag size={20} className="text-secondary" />
            <strong>Ingredients ({activeLanguage.toUpperCase()})</strong>
          </Card.Header>
          <Card.Body>
            {renderCSVValueWithFlags(food.ingredients[activeLanguage])}
          </Card.Body>
        </Card>

        <Accordion defaultActiveKey="0">
          <NutritionalMeasurements measurements={food.measurements} />
        </Accordion>
      </Card.Body>
    </Card>
  );
};

export default CSVFoodDisplay;