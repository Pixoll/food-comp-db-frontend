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

import { Origin } from "../core/types/SingleFoodResult";
import NewLangualCodes from "../core/components/adminPage/NewLangualCode";
import NewReferences from "../core/components/adminPage/NewReferences";
import NewReference from "../core/components/adminPage/NewReference";
import NewAuthors from "../core/components/adminPage/NewAuthors";
import NewArticleByReference, {
  RecursivePartial,
} from "../core/components/adminPage/NewArticleByReference";
import FoodTableAdmin from "../core/components/adminPage/FoodTableAdmin";
import {
  ReferenceForm,
  NewArticle,
} from "../core/components/adminPage/NewReference";
import PreviewNewReference from "../core/components/adminPage/PreviewNewReference";
import useLanguages from "../core/components/adminPage/getters/useLanguages";
import useGroups from "../core/components/adminPage/getters/useGroups";
import useScientificNames from "../core/components/adminPage/getters/useScientificNames";
import useSubspecies from "../core/components/adminPage/getters/useSubspecies";
import useTypes from "../core/components/adminPage/getters/useTypes";
import useOrigins from "../core/components/adminPage/getters/useOrigins";
import useReferences, {
  Author,
} from "../core/components/adminPage/getters/UseReferences";
import useLangualCodes from "../core/components/adminPage/getters/useLangualCodes";

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
  referenceCodes: [],
  components:
    macronutrient.components?.map((component) => ({
      nutrientId: component.id,
      referenceCodes: [],
    })) || [],
});

export type NutrientMeasurementForm = {
  nutrientId: number;
  average?: number;
  deviation?: number;
  min?: number;
  max?: number;
  sampleSize?: number;
  dataType?: "analytic" | "calculated" | "assumed" | "borrowed";
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
  scientificNameId?: number;
  subspeciesId?: number;
  groupId?: number;
  typeId?: number;
  commonName: Record<"es", string> &
    Partial<Record<"en" | "pt", string | null>>;
  ingredients: Partial<Record<"es" | "en" | "pt", string | null>>;
  origins: number[];
  langualCodes: number[];
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

  const handleUpdateNewArticle = (
    updatedArticle: RecursivePartial<NewArticle>
  ) => {
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
      scientificNameId: undefined,
      subspeciesId: undefined,
      groupId: undefined,
      typeId: undefined,
      origins: [...new Set(origins?.map((o) => o.id))],
      langualCodes: [],
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

  const groupsResult = useGroups();
  const typesResult = useTypes();
  const scientificNamesResult = useScientificNames();
  const subspeciesResult = useSubspecies();
  const languagesResult = useLanguages();
  const langualCodesResult = useLangualCodes();
  const groups =
    groupsResult.status === FetchStatus.Success ? groupsResult.data : [];
  const types =
    typesResult.status === FetchStatus.Success ? typesResult.data : [];
  const languages =
    languagesResult.status === FetchStatus.Success ? languagesResult.data : [];

  const scientificNames =
    scientificNamesResult.status === FetchStatus.Success
      ? scientificNamesResult.data
      : [];
  const subspecies =
    subspeciesResult.status === FetchStatus.Success
      ? subspeciesResult.data
      : [];
  const nameAndIdNutrients: NutrientSummary[] = [];

  const langualCodes =
    langualCodesResult.status === FetchStatus.Success
      ? langualCodesResult.data
      : [];
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
  const handleReferences = (updatedData: Partial<NutrientsValueForm>) => {
    setFormData((prev) => ({
      ...prev,
      nutrientsValueForm: {
        ...prev.nutrientsValueForm,
        ...updatedData,
      },
    }));
  };
  const handleLangualCodes = (updatedLangualCodeId: number) => {
    setFormData((prev) => {
      const alreadySelected =
        prev.generalData.langualCodes.includes(updatedLangualCodeId);

      return {
        ...prev,
        generalData: {
          ...prev.generalData,
          langualCodes: alreadySelected
            ? prev.generalData.langualCodes.filter(
                (id) => id !== updatedLangualCodeId
              )
            : [...prev.generalData.langualCodes, updatedLangualCodeId],
        },
      };
    });
  };

  useEffect(() => {
    if (nutrients) {
      const initialFormData: FoodForm = {
        generalData: {
          code: "",
          commonName: {
            es: "",
          },
          ingredients: {},
          scientificNameId: undefined,
          subspeciesId: undefined,
          groupId: undefined,
          typeId: undefined,
          origins: [...new Set(origins?.map((o) => o.id))],
          langualCodes: [],
        },
        nutrientsValueForm: {
          energy:
            nutrients.macronutrients
              ?.filter((macronutrient: MacroNutrient) => macronutrient.isEnergy)
              .map((macronutrient: MacroNutrient) => ({
                nutrientId: macronutrient.id,
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
                  referenceCodes: [],
                })
              ) || [],
            minerals:
              nutrients.micronutrients?.minerals?.map(
                (mineral: AnyNutrient) => ({
                  nutrientId: mineral.id,
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
          <NewGeneralData
            data={formData.generalData}
            onUpdate={handleUpdate}
            groups={groups}
            languages={languages}
            scientificNames={scientificNames}
            subspecies={subspecies}
            types={types}
          />
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
            onSelectReferenceForNutrients={handleReferences}
          />
        );
      case 9:
        return (
          <NewLangualCodes
            langualCodes={langualCodes}
            onLangualCodesChange={handleLangualCodes}
            selectedLangualCodes={formData.generalData.langualCodes}
          />
        );
      case 10:
        return (
          <PreviewDataForm
            data={formData}
            nameAndIdNutrients={nameAndIdNutrients}
            origins={origins?.map((o) => o.name) || []}
            types={types}
            groups={groups}
            langualCodes={langualCodes}
            scientificNames={scientificNames}
            subspecies={subspecies}
          />
        );
      default:
        return null;
    }
  };

  const [view, setView] = useState<string>("manual");
  const { t } = useTranslation("global");

  const sectionNames = [
    t("AdminPage.sectionNames.data"),
    t("AdminPage.sectionNames.value"),
    t("AdminPage.sectionNames.compound"),
    t("AdminPage.sectionNames.non_compounded"),
    t("AdminPage.sectionNames.vitamins"),
    t("AdminPage.sectionNames.minerals"),
    t("AdminPage.sectionNames.origins"),
    t("AdminPage.sectionNames.references"),
    t("AdminPage.sectionNames.codes"),
    t("AdminPage.sectionNames.view"),
  ];
  let sectionNamesByNewReference: Section[] = [];

  if (referenceForm.type === "article") {
    sectionNamesByNewReference = [
      { id: "general", name: t("AdminPage.sectionNamesByNewReference.Data")},
      { id: "authors", name: t("AdminPage.sectionNamesByNewReference.Authors") },
      { id: "article", name: t("AdminPage.sectionNamesByNewReference.Article") },
      { id: "preview", name: t("AdminPage.sectionNamesByNewReference.Preview")},
    ];
  } else {
    sectionNamesByNewReference = [
      { id: "general", name: t("AdminPage.sectionNamesByNewReference.Data") },
      { id: "authors", name: t("AdminPage.sectionNamesByNewReference.Authors") },
      { id: "preview", name: t("AdminPage.sectionNamesByNewReference.Preview") },
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
          {t("AdminPage.Enter_New_R")}
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
              <h2 className="title">{t("AdminPage.New_R")}</h2>
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
