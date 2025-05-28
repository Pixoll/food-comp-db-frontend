'use client'

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
  CSVFood,
  CSVMeasurement,
  CSVStringTranslation,
  CSVValue,
} from "./DataFromCsv";
import { Collection } from "../../utils/collection";
import {
  AnyNutrient,
  LangualCode,
  Group,
  Type,
  ScientificName,
  Subspecies,
} from "../../hooks";
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
        {IconComponent && (
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
};
type LangualCodesDisplayProps = {
  referenceCodes: CSVValue<number>[] | null | undefined;
  langualCodesInfo: Collection<string, LangualCode>;
};

function LangualCodesDisplay({
  referenceCodes,
  langualCodesInfo,
}: LangualCodesDisplayProps) {
  if (!referenceCodes || referenceCodes.length === 0) {
    return null;
  }

  return (
    <Card className="mb-3 border-light">
      <Card.Header className="bg-light d-flex align-items-center gap-2">
        <Tag size={20} className="text-secondary" />
        <strong>Códigos languales</strong>
      </Card.Header>
      <Card.Body>
        <Table
          striped
          bordered
          hover
          responsive
          size="sm"
          className="text-center table-layout-fixed"
          style={{ textAlign: "center", verticalAlign: "middle" }}
        >
          <thead className="table-light">
            <tr>
              <th>Código</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {referenceCodes.map((code, index) => {
              const langualCode = langualCodesInfo.get(
                code.parsed?.toString() || code.raw
              );

              return (
                <tr key={index}>
                  <td>{langualCode?.code}</td>
                  <td>
                    {langualCode
                      ? langualCode.descriptor
                      : "Langual Code not found"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
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
  langualCodesInfo: Collection<string, LangualCode>;
  scientificNamesInfo: Collection<number, ScientificName>;
  subspeciesNamesInfo: Collection<number, Subspecies>;
  typesNamesInfo: Collection<number, Type>;
  groupsNamesInfo: Collection<number, Group>;
};
export default function CSVFoodDisplay({
  food,
  nutrientsInfo,
  langualCodesInfo,
  scientificNamesInfo,
  subspeciesNamesInfo,
  typesNamesInfo,
  groupsNamesInfo,
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
        <div className="d-flex gap-2 ms-3">
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
                <strong>Código:</strong> {renderCSVValueWithFlags(food.code)}
              </div>
              {food.strain && (
                <div className="d-flex align-items-center gap-2">
                  <Leaf size={20} className="text-success" />
                  <strong>Variante:</strong>{" "}
                  {renderCSVValueWithFlags(food.strain)}
                </div>
              )}
              {food.brand && (
                <div className="d-flex align-items-center gap-2">
                  <ShoppingBag size={20} className="text-primary" />
                  <strong>Marca:</strong> {renderCSVValueWithFlags(food.brand)}
                </div>
              )}
              {food.subspecies &&(
                <div className="d-flex align-items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <strong>Subespecie: </strong>{subspeciesNamesInfo.get(food.subspecies.parsed ?? food.subspecies?.old ?? 0)?.name} {renderCSVValueWithFlags(food.brand)}
              </div>
              )}
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <Leaf size={20} className="text-success" />
                <strong>Grupo alimentario: </strong>
                {
                  groupsNamesInfo.get(food.group.parsed ?? food.group?.old ?? 0)
                    ?.name
                }{" "}
                {renderCSVValueWithFlags(food.group)}
              </div>
              <div className="d-flex align-items-center gap-2">
                <Tag size={20} className="text-secondary" />
                <strong>Tipo de alimento:</strong>{" "}
                {typesNamesInfo.get(food.type.parsed ?? food.type?.old ?? 0)?.name}
                {renderCSVValueWithFlags(food.type)}
              </div>
              {food.scientificName &&(
                <div className="d-flex align-items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <strong>Nombre cientifico: </strong>{scientificNamesInfo.get(food.scientificName.parsed ?? food.scientificName?.old ?? 0)?.name} {renderCSVValueWithFlags(food.scientificName)}
              </div>
              )}
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
          <LangualCodesDisplay
            referenceCodes={food.langualCodes}
            langualCodesInfo={langualCodesInfo}
          />
        </Accordion>
      </Card.Body>
    </Card>
  );
}
