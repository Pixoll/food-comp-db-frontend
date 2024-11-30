import React from "react";

// Definir los tipos de los props
interface VitaminsProps {
  formData: {
    vitaminaA: string;
    vitaminaRAE: string;
    vitaminaD: string;
    alfaTocoferol: string;
    tiamina: string;
    riboflavina: string;
    niacinaPreformada: string;
    vitaminaB6: string;
    vitaminaB12: string;
    vitaminaC: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const Vitamins: React.FC<VitaminsProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="section">
      <h3 className="subtitle">Vitaminas</h3>

      <div className="form-row">
        <label className="label">Vitamina A (mcg):</label>
        <input
          className="input"
          type="text"
          placeholder="Vitamina A"
          value={formData.vitaminaA}
          onChange={(e) => handleInputChange(e, "vitaminaA")}
        />
      </div>

      <div className="form-row">
        <label className="label">Vitamina RAE (mcg):</label>
        <input
          className="input"
          type="text"
          placeholder="Vitamina RAE"
          value={formData.vitaminaRAE}
          onChange={(e) => handleInputChange(e, "vitaminaRAE")}
        />
      </div>

      <div className="form-row">
        <label className="label">Vitamina D (mcg):</label>
        <input
          className="input"
          type="text"
          placeholder="Vitamina D"
          value={formData.vitaminaD}
          onChange={(e) => handleInputChange(e, "vitaminaD")}
        />
      </div>

      <div className="form-row">
        <label className="label">Alfa Tocoferol (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Alfa Tocoferol"
          value={formData.alfaTocoferol}
          onChange={(e) => handleInputChange(e, "alfaTocoferol")}
        />
      </div>

      <div className="form-row">
        <label className="label">Tiamina (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Tiamina"
          value={formData.tiamina}
          onChange={(e) => handleInputChange(e, "tiamina")}
        />
      </div>

      <div className="form-row">
        <label className="label">Riboflavina (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Riboflavina"
          value={formData.riboflavina}
          onChange={(e) => handleInputChange(e, "riboflavina")}
        />
      </div>

      <div className="form-row">
        <label className="label">Niacina Preformada (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Niacina Preformada"
          value={formData.niacinaPreformada}
          onChange={(e) => handleInputChange(e, "niacinaPreformada")}
        />
      </div>

      <div className="form-row">
        <label className="label">Vitamina B6 (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Vitamina B6"
          value={formData.vitaminaB6}
          onChange={(e) => handleInputChange(e, "vitaminaB6")}
        />
      </div>

      <div className="form-row">
        <label className="label">Vitamina B12 (mcg):</label>
        <input
          className="input"
          type="text"
          placeholder="Vitamina B12"
          value={formData.vitaminaB12}
          onChange={(e) => handleInputChange(e, "vitaminaB12")}
        />
      </div>

      <div className="form-row">
        <label className="label">Vitamina C (mg):</label>
        <input
          className="input"
          type="text"
          placeholder="Vitamina C"
          value={formData.vitaminaC}
          onChange={(e) => handleInputChange(e, "vitaminaC")}
        />
      </div>
    </div>
  );
};

export default Vitamins;
