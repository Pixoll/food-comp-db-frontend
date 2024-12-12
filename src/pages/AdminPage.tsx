import { useState, useEffect } from "react";
import "../assets/css/_AdminPage.css";
import { useTranslation } from "react-i18next";
import useNutrients, {
  MacroNutrient,
  AnyNutrient,
} from "../core/components/adminPage/getters/useNutrients";
import NewMacronutrientWithComponent from "../core/components/adminPage/NewMacronutrientWithComponent";
import NewNutrients from "../core/components/adminPage/NewNutrients";
import NewGeneralData from "../core/components/adminPage/NewGeneralData";
import Origins from "../core/components/adminPage/Origins";
import PreviewDataForm from "../core/components/adminPage/PreviewDataForm";
import { FetchStatus } from "../core/hooks/useFetch";
import useOrigins from "../core/components/adminPage/getters/useOrigins";
import useReferences, {
  Author,
} from "../core/components/adminPage/getters/UseReferences";
import { Origin } from "../core/types/SingleFoodResult";
import NewReferences from "../core/components/adminPage/NewReferences";
import NewReference from "../core/components/adminPage/NewReference";
import NewAuthors from "../core/components/adminPage/NewAuthors";
import NewArticleByReference from "../core/components/adminPage/NewArticleByReference";
import FoodTableAdmin from "../core/components/adminPage/FoodTableAdmin";
import {
  ReferenceForm,
  NewArticle,
} from "../core/components/adminPage/NewReference";
import PreviewNewReference from "../core/components/adminPage/PreviewNewReference";

export type NutrientSummary = {
  id: number;
  name: string;
  measurementUnit: string;
};

export const getNutrientNameById = (
  id: number,
  nameAndIdNutrients: NutrientSummary[]
): string => {
  const nutrient = nameAndIdNutrients.find((nutrient) => nutrient.id === id);
  return `${nutrient?.name} (${nutrient?.measurementUnit})`;
};

export type OriginsByForm = {
  ids: (number | null)[];
  origins: string[];
};

type Section = {
  id: string;
  name: string;
};

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

// ----------------TESTEANDO---------------
//Esto es la base para ver la tabla con cosas temporales, debe linkearse a lo que llega del CSV...
const adminData = [
  { id: "1", name: "Manzana", code: "apple" },
  { id: "2", name: "Banana", code: "banana" },
  { id: "3", name: "Pera", code: "pear" },
  { id: "4", name: "Pera", code: "pear" },
  { id: "5", name: "Pera", code: "pear" },
  { id: "6", name: "Pera", code: "pear" },
  { id: "7", name: "Pera", code: "pear" },
  { id: "8", name: "Pera", code: "pear" },
  { id: "9", name: "Pera", code: "pear" },
  { id: "10", name: "Pera", code: "pear" },
];
// -----------------------------------------

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
export type NutrientsValueForm = {
  energy: NutrientMeasurementForm[];
  mainNutrients: NutrientMeasurementWithComponentsForm[];
  micronutrients: {
    vitamins: NutrientMeasurementForm[];
    minerals: NutrientMeasurementForm[];
  };
};

type GeneralData = {
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
  commonName: Record<"es", string> &
    Partial<Record<"en" | "pt", string | null>>;
  ingredients: Partial<Record<"es" | "en" | "pt", string | null>>;
  origins: (number | null)[];
};
export type FoodForm = {
  generalData: GeneralData;
  nutrientsValueForm: NutrientsValueForm;
};

