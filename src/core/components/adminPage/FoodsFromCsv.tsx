import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import XLSX from "xlsx";
import { useAuth } from "../../context/AuthContext";
import makeRequest from "../../utils/makeRequest";
import FoodTableAdmin from "./FoodTableAdmin";

type CSVValue<T> = {
  parsed: T | null;
  raw: string;
  flags: number;
  old?: T | null;
};
type CSVStringTranslation = Record<"es" | "en" | "pt", CSVValue<string> | null>;

type CSVMeasurement = {
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
type Measurement = {
  id: `${number}`;
  min: number | null;
  max: number | null;
  food_id: `${number}`;
  nutrient_id: number;
  average: number;
  deviation: number | null;
  sample_size: number | null;
  data_type: "analytic" | "calculated" | "assumed" | "borrowed";
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

export default function FoodsFromCsv() {
  const { t } = useTranslation("global");
  const { state } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [data, setData] = useState<CSVFood[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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

    const csv = await Promise.all(Object.values(wb.Sheets).map(ws =>
      XLSX.utils.sheet_to_csv(ws, {
        blankrows: false,
        strip: true,
      })
    ));

    const payload = {
      foods: csv[0],
      references: csv[1],
    };

    console.log(payload);

    makeRequest(
      "post",
      "/csv",
      payload,
      state.token,
      (response) => {
        setData(response.data);
        console.log(response.data);
      },
      (error) => {
        console.error(error);
        alert(t("AdminPage.uploadError"));
      }
    );
  };

  return (
    <div className="right-container">
      <h3 className="subtitle">{t("AdminPage.import")}</h3>
      <input
        id="fileInput"
        className="file-input"
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={(e) => handleFileChange(e)}
      />
      <label htmlFor="fileInput" className="file-input-label">
        Seleccionar archivo
      </label>
      {selectedFile && <p className="file-name">{selectedFile.name}</p>}
      <p className="helper-text">
        {t("AdminPage.upload")} <strong>Excel</strong> {t("AdminPage.or")}{" "}
        <strong>CSV</strong> {t("AdminPage.point")}
      </p>
      {selectedFile && (
        <div className="button-container">
          <button className="button" onClick={processData}>
            {t("AdminPage.process")}
          </button>
        </div>
      )}
      {data && data.length > 0 && (
        <div>
          <FoodTableAdmin data={data}/>
        </div>
      )}
    </div>
  );
};
