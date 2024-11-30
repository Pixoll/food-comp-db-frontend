import React from "react";

// Definir los tipos de los props
interface AlcoholAndSpecificCompoundsProps {
  formData: {
    alcohol: string;
    acidosOrganicos: string;
    poliolesTotales: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const AlcoholAndSpecificCompounds: React.FC<AlcoholAndSpecificCompoundsProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="section">
      <h3 className="subtitle">Alcohol y Compuestos Específicos</h3>

      <div className="form-row">
        <label className="label">Alcohol (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Alcohol"
          value={formData.alcohol}
          onChange={(e) => handleInputChange(e, "alcohol")}
        />
      </div>

      <div className="form-row">
        <label className="label">Ácidos Orgánicos Totales (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Ácidos Orgánicos"
          value={formData.acidosOrganicos}
          onChange={(e) => handleInputChange(e, "acidosOrganicos")}
        />
      </div>

      <div className="form-row">
        <label className="label">Polioles Totales (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Polioles Totales"
          value={formData.poliolesTotales}
          onChange={(e) => handleInputChange(e, "poliolesTotales")}
        />
      </div>
    </div>
  );
};

export default AlcoholAndSpecificCompounds;
