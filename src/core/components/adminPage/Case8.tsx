import React from "react";

// Definir los tipos de los props
interface MineralsProps {
  formData: {
    calcio: string;
    hierro: string;
    sodio: string;
    magnesio: string;
    fosforo: string;
    potasio: string;
    manganeso: string;
    zinc: string;
    cobre: string;
    selenio: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const Minerals: React.FC<MineralsProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="section">
      <h3 className="subtitle">Minerales</h3>

      <div className="form-row">
        <label className="label">Calcio (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Calcio"
          value={formData.calcio}
          onChange={(e) => handleInputChange(e, "calcio")}
        />
      </div>

      <div className="form-row">
        <label className="label">Hierro (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Hierro"
          value={formData.hierro}
          onChange={(e) => handleInputChange(e, "hierro")}
        />
      </div>

      <div className="form-row">
        <label className="label">Sodio (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Sodio"
          value={formData.sodio}
          onChange={(e) => handleInputChange(e, "sodio")}
        />
      </div>

      <div className="form-row">
        <label className="label">Magnesio (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Magnesio"
          value={formData.magnesio}
          onChange={(e) => handleInputChange(e, "magnesio")}
        />
      </div>

      <div className="form-row">
        <label className="label">Fósforo (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Fósforo"
          value={formData.fosforo}
          onChange={(e) => handleInputChange(e, "fosforo")}
        />
      </div>

      <div className="form-row">
        <label className="label">Potasio (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Potasio"
          value={formData.potasio}
          onChange={(e) => handleInputChange(e, "potasio")}
        />
      </div>

      <div className="form-row">
        <label className="label">Manganeso (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Manganeso"
          value={formData.manganeso}
          onChange={(e) => handleInputChange(e, "manganeso")}
        />
      </div>

      <div className="form-row">
        <label className="label">Zinc (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Zinc"
          value={formData.zinc}
          onChange={(e) => handleInputChange(e, "zinc")}
        />
      </div>

      <div className="form-row">
        <label className="label">Cobre (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Cobre"
          value={formData.cobre}
          onChange={(e) => handleInputChange(e, "cobre")}
        />
      </div>

      <div className="form-row">
        <label className="label">Selenio (mcg):</label>
        <input
          className="input"
          type="text"
          placeholder="Selenio"
          value={formData.selenio}
          onChange={(e) => handleInputChange(e, "selenio")}
        />
      </div>
    </div>
  );
};

export default Minerals;
