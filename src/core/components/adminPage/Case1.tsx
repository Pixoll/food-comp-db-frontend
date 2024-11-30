import React from "react";

// Define los tipos para los props
interface Case1Props {
  formData: {
    nombreAlimentoEsp: string;
    nombreAlimentoPortu: string;
    nombreAlimentoEn: string;
    // Añadir otros campos según sea necesario
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const Case1: React.FC<Case1Props> = ({ formData, handleInputChange }) => {
  return (
    <div className="section">
      <h3 className="subtitle">Atributos Básicos</h3>
      <div className="form-row">
        <label className="label">Nombre alimento (Español):</label>
        <input
          className="input"
          type="text"
          placeholder="Nombre en Español"
          value={formData.nombreAlimentoEsp}
          onChange={(e) => handleInputChange(e, "nombreAlimentoEsp")}
        />
      </div>
      <div className="form-row">
        <label className="label">Nombre alimento (Portugués):</label>
        <input
          className="input"
          type="text"
          placeholder="Nombre en Portugués"
          value={formData.nombreAlimentoPortu}
          onChange={(e) => handleInputChange(e, "nombreAlimentoPortu")}
        />
      </div>
      <div className="form-row">
        <label className="label">Nombre alimento (Inglés):</label>
        <input
          className="input"
          type="text"
          placeholder="Nombre en Inglés"
          value={formData.nombreAlimentoEn}
          onChange={(e) => handleInputChange(e, "nombreAlimentoEn")}
        />
      </div>
      {/* Agregar más campos de "Atributos Básicos" aquí */}
    </div>
  );
};

export default Case1;
