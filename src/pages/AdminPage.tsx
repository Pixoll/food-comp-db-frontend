import React, { useState } from "react";
import "../assets/css/_AdminPage.css";
import Case1 from "../core/components/adminPage/Case1";
import Case2 from "../core/components/adminPage/Case2";
import Case3 from "../core/components/adminPage/Case3";
import Case4 from "../core/components/adminPage/Case4";
import Case5 from "../core/components/adminPage/Case5";
import Case6 from "../core/components/adminPage/Case6";
import Case7 from "../core/components/adminPage/Case7";
import Case8 from "../core/components/adminPage/Case8";
import Case9 from "../core/components/adminPage/Case9";
import Origins from "../core/components/adminPage/Origins";


const sectionNames = [
  "Nombre",
  "Grupo y tipo",
  "Ingredientes",
  "Subespecie",
  "Macronutrientes",
  "Alcohol y Compuestos",
  "Grasas y Ácidos Grasos",
  "Minerales",
  "Vitaminas",
  "Origines",
];

const DataUploader: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [formData, setFormData] = useState({
    // Atributos Básicos
    nombreAlimentoEsp: "",
    nombreAlimentoPortu: "",
    nombreAlimentoEn: "",
    nombreCienficio: "",
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

  // Función para manejar los cambios en los inputs
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
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
        return <Case1 formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <Case2 formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <Case3 formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <Case4 formData={formData} handleInputChange={handleInputChange} />;

      case 5: // Macronutrientes
        return <Case5 formData={formData} handleInputChange={handleInputChange} />;

      case 6: // Alcohol y Compuestos Específicos
        return <Case6 formData={formData} handleInputChange={handleInputChange} />;

      case 7: // Grasas y Ácidos Grasos

        return <Case7 formData={formData} handleInputChange={handleInputChange} />;

      case 8: // Minerales
        return <Case8 formData={formData} handleInputChange={handleInputChange} />;

      case 9: // Vitaminas
        return <Case9 formData={formData} handleInputChange={handleInputChange} />;

      case 10: // Origines
        return <Origins />;

      default:
        return null;
    }
  };

  const [view, setView] = useState<string>("manual"); // Estado para controlar el tipo de vista

  return (
    <div className="AdminPage-background data-uploader">
      <div className="row first-row">
        <div className="tabs-container">
          <button className="tab" onClick={() => setView("manual")}>Ingreso Manual</button>
          <button className="tab" onClick={() => setView("file")}>Cargar desde Archivo</button>
        </div>
      </div>
      <div className="row second-row">
        {view === "manual" && (
          <>
            <div className="left-column">
              <h3 className="subtitle">Secciones</h3>
              {sectionNames.map((name, index) => (
                <button
                  key={index + 1}
                  className={`pagination-button ${activeSection === index + 1 ? "active" : ""}`}
                  onClick={() => setActiveSection(index + 1)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="content-container">
              <h2 className="title">Ingresar Datos de Alimentos</h2>
              {renderSection()}
              <div className="section-buttons">
                <button
                  className="section-button back-button"
                  onClick={() => setActiveSection(prev => prev > 1 ? prev - 1 : prev)} // Navegar a la sección anterior
                >
                  Atras
                </button>
                <button
                  className="section-button next-button"
                  onClick={() => setActiveSection(prev => prev < sectionNames.length ? prev + 1 : prev)} // Navegar a la siguiente sección
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
        {view === "file" && (
          <div className="right-container">
            <h3 className="subtitle">Importar Plantilla</h3>
            <input className="file-input" type="file" accept=".xlsx, .xls, .csv" />
            <p className="helper-text">
              Suba un archivo en formato <strong>Excel</strong> o <strong>CSV</strong>.
            </p>
            <div className="button-container">
              <button className="button">Procesar Datos</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUploader;