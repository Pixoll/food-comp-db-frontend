import { ChangeEvent, useState } from "react";
import { Button, Col, Nav, Row, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import XLSX from "xlsx";
import { useAuth } from "../../context/AuthContext";
import {
  AnyNutrient,
  Author,
  City,
  Commune,
  Group,
  Journal,
  JournalVolume,
  LangualCode,
  Location,
  Province,
  Reference,
  Region,
  ScientificName,
  Subspecies,
  Type,
} from "../../hooks";
import { Collection } from "../../utils/collection";
import makeRequest from "../../utils/makeRequest";
import FoodValidateData from "./FoodValidateData";
import ReferenceValidated from "./ReferenceValidated";

export type CSVReference = {
  flags: number;
  code: CSVValue<number>;
  authors: Array<CSVValue<number>>;
  title: CSVValue<string>;
  type: CSVValue<TypesReferences["type"]>;
  journal?: CSVValue<number>; // este requiere get
  volume?: CSVValue<number>; // este requiere get
  issue?: CSVValue<number>;
  volumeYear?: CSVValue<number>;
  pageStart?: CSVValue<number>;
  pageEnd?: CSVValue<number>;
  city?: CSVValue<number>; // este requiere get
  year?: CSVValue<number>;
  other?: CSVValue<string>;
};
type TypesReferences = {
  type: "report" | "thesis" | "article" | "website" | "book";
};

export type CSVValue<T> = {
  parsed: T | null;
  raw: string;
  flags: number;
  old?: T | null;
};

export type CSVStringTranslation = Record<
  "es" | "en" | "pt",
  CSVValue<string> | null
>;

export type CSVMeasurement = {
  flags: number;
  nutrientId: number;
  average: CSVValue<number>;
  deviation?: CSVValue<number>;
  min?: CSVValue<number>;
  max?: CSVValue<number>;
  sampleSize?: CSVValue<number>;
  referenceCodes?: Array<CSVValue<number>>;
  dataType: CSVValue<Measurement["data_type"]>;
};

export type Measurement = {
  id: `${number}`;
  min: number | null;
  max: number | null;
  nutrient_id: number;
  average: number;
  deviation: number | null;
  sample_size: number | null;
  data_type: "analytic" | "calculated" | "assumed" | "borrowed";
  referenceCodes: number[];
};

export type CSVFood = {
  flags: number;
  code: CSVValue<string>;
  strain?: CSVValue<string>;
  origin?: CSVValue<string>;
  brand?: CSVValue<string>;
  observation?: CSVValue<string>;
  group: CSVValue<number>;
  type: CSVValue<number>;
  scientificName?: CSVValue<number>;
  subspecies?: CSVValue<number>;
  commonName: CSVStringTranslation;
  ingredients: CSVStringTranslation;
  langualCodes: Array<CSVValue<number>>;
  measurements: CSVMeasurement[];
};

type FoodsFromCsvProps = {
  nutrientsInfo: Collection<string, AnyNutrient>;
  langualCodesInfo: Collection<string, LangualCode>;
  scientificNamesInfo: Collection<number, ScientificName>;
  subspeciesNamesInfo: Collection<number, Subspecies>;
  typesNamesInfo: Collection<number, Type>;
  groupsNamesInfo: Collection<number, Group>;
  citiesInfo: City[];
  authorsInfo: Author[];
  journalsInfo: Journal[];
  journalVolumesInfo: JournalVolume[];
  referencesInfo: Reference[];
  regionsInfo: Collection<number, Region>;
  provincesInfo: Collection<number, Province>;
  communesInfo: Collection<number, Commune>;
  locationsInfo: Collection<number, Location>;
};

export default function DataFromCsv({
  nutrientsInfo,
  langualCodesInfo,
  scientificNamesInfo,
  subspeciesNamesInfo,
  typesNamesInfo,
  groupsNamesInfo,
  citiesInfo,
  authorsInfo,
  journalsInfo,
  journalVolumesInfo,
  referencesInfo,
  regionsInfo,
  provincesInfo,
  communesInfo,
  locationsInfo,
}: FoodsFromCsvProps) {
  const { t } = useTranslation();
  const { state } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [foodData, setFoodData] = useState<CSVFood[] | null>(null);
  const [referencesData, setReferencesData] = useState<CSVReference[] | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"foods" | "references">(
    "references"
  );
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [disableTabFood, setDisableTabFood] = useState(true);
  const [disableTabReferences, setDisableTabReferences] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const processData = async () => {
    if (!selectedFile) {
      alert(t("AdminPage.noFileSelected"));
      return;
    }

    const data = await selectedFile.arrayBuffer();
    const wb = XLSX.read(data, {
      cellFormula: false,
      cellHTML: false,
    });

    const csv = await Promise.all(
      Object.values(wb.Sheets).map((ws) =>
        XLSX.utils.sheet_to_csv(ws, {
          blankrows: false,
          strip: true,
        })
      )
    );

    const payload = {
      foods: csv[0],
      references: csv[1],
    };

    makeRequest("post", "/csv", {
      token: state.token,
      payload,
      successCallback: (response) => {
        setFoodData(response.data.foods);
        setReferencesData(response.data.references);
        setUploadSuccess(true);
        console.log(response.data);
      },
      errorCallback: (error) => {
        console.error(error);
        alert(t("AdminPage.uploadError"));
      }
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFoodData(null);
    setReferencesData(null);
    setUploadSuccess(false);
  };

  return (
    <div className="right-container">
      <h3 className="subtitle">{t("AdminPage.import")}</h3>
      <input
        id="fileInput"
        className="file-input"
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => handleFileChange(e)}
      />
      <label htmlFor="fileInput" className="file-input-label marginButtonRight">
        Añadir un archivo
      </label>
      {selectedFile && <p className="file-name">{selectedFile.name}</p>}
      <p className="helper-text">
        {t("AdminPage.upload")} <strong>Excel</strong> {t("AdminPage.or")}{" "}
        <strong>CSV</strong> {t("AdminPage.point")}
      </p>
      <Row className="mb-3">
        <Col>
          {selectedFile && !uploadSuccess && (
            <Button variant="success" onClick={processData} className="me-2">
              {t("AdminPage.process")}
            </Button>
          )}
          {uploadSuccess && (
            <Button variant="secondary" onClick={handleReset}>
              Cargar uno nuevo
            </Button>
          )}
        </Col>
      </Row>
      {uploadSuccess && foodData && referencesData && (
        <Tab.Container
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k as "foods" | "references")}
        >
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link disabled={disableTabReferences} eventKey="references">
                Referencias
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link disabled={disableTabFood} eventKey="foods">
                Alimentos
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="foods">
              {activeTab === "foods" && (
                <FoodValidateData
                  data={foodData}
                  nutrientsInfo={nutrientsInfo}
                  langualCodesInfo={langualCodesInfo}
                  groupsNamesInfo={groupsNamesInfo}
                  scientificNamesInfo={scientificNamesInfo}
                  subspeciesNamesInfo={subspeciesNamesInfo}
                  typesNamesInfo={typesNamesInfo}
                  regionsInfo={regionsInfo}
                  provincesInfo={provincesInfo}
                  communesInfo={communesInfo}
                  locationsInfo={locationsInfo}
                  handleView={setDisableTabReferences}
                />
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="references">
              {activeTab === "references" && (
                <ReferenceValidated
                  data={referencesData}
                  authorsInfo={authorsInfo}
                  citiesInfo={citiesInfo}
                  journalsInfo={journalsInfo}
                  journalVolumesInfo={journalVolumesInfo}
                  referencesInfo={referencesInfo}
                  handleView={setDisableTabFood}
                />
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      )}
    </div>
  );
}
