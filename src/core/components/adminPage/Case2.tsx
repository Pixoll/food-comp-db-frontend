import React from "react";

// Define los tipos para los props
interface Case2Props {
  formData: {
    groupName: string;
    groupCode: string;
    typeName: string;
    typeCode: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const Case2: React.FC<Case2Props> = ({ formData, handleInputChange }) => {
  return (
    <div className="section">
      <h3 className="subtitle">Grupo y Tipo</h3>
      <div className="form-row">
        <label className="label">Grupo (Nombre):</label>
        <input
          className="input"
          type="text"
          placeholder="Nombre del Grupo"
          value={formData.groupName}
          onChange={(e) => handleInputChange(e, "groupName")}
        />
      </div>
      <div className="form-row">
        <label className="label">Grupo (Código):</label>
        <input
          className="input"
          type="text"
          placeholder="Código del Grupo"
          value={formData.groupCode}
          onChange={(e) => handleInputChange(e, "groupCode")}
        />
      </div>
      <div className="form-row">
        <label className="label">Tipo (Nombre):</label>
        <input
          className="input"
          type="text"
          placeholder="Nombre del Tipo"
          value={formData.typeName}
          onChange={(e) => handleInputChange(e, "typeName")}
        />
      </div>
      <div className="form-row">
        <label className="label">Tipo (Código):</label>
        <input
          className="input"
          type="text"
          placeholder="Código del Tipo"
          value={formData.typeCode}
          onChange={(e) => handleInputChange(e, "typeCode")}
        />
      </div>
    </div>
  );
};

export default Case2;
