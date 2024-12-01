import React, { useState } from "react";
import "../assets/css/_AdminPage.css";
import Names from "../core/components/adminPage/Names";
import Case2 from "../core/components/adminPage/Case2";
import Case3 from "../core/components/adminPage/Case3";
import Case4 from "../core/components/adminPage/Case4";
import Case8 from "../core/components/adminPage/Case8";
import Case9 from "../core/components/adminPage/Case9";
import Origins from "../core/components/adminPage/Origins";
import { useTranslation } from "react-i18next";
import useNutrients,{MacroNutrient, AnyNutrient, GroupedNutrients} from "../core/components/adminPage/getters/useNutrients";
import NewMacronutrientWithComponent from "../core/components/adminPage/NewMacronutrientWithComponent";


const DataUploader: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [formData, setFormData] = useState({
    // Atributos Básicos
    nombreAlimentoEsp: "",
    nombreAlimentoPortu: "",
    nombreAlimentoEn: "",
    cientificName: "",
    origen_region: "",
    codigo: "",
    ubicacion: "",
    brand: "",
    observation: "",
    groupName: "",
    groupCode: "",
    typeName: "",
    typeCode: "",

    ingredients_es: "",
    ingredients_pt: "",
    ingredients_en: "",

    strain: "",
    subspecies: "",

    // Componentes nutricionales
    carbohidratosTotales: "",
    carbohidratosDisponibles: "",
    proteina: "",
    lipidoTotalOtroMetodo: "",
    fibraTotal: "",
    alcohol: "",
    acidosOrganicos: "",
    poliolesTotales: "",
    cenizas: "",
    acGrasosSaturados: "",
    acGrasosMonoinsat: "",
    acGrasosPolinsat: "",
    acGrasosTrans: "",
    colesterol: "",
    c18_2n6: "",
    c18_3n3: "",
    calcio: "",
    hierro: "",
    sodio: "",
    magnesio: "",
    fosforo: "",
    potasio: "",
    manganeso: "",
    zinc: "",
    cobre: "",
    selenio: "",
    vitaminaA: "",
    vitaminaRAE: "",
    vitaminaD: "",
    alfaTocoferol: "",
    tiamina: "",
    riboflavina: "",
    niacinaPreformada: "",
    vitaminaB6: "",
    vitaminaB12: "",
    vitaminaC: "",
    equivalenteFolato: "",
    salAdicion: "",
    azucarAdicion: "",
    grasaAdicion: "",
    proteinaVegetal: "",
    proteinaAnimal: "",
  });

  const{data} = useNutrients()

  const vitamins = data?.micronutrients.vitamins
  const minerals = data?.micronutrients.minerals

  const { macronutrients, macronutrientsWithComponents } = 
    data?.macronutrients.reduce<{
        macronutrients: MacroNutrient[];
        macronutrientsWithComponents: MacroNutrient[];
    }>(
        (acc, n) => {
            if ((n.components?.length ?? 0) > 0) {
                acc.macronutrientsWithComponents.push(n);
            } else {
                acc.macronutrients.push(n);
            }
            return acc;
        },
        {
            macronutrients: [],
            macronutrientsWithComponents: [],
        }
    ) ?? { macronutrients: [], macronutrientsWithComponents: [] };



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

  // Renderizar la sección activa
  const renderSection = () => {
    switch (activeSection) {
      case 1:
        return (
          <Names formData={formData} handleInputChange={handleInputChange} />
        );
      case 2:
        return (
          <Case2 formData={formData} handleInputChange={handleInputChange} />
        );
      case 3:
        return (
          <Case3 formData={formData} handleInputChange={handleInputChange} />
        );
      case 4:
        return (
          <Case4 formData={formData} handleInputChange={handleInputChange} />
        );

      case 5: // Macronutrientes
        return (
          <NewMacronutrientWithComponent macronutrientsWithComponents={macronutrientsWithComponents} />
        );
      case 8: // Minerales
        return (
          <Case8 formData={formData} handleInputChange={handleInputChange} />
        );

      case 9: // Vitaminas
        return (
          <Case9 formData={formData} handleInputChange={handleInputChange} />
        );

      case 10: // Origines
        return <Origins />;

      default:
        return null;
    }
  };

  const [view, setView] = useState<string>("manual"); // Estado para controlar el tipo de vista
  const {t} = useTranslation("global");

  const sectionNames = [
    t('Case_1.name'),
    t('Case_2.title'),
    t('Case_3.title'),
    t('Case_4.Subspecies'),
    t('Case_5.title'),
    t('Case_8.title'),
    t('Case_9.title'),
    t('Origins.title'),
  ];

  return (
    <div className="AdminPage-background data-uploader">
      <div className="row first-row">
        <div className="tabs-container">
          <button className="tab" onClick={() => setView("manual")}>{t('AdminPage.manual')}</button>
          <button className="tab" onClick={() => setView("file")}>{t('AdminPage.load')}</button>
        </div>
      </div>
      <div className="row second-row">
        {view === "manual" && (
          <>
            <div className="left-column">
              <h3 className="subtitle">{t('AdminPage.title')}</h3>
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
              <h2 className="title">{t('AdminPage.enter')}</h2>
              {renderSection()}
              <div className="section-buttons">
                <button
                  className="section-button back-button"
                  onClick={() =>
                    setActiveSection((prev) => (prev > 1 ? prev - 1 : prev))
                  } // Navegar a la sección anterior
                >
                  {t('AdminPage.back')}
                </button>
                <button
                  className="section-button next-button"
                  onClick={() =>
                    setActiveSection((prev) =>
                      prev < sectionNames.length ? prev + 1 : prev
                    )
                  } // Navegar a la siguiente sección
                >
                  {t('AdminPage.next')}
                </button>
              </div>
            </div>
          </>
        )}
        {view === "file" && (
          <div className="right-container">
            <h3 className="subtitle">{t('AdminPage.import')}</h3>
            <input
              id="fileInput" // Asegúrate de darle un id único
              className="file-input"
              type="file"
              accept=".xlsx, .xls, .csv"
            />
            <label htmlFor="fileInput" className="file-input-label">
              Seleccionar archivo
            </label>
            <p className="helper-text">
              {t('AdminPage.upload')} <strong>Excel</strong> {t('AdminPage.or')} <strong>CSV</strong> {t('AdminPage.point')}
            </p>
            <div className="button-container">
              <button className="button">{t('AdminPage.process')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUploader;
