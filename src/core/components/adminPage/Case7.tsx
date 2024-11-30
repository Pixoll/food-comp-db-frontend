import React from "react";

// Definir los tipos de los props
interface FatsAndFattyAcidsProps {
  formData: {
    acGrasosSaturados: string;
    acGrasosMonoinsat: string;
    acGrasosPolinsat: string;
    acGrasosTrans: string;
    colesterol: string;
    c18_2n6: string;
    c18_3n3: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const FatsAndFattyAcids: React.FC<FatsAndFattyAcidsProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="section">
      <h3 className="subtitle">Grasas y Ácidos Grasos</h3>

      <div className="form-row">
        <label className="label">Ácidos Grasos Saturados (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Ácidos Grasos Saturados"
          value={formData.acGrasosSaturados}
          onChange={(e) => handleInputChange(e, "acGrasosSaturados")}
        />
      </div>

      <div className="form-row">
        <label className="label">Ácidos Grasos Monoinsaturados (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Ácidos Grasos Monoinsaturados"
          value={formData.acGrasosMonoinsat}
          onChange={(e) => handleInputChange(e, "acGrasosMonoinsat")}
        />
      </div>

      <div className="form-row">
        <label className="label">Ácidos Grasos Poliinsaturados (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Ácidos Grasos Poliinsaturados"
          value={formData.acGrasosPolinsat}
          onChange={(e) => handleInputChange(e, "acGrasosPolinsat")}
        />
      </div>

      <div className="form-row">
        <label className="label">Ácidos Grasos Trans (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Ácidos Grasos Trans"
          value={formData.acGrasosTrans}
          onChange={(e) => handleInputChange(e, "acGrasosTrans")}
        />
      </div>

      <div className="form-row">
        <label className="label">Colesterol (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Colesterol"
          value={formData.colesterol}
          onChange={(e) => handleInputChange(e, "colesterol")}
        />
      </div>

      <div className="form-row">
        <label className="label">C18:2n6 (g):</label>
        <input
          className="input"
          type="text"
          placeholder="C18:2n6"
          value={formData.c18_2n6}
          onChange={(e) => handleInputChange(e, "c18_2n6")}
        />
      </div>

      <div className="form-row">
        <label className="label">C18:3n3 (g):</label>
        <input
          className="input"
          type="text"
          placeholder="C18:3n3"
          value={formData.c18_3n3}
          onChange={(e) => handleInputChange(e, "c18_3n3")}
        />
      </div>
    </div>
  );
};

export default FatsAndFattyAcids;
