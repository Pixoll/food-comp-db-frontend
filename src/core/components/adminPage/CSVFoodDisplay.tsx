import {
  BadgeX,
  CheckCircle,
  Globe,
  Leaf,
  MapPin,
  PlusCircle,
  RefreshCw,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import {
  CSVFood,
  CSVMeasurement,
  CSVStringTranslation,
  CSVValue,
} from "./FoodsFromCsv";
import { Collection } from "../../utils/collection";
import { AnyNutrient } from "../../hooks";
enum Flag {
  INVALID = 0,
  VALID = 1,
  IS_NEW = 1 << 1,
  UPDATED = 1 << 2,
}

const getFlagNames = (flags: number): string[] => {
  const names: string[] = [];
  if (flags === Flag.INVALID) return ["Invalid"];
  if (flags & Flag.VALID) names.push("Valid");
  if (flags & Flag.IS_NEW) names.push("New");
  if (flags & Flag.UPDATED) names.push("Updated");
  return names;
};

const getIconForFlags = (flags: number) => {
  if (flags === Flag.INVALID) return BadgeX;
  if (flags & Flag.IS_NEW) return PlusCircle;
  if (flags & Flag.UPDATED) return RefreshCw;
  if (flags & Flag.VALID) return CheckCircle;
  return null;
};

const renderCSVValueWithFlags = <T,>(
  value: CSVValue<T> | null | undefined | CSVValue<T>[]
) => {
  if (Array.isArray(value)) {
    return (
      <div>
        {value.map((item, index) => (
          <div key={index}>{renderCSVValueWithFlags(item)}</div>
        ))}
      </div>
    );
  } else {
    if (!value) return <span className="text-muted">N/A</span>;

    const displayValue =
      value.parsed !== null ? String(value.parsed) : value.raw;
    const IconComponent = getIconForFlags(value.flags);

    return (
      <div className="d-flex justify-content-center align-items-center gap-2">
        <span>{displayValue}</span>
        {(value.flags === Flag.INVALID || value.flags > 0) && IconComponent && (
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
              <IconComponent size={16} />
            </span>
          </OverlayTrigger>
        )}
      </div>
    );
  }
}    

type NutritionalMeasurementsProps = {
  measurements: CSVMeasurement[];
  nutrientsInfo: Collection<string, AnyNutrient>;
};
function NutritionalMeasurements({
  measurements,
  nutrientsInfo,
}: NutritionalMeasurementsProps) {
  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header>
        <div className="d-flex align-items-center gap-2">
          <Leaf size={20} className="text-success" />
          Nutritional Measurements ({measurements.length})
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <Table
          striped
          bordered
          hover
          responsive
          size="sm"
          className="text-center table-layout-fixed"
          style={{ textAlign: "center", verticalAlign: "middle" }}
        >
          <thead className="table-light align-items-center">
            <tr>
              <th>Nutriente</th>
              <th>Promedio</th>
              <th>Mínimo</th>
              <th>Máximo</th>
              <th>Desviación</th>
              <th>Tamaño de muestra</th>
              <th>Tipo de dato</th>
              <th>Referencias</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((measurement, idx) => (
              <tr key={idx}>
                <td>
                  {nutrientsInfo.get(measurement.nutrientId.toString())
                    ? `${
                        nutrientsInfo.get(measurement.nutrientId.toString())
                          ?.name || ""
                      } (${
                        nutrientsInfo.get(measurement.nutrientId.toString())
                          ?.measurementUnit || ""
                      })`
                    : "Nutrient not found"}
                </td>

                <td>{renderCSVValueWithFlags(measurement.average)}</td>
                <td>{renderCSVValueWithFlags(measurement.min ?? null)}</td>
                <td>{renderCSVValueWithFlags(measurement.max ?? null)}</td>
                <td>
                  {renderCSVValueWithFlags(measurement.deviation ?? null)}
                </td>
                <td>
                  {renderCSVValueWithFlags(measurement.sampleSize ?? null)}
                </td>
                <td>{renderCSVValueWithFlags(measurement.dataType)}</td>
                <td>{renderCSVValueWithFlags(measurement.referenceCodes)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Accordion.Body>
    </Accordion.Item>
  );
}
type CSVFoodDisplayProps = {
  food: CSVFood;
  nutrientsInfo: Collection<string, AnyNutrient>;
};
export default function CSVFoodDisplay({
  food,
  nutrientsInfo,
}: CSVFoodDisplayProps) {
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
                  <strong>Strain:</strong>{" "}
                  {renderCSVValueWithFlags(food.strain)}
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
                  <strong>Origin:</strong>{" "}
                  {renderCSVValueWithFlags(food.origin)}
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
          <NutritionalMeasurements
            measurements={food.measurements}
            nutrientsInfo={nutrientsInfo}
          />
        </Accordion>
      </Card.Body>
    </Card>
  );
}
