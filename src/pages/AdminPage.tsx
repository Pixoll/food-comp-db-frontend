import React, { useState } from "react";
import "../assets/css/_AdminPage.css";

const DataUploader: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(1); // Estado para controlar la sección activa

  const renderSection = () => {
    switch (activeSection) {
      case 1:
        return (
          <div className="section">
            <h3 className="subtitle">Sección 1</h3>
            <div className="form-row">
              <label className="label">Nombre alimento:</label>
              <input className="input" type="text" placeholder="Nombre" />
            </div>
            <div className="form-row">
              <label className="label">TEXTO EJEMPLO:</label>
              <input className="input" type="email" placeholder="Correo" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="section">
            <h3 className="subtitle">Sección 2</h3>
            <div className="form-row">
              <label className="label">Cantidad:</label>
              <input className="input" type="number" placeholder="Cantidad" />
            </div>
            <div className="form-row">
              <label className="label">Descripción:</label>
              <input className="input" type="text" placeholder="Descripción" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="section">
            <h3 className="subtitle">Sección 3</h3>
            <div className="form-row">
              <label className="label">Precio:</label>
              <input className="input" type="number" placeholder="Precio" />
            </div>
            <div className="form-row">
              <label className="label">Categoría:</label>
              <input className="input" type="text" placeholder="Categoría" />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="section">
            <h3 className="subtitle">Sección 4</h3>
            <div className="form-row">
              <label className="label">Código:</label>
              <input className="input" type="text" placeholder="Código" />
            </div>
            <div className="form-row">
              <label className="label">Ubicación:</label>
              <input className="input" type="text" placeholder="Ubicación" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="section">
            <h3 className="subtitle">AGREGAR ALIMENTO A LA BASE</h3>

            
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="AdminPage-background data-uploader">
      {/* Contenedor para botones, contenido y formulario */}
      <div className="left-column">
        {/* Botones de navegación como columna */}
        <h3 className="subtitle">Secciones</h3>
        {[1, 2, 3, 4, 5].map((section) => (
          <button
            key={section}
            className={`pagination-button ${activeSection === section ? "active" : ""}`}
            onClick={() => setActiveSection(section)}
          >
            Sección {section}
          </button>
        ))}
      </div>

      {/* Contenedor principal */}
      <div className="content-container">
        <h2 className="title">Ingresar Alimentos</h2>
        {renderSection()}
      </div>

      {/* Formulario para importar plantillas */}
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
    </div>
  );
};

export default DataUploader;
