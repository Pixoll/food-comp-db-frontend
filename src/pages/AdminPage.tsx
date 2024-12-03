import React, { useState, useEffect } from "react";
import "../assets/css/_AdminPage.css";
import Origins from "../core/components/adminPage/Origins";
import { useTranslation } from "react-i18next";
import useNutrients, {
  MacroNutrient,
  AnyNutrient,
} from "../core/components/adminPage/getters/useNutrients";
import NewMacronutrientWithComponent from "../core/components/adminPage/NewMacronutrientWithComponent";
import NewNutrients from "../core/components/adminPage/NewNutrients";

const mapMacroNutrientWithoutComponentsToForm = (
  macronutrient: MacroNutrient
): NutrientMeasurementForm => ({
  nutrientId: macronutrient.id,
  average: null,
  deviation: null,
  min: null,
  max: null,
  sampleSize: null,
  dataType: null,
  referenceCodes: [],
});

const mapMacroNutrientWithComponentsToForm = (
  macronutrient: MacroNutrient
): NutrientMeasurementWithComponentsForm => ({
  nutrientId: macronutrient.id,
  average: null,
  deviation: null,
  min: null,
  max: null,
  sampleSize: null,
  dataType: null,
  referenceCodes: [],
  components:
    macronutrient.components?.map((component) => ({
      nutrientId: component.id,
      average: null,
      deviation: null,
      min: null,
      max: null,
      sampleSize: null,
      dataType: null,
      referenceCodes: [],
    })) || [],
});

export type NutrientMeasurementForm = {
  nutrientId: number;
  average: number | null;
  deviation: number | null;
  min: number | null;
  max: number | null;
  sampleSize: number | null;
  dataType: "analytic" | "calculated" | "assumed" | "borrowed" | null;
  referenceCodes: number[];
};

export type NutrientMeasurementWithComponentsForm = NutrientMeasurementForm & {
  components: NutrientMeasurementForm[];
};
type NutrientsValueForm = {
  energy: NutrientMeasurementForm[];
  mainNutrients: NutrientMeasurementWithComponentsForm[];
  micronutrients: {
    vitamins: NutrientMeasurementForm[];
    minerals: NutrientMeasurementForm[];
  };
};

type FoodForm = {
  code: string;
  strain?: string | null;
  brand?: string | null;
  observation?: string | null;
  group: {
    code: string;
    name: string;
  };
  type: {
    code: string;
    name: string;
  };
  scientificName?: string | null;
  subspecies?: string | null;
  commonName: Record<"es", string> & Partial<Record<"en" | "pt", string | null>>;
  ingredients: Partial<Record<"es" | "en" | "pt", string | null>>;
  nutrientsValueForm: NutrientsValueForm;
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [formData, setFormData] = useState<FoodForm>({
    code: "",
    commonName: { es: "" },
    ingredients: {},
    group: { code: "", name: "" },
    type: { code: "", name: "" },
    nutrientsValueForm: {
      energy: [],
      mainNutrients: [],
      micronutrients: {
        vitamins: [],
        minerals: [],
      },
    },
  });

  const { data } = useNutrients();

  useEffect(() => {
    if (data) {
      const initialFormData: FoodForm = {
        code: "",
        commonName: {
          es: "",
        },
        ingredients: {},
        group: { code: "defaultGroup", name: "Default Group" },
        type: { code: "defaultType", name: "Default Type" },
        nutrientsValueForm: {
          energy:
            data.macronutrients
              ?.filter((macronutrient: MacroNutrient) => macronutrient.isEnergy)
              .map((macronutrient: MacroNutrient) => ({
                nutrientId: macronutrient.id,
                average: null,
                deviation: null,
                min: null,
                max: null,
                sampleSize: null,
                dataType: null,
                references: null,
                referenceCodes: [],
              })) || [],

          mainNutrients:
            data.macronutrients
              ?.filter((m) => !m.isEnergy)
              .map((m) =>
                (m.components?.length ?? 0) > 0
                  ? mapMacroNutrientWithComponentsToForm(m)
                  : {
                      ...mapMacroNutrientWithoutComponentsToForm(m),
                      components: [],
                    }
              ) || [],

          micronutrients: {
            vitamins:
              data.micronutrients?.vitamins?.map((vitamin: AnyNutrient) => ({
                nutrientId: vitamin.id,
                average: null,
                deviation: null,
                min: null,
                max: null,
                sampleSize: null,
                dataType: null,
                referenceCodes: [],
              })) || [],
            minerals:
              data.micronutrients?.minerals?.map((mineral: AnyNutrient) => ({
                nutrientId: mineral.id,
                average: null,
                deviation: null,
                min: null,
                max: null,
                sampleSize: null,
                dataType: null,
                referenceCodes: [],
              })) || [],
          },
        },
      };

      setFormData(initialFormData);
    }
  }, [data, data?.macronutrients, data?.micronutrients]);

  //Este sera para el data general
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  //Este es para los macronutrientes con componentes
  const handleMacronutrientUpdate = (
    updatedNutrient: NutrientMeasurementWithComponentsForm
  ) => {
    setFormData((prev) => ({
      ...prev,
      nutrientsValueForm: {
        ...prev.nutrientsValueForm,
        mainNutrients: prev.nutrientsValueForm.mainNutrients.map((n) =>
          n.nutrientId === updatedNutrient.nutrientId
            ? { ...n, ...updatedNutrient }
            : n
        ),
      },
    }));
  };
  const handleNutrientstUpdate = (updatedNutrient: NutrientMeasurementForm) => {
    setFormData((prev) => ({
      ...prev,
      nutrientsValueForm: {
        ...prev.nutrientsValueForm,
        mainNutrients: prev.nutrientsValueForm.mainNutrients.map((n) =>
          n.nutrientId === updatedNutrient.nutrientId
            ? { ...n, ...updatedNutrient }
            : n
        ),
      },
    }));
  };

  console.log(
    formData.nutrientsValueForm.mainNutrients
  );

  const renderSection = () => {
    switch (activeSection) {
      case 2:
        return (
          <NewNutrients
            nutrients={formData.nutrientsValueForm.energy}
            onNutrientUpdate={handleNutrientstUpdate}
          />
        );
      case 3:
        return (
          <NewMacronutrientWithComponent
            macronutrientsWithComponents={formData.nutrientsValueForm.mainNutrients.filter(
              (n) => n.components?.length > 0
            )}
            onMacronutrientUpdate={handleMacronutrientUpdate}
          />
        );
      case 4:
        return (
          <NewNutrients
            nutrients={formData.nutrientsValueForm.mainNutrients.filter(
              (n) => n.components?.length === 0
            )}
            onNutrientUpdate={handleNutrientstUpdate}
          />
        );
      case 5:
        return (
          <NewNutrients
            nutrients={formData.nutrientsValueForm.micronutrients.vitamins}
            onNutrientUpdate={handleNutrientstUpdate}
          />
        );
      case 6:
        return (
          <NewNutrients
            nutrients={formData.nutrientsValueForm.micronutrients.minerals}
            onNutrientUpdate={handleNutrientstUpdate}
          />
        );
      case 7: // Origines
        return <Origins />;
      default:
        return null;
    }
  };
  const [view, setView] = useState<string>("manual");
  const { t } = useTranslation("global");

  /*const sectionNames = [
    t("Case_1.name"),
    t("Case_5.title"),
    t("Case_8.title"),
    t("Case_9.title"),
    t("Origins.title"),
  ];*/

  const sectionNames = [
    "Datos generales",
    "Valor energetico",
    "Macronutrientes compuestos",
    "Macronutrientes no compuestos",
    "Minerales",
    "Vitaminas",
    "Origines del alimento",
    "Referencias",
  ];

  return (
    <div className="AdminPage-background data-uploader">
      <div className="row first-row">
        <div className="tabs-container">
          <button className="tab" onClick={() => setView("manual")}>
            {t("AdminPage.manual")}
          </button>
          <button className="tab" onClick={() => setView("file")}>
            {t("AdminPage.load")}
          </button>
        </div>
      </div>
      <div className="row second-row">
        {view === "manual" && (
          <>
            <div className="left-column">
              <h3 className="subtitle">{t("AdminPage.title")}</h3>
              {sectionNames.map((name, index) => (
                <button
                  key={index + 1}
                  className={`pagination-button ${
                    activeSection === index + 1 ? "active" : ""
                  }`}
                  onClick={() => setActiveSection(index + 1)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="content-container">
              <h2 className="title">{t("AdminPage.enter")}</h2>
              {renderSection()}
            </div>
          </>
        )}
        {view === "file" && (
          <div className="right-container">
            <h3 className="subtitle">{t("AdminPage.import")}</h3>
            <input
              id="fileInput"
              className="file-input"
              type="file"
              accept=".xlsx, .xls, .csv"
            />
            <label htmlFor="fileInput" className="file-input-label">
              Seleccionar archivo
            </label>
            <p className="helper-text">
              {t("AdminPage.upload")} <strong>Excel</strong> {t("AdminPage.or")}{" "}
              <strong>CSV</strong> {t("AdminPage.point")}
            </p>
            <div className="button-container">
              <button className="button">{t("AdminPage.process")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