export default function AdminPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [referenceForm, setReferenceForm] = useState<ReferenceForm>({
    type: "article", //Listo <NewReference>
    title: "", //Listo <NewReference>
    authorIds: undefined, //Listo <NewAuthor>
    newAuthors: undefined, //Listo<NewAuthor>
    year: undefined, //Listo <NewReference>
    newArticle: undefined, //No listo <Para otro componente>
    cityId: undefined, //Listo <NewReference>
    newCity: undefined, //Listo <NewReference>
    other: undefined, //Listo <NewReference>
  });

  const handleDataFormReference = (updatedFields: Partial<ReferenceForm>) => {
    setReferenceForm((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleUpdateNewArticle = (updatedArticle: NewArticle) => {
    setReferenceForm((prev) => ({
      ...prev,
      newArticle: updatedArticle,
    }));
  };

  const handleUpdateAuthors = (authors: Author[]) => {
    const newAuthors = authors
      .filter((author) => author.id < 0)
      .map((author) => author.name);
    const authorIds = authors
      .filter((author) => author.id > 0)
      .map((author) => author.id);

    setReferenceForm((prev) => ({
      ...prev,
      authorIds,
      newAuthors,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const { regions, provinces, communes, locations } = useOrigins();
  const [origins, setOrigins] = useState<Origin[] | undefined>([]);

  const [activeSection, setActiveSection] = useState<number>(1);
  const [activeSectionByNewReference, setActiveSectionByNewReference] =
    useState<string>("general");

  const [formData, setFormData] = useState<FoodForm>({
    generalData: {
      code: "",
      commonName: { es: "" },
      ingredients: {},
      group: { code: "", name: "" },
      type: { code: "", name: "" },
      origins: [...new Set(origins?.map((o) => o.id))],
    },
    nutrientsValueForm: {
      energy: [],
      mainNutrients: [],
      micronutrients: {
        vitamins: [],
        minerals: [],
      },
    },
  });
  const { references, authors, cities, journals, journalVolumes, articles } =
    useReferences();

  const nutrientsResult = useNutrients();
  const nutrients =
    nutrientsResult.status === FetchStatus.Success
      ? nutrientsResult.data
      : null;

  const nameAndIdNutrients: NutrientSummary[] = [];

  nutrients?.macronutrients.forEach((macronutrient) => {
    nameAndIdNutrients.push({
      id: macronutrient.id,
      name: macronutrient.name,
      measurementUnit: macronutrient.measurementUnit,
    });
    macronutrient.components?.forEach((component) => {
      nameAndIdNutrients.push({
        id: component.id,
        name: component.name,
        measurementUnit: component.measurementUnit,
      });
    });
  });
  nutrients?.micronutrients.minerals.forEach((mineral) => {
    nameAndIdNutrients.push({
      id: mineral.id,
      name: mineral.name,
      measurementUnit: mineral.measurementUnit,
    });
  });
  nutrients?.micronutrients.vitamins.forEach((vitamin) => {
    nameAndIdNutrients.push({
      id: vitamin.id,
      name: vitamin.name,
      measurementUnit: vitamin.measurementUnit,
    });
  });
  useEffect(() => {
    if (nutrients) {
      const initialFormData: FoodForm = {
        generalData: {
          code: "",
          commonName: {
            es: "",
          },
          ingredients: {},
          group: { code: "defaultGroup", name: "Default Group" },
          type: { code: "defaultType", name: "Default Type" },
          origins: [...new Set(origins?.map((o) => o.id))],
        },
        nutrientsValueForm: {
          energy:
            nutrients.macronutrients
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
            nutrients.macronutrients
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
              nutrients.micronutrients?.vitamins?.map(
                (vitamin: AnyNutrient) => ({
                  nutrientId: vitamin.id,
                  average: null,
                  deviation: null,
                  min: null,
                  max: null,
                  sampleSize: null,
                  dataType: null,
                  referenceCodes: [],
                })
              ) || [],
            minerals:
              nutrients.micronutrients?.minerals?.map(
                (mineral: AnyNutrient) => ({
                  nutrientId: mineral.id,
                  average: null,
                  deviation: null,
                  min: null,
                  max: null,
                  sampleSize: null,
                  dataType: null,
                  referenceCodes: [],
                })
              ) || [],
          },
        },
      };

      setFormData(initialFormData);
    }
  }, [nutrients, nutrients?.macronutrients, nutrients?.micronutrients]);

  const handleUpdate = (updatedData: Partial<GeneralData>) => {
    setFormData((prev) => ({
      ...prev,
      generalData: {
        ...prev.generalData,
        ...updatedData,
      },
    }));
  };
  const handleOrigins = (updateOrigins: Origin[] | undefined): void => {
    if (!updateOrigins) {
      setOrigins([]);
      return;
    }
    const validOrigins = updateOrigins.filter(
      (o) => o.id !== 0 && o.name !== ""
    );

    const uniqueOrigins = Array.from(
      new Map(validOrigins.map((o) => [o.id, o])).values()
    );

    setOrigins(uniqueOrigins);
  };

  const handleNutrientUpdate = (updatedNutrient: NutrientMeasurementForm) => {
    setFormData((prev) => {
      const updateSection = (nutrients: NutrientMeasurementForm[]) =>
        nutrients.map((nutrient) =>
          nutrient.nutrientId === updatedNutrient.nutrientId
            ? { ...nutrient, ...updatedNutrient }
            : nutrient
        );

      return {
        ...prev,
        nutrientsValueForm: {
          ...prev.nutrientsValueForm,
          energy: updateSection(prev.nutrientsValueForm.energy),
          mainNutrients: prev.nutrientsValueForm.mainNutrients.map((nutrient) =>
            nutrient.nutrientId === updatedNutrient.nutrientId
              ? { ...nutrient, ...updatedNutrient }
              : nutrient
          ),
          micronutrients: {
            vitamins: updateSection(
              prev.nutrientsValueForm.micronutrients.vitamins
            ),
            minerals: updateSection(
              prev.nutrientsValueForm.micronutrients.minerals
            ),
          },
        },
      };
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 1:
        return (
          <NewGeneralData data={formData.generalData} onUpdate={handleUpdate} />
        );

      case 2:
        return (
          <NewNutrients
            nutrients={formData.nutrientsValueForm.energy}
            onNutrientUpdate={handleNutrientUpdate}
            nameAndIdNutrients={nameAndIdNutrients}
          />
        );
      case 3:
        return (
          <NewMacronutrientWithComponent
            macronutrientsWithComponents={formData.nutrientsValueForm.mainNutrients.filter(
              (n) => n.components?.length > 0
            )}
            onMacronutrientUpdate={handleNutrientUpdate}
            nameAndIdNutrients={nameAndIdNutrients}
          />
        );
      case 4:
        return (
          <NewNutrients
            nutrients={formData.nutrientsValueForm.mainNutrients.filter(
              (n) => n.components?.length === 0
            )}
            onNutrientUpdate={handleNutrientUpdate}
            nameAndIdNutrients={nameAndIdNutrients}
          />
        );
      case 5:
        return (
          <NewNutrients
            nutrients={formData.nutrientsValueForm.micronutrients.vitamins}
            onNutrientUpdate={handleNutrientUpdate}
            nameAndIdNutrients={nameAndIdNutrients}
          />
        );
      case 6:
        return (
          <NewNutrients
            nutrients={formData.nutrientsValueForm.micronutrients.minerals}
            onNutrientUpdate={handleNutrientUpdate}
            nameAndIdNutrients={nameAndIdNutrients}
          />
        );
      case 7: // Origines
        return (
          <Origins
            originsForm={origins || []}
            data={{ regions, provinces, communes, locations }}
            updateOrigins={handleOrigins}
          />
        );
      case 8:
        return (
          <NewReferences
            references={references || []}
            nutrientValueForm={formData.nutrientsValueForm}
            nameAndIdNutrients={nameAndIdNutrients}
          />
        );
      case 9:
        return (
          <PreviewDataForm
            data={formData}
            nameAndIdNutrients={nameAndIdNutrients}
            origins={origins?.map((o) => o.name) || []}
          />
        );
      default:
        return null;
    }
  };

  const [view, setView] = useState<string>("manual");
  const { t } = useTranslation("global");

  const sectionNames = [
    "Datos generales",
    "Valor energetico",
    "Macronutrientes compuestos",
    "Macronutrientes no compuestos",
    "Vitaminas",
    "Minerales",
    "Origines del alimento",
    "Referencias",
    "Vista de información actual",
  ];

  let sectionNamesByNewReference: Section[] = [];

  if (referenceForm.type === "article") {
    sectionNamesByNewReference = [
      { id: "general", name: "Datos generales"},
      { id: "authors", name: "Autores"},
      { id: "article", name: "Artículo"},
      { id: "preview", name: "Previsualización"},
    ];
  } else {
    sectionNamesByNewReference = [
      { id: "general", name: "Datos generales"},
      { id: "authors", name: "Autores"},
      { id: "preview", name: "Previsualización"},
    ];
  }
  const renderSectionByNewReference = () => {
    switch (activeSectionByNewReference) {
      case "general":
        return (
          <NewReference
            type={referenceForm.type}
            title={referenceForm.title}
            year={referenceForm.year}
            cityId={referenceForm.cityId}
            newCity={referenceForm.newCity}
            other={referenceForm.other}
            cities={cities || []}
            onFormUpdate={handleDataFormReference}
          />
        );
      case "authors":
        return (
          <NewAuthors
            authorIds={referenceForm.authorIds}
            newAuthors={referenceForm.newAuthors}
            data={authors || []}
            updateAuthors={handleUpdateAuthors}
          />
        );
      case "article":
        return (
          <NewArticleByReference
            data={{
              journals: journals || [],
              journalVolumes: journalVolumes || [],
              articles: articles || [],
            }}
            dataForm={{
              newArticle: referenceForm.newArticle,
            }}
            updateNewArticle={handleUpdateNewArticle}
          />
        );
      case "preview":
        return (
          <PreviewNewReference
            data={referenceForm}
            authors={authors || []}
            cities={cities || []}
            journals={journals || []}
            journalVolumes={journalVolumes || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="AdminPage-background data-uploader">
      <div className="row first-row">
        <div className="tabs-container">
          <button className="tab" onClick={() => setView("post-reference")}>
            {"Ingresar una nueva referencia"}
          </button>
          <button className="tab" onClick={() => setView("manual")}>
            {t("AdminPage.manual")}
          </button>
          <button className="tab" onClick={() => setView("file")}>
            {t("AdminPage.load")}
          </button>
        </div>
      </div>
      <div className="row second-row">
        {view === "post-reference" && (
          <>
            <div className="left-column">
              <h3 className="subtitle">{t("AdminPage.title")}</h3>
              {sectionNamesByNewReference.map(({ id, name }) => (
                <button
                  key={`post-reference-${id}`}
                  className={`pagination-button ${
                    activeSectionByNewReference === id ? "active" : ""
                  }`}
                  onClick={() => setActiveSectionByNewReference(id)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="content-container">
              <h2 className="title">{"Nueva referencia"}</h2>
              {renderSectionByNewReference()}
            </div>
          </>
        )}
        {view === "manual" && (
          <>
            <div className="left-column">
              <h3 className="subtitle">{t("AdminPage.title")}</h3>
              {sectionNames.map((name, index) => (
                <button
                  key={`manual-${index}`}
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
                <button className="button">{t("AdminPage.process")}</button>
              </div>
            )}
            <div>
              <FoodTableAdmin data={adminData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
