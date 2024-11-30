import React from "react";

// Definir los tipos de los props
interface SubspeciesAndStrainProps {
  formData: {
    subspecies: string;
    strain: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const SubspeciesAndStrain: React.FC<SubspeciesAndStrainProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="section">
      <h3 className="subtitle">Subespecie y Strain</h3>
      <div className="form-row">
        <label className="label">Subespecie:</label>
        <input
          className="input"
          type="text"
          placeholder="Subespecie"
          value={formData.subspecies}
          onChange={(e) => handleInputChange(e, "subspecies")}
        />
      </div>
      <div className="form-row">
        <label className="label">Strain:</label>
        <input
          className="input"
          type="text"
          placeholder="Strain"
          value={formData.strain}
          onChange={(e) => handleInputChange(e, "strain")}
        />
      </div>
    </div>
  );
};

export default SubspeciesAndStrain;
