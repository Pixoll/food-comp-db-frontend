import { useEffect, useState } from "react";
import "../assets/css/_AdminPage.css";
import { useTranslation } from "react-i18next";
import {
  FoodsFromCsv,
  NewArticle,
  NewArticleByReference,
  NewAuthors,
  NewGeneralData,
  NewLangualCode,
  NewMacronutrientWithComponent,
  NewNutrients,
  NewReference,
  NewReferences,
  Origins,
  PreviewDataForm,
  PreviewNewReference,
  RecursivePartial,
  ReferenceForm,
} from "../core/components/adminPage";
import {
  AnyNutrient,
  Author,
  MacroNutrient,
  useGroups,
  useLanguages,
  useLangualCodes,
  useNutrients,
  useOrigins,
  useReferences,
  useScientificNames,
  useSubspecies,
  useTypes,
} from "../core/hooks";
import { Origin } from "../core/types/SingleFoodResult";

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
  const { references, authors, cities, journals, journalVolumes, articles, forceReload } = useReferences();

  const [referenceForm, setReferenceForm] = useState<ReferenceForm>({
    code: 0,
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

  if (!referenceForm.code && references) {
    const newCode = Math.max(...(references?.map(r => r.code) ?? [])) + 1;
    setReferenceForm(previous => ({
      ...previous,
      code: newCode,
    }));
    referenceForm.code = newCode;
  }

  const handleResetReferenceForm = (nextCode: number) => {
    setReferenceForm({
      code: nextCode,
      type: "article",
      title: "",
    });
  };

  const { nutrients, energy, macronutrients, vitamins, minerals } = useNutrients();
  const groups = useGroups();
  const types = useTypes();
  const scientificNames = useScientificNames();
  const subspecies = useSubspecies();
  const languages = useLanguages();
  const langualCodes = useLangualCodes();

  const nameAndIdNutrients = nutrients.map<NutrientSummary>(n => n);

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
    if (energy.size > 0 && macronutrients.size > 0 && vitamins.size > 0 && minerals.size > 0) {
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
          energy: energy.map((macronutrient: MacroNutrient) => ({
            nutrientId: macronutrient.id,
            referenceCodes: [],
          })),
          mainNutrients: macronutrients.map((m) =>
            (m.components?.length ?? 0) > 0
              ? mapMacroNutrientWithComponentsToForm(m)
              : {
                ...mapMacroNutrientWithoutComponentsToForm(m),
                components: [],
              }
          ),
          micronutrients: {
            vitamins: vitamins.map(
              (vitamin: AnyNutrient) => ({
                nutrientId: vitamin.id,
                referenceCodes: [],
              })
            ),
            minerals: minerals.map(
              (mineral: AnyNutrient) => ({
                nutrientId: mineral.id,
                referenceCodes: [],
              })
            ),
          },
        },
      };

      setFormData(initialFormData);
    }
  }, [energy, macronutrients, vitamins, minerals]);

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
            groups={groups.idToObject.map(o => o)}
            languages={languages.map(o => o)}
            scientificNames={scientificNames.idToObject.map(o => o)}
            subspecies={subspecies.idToObject.map(o => o)}
            types={types.idToObject.map(o => o)}
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
          <NewLangualCode
            langualCodes={langualCodes.map(v => v)}
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
            types={types.idToObject.map(o => o)}
            groups={groups.idToObject.map(o => o)}
            langualCodes={langualCodes.map(v => v)}
            scientificNames={scientificNames.idToObject.map(o => o)}
            subspecies={subspecies.idToObject.map(o => o)}
          />
        );
      default:
        return null;
    }
  };

  const [view, setView] = useState<string>("manual");
  const { t } = useTranslation();

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
  let sectionNamesByNewReference: Section[];

  if (referenceForm.type === "article") {
    sectionNamesByNewReference = [
      { id: "general", name: t("AdminPage.sectionNamesByNewReference.Data") },
      { id: "authors", name: t("AdminPage.sectionNamesByNewReference.Authors") },
      { id: "article", name: t("AdminPage.sectionNamesByNewReference.Article") },
      { id: "preview", name: t("AdminPage.sectionNamesByNewReference.Preview") },
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
            code={referenceForm.code}
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
            forceReload={forceReload}
            handleResetReferenceForm={handleResetReferenceForm}
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
          <FoodsFromCsv/>
        )}
      </div>
    </div>
  );
}
