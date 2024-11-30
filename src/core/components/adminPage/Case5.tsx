import React from "react";

// Definir los tipos de los props
interface MacronutrientsProps {
  formData: {
    carbohidratosTotales: string;
    carbohidratosDisponibles: string;
    proteina: string;
    lipidoTotalOtroMetodo: string;
    fibraTotal: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const Macronutrients: React.FC<MacronutrientsProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="section">
      <h3 className="subtitle">Macronutrientes</h3>

      <div className="form-row">
        <label className="label">Carbohidratos Totales (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Carbohidratos Totales"
          value={formData.carbohidratosTotales}
          onChange={(e) => handleInputChange(e, "carbohidratosTotales")}
        />
      </div>

      <div className="form-row">
        <label className="label">Carbohidratos Disponibles (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Carbohidratos Disponibles"
          value={formData.carbohidratosDisponibles}
          onChange={(e) => handleInputChange(e, "carbohidratosDisponibles")}
        />
      </div>

      <div className="form-row">
        <label className="label">Proteína (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Proteína"
          value={formData.proteina}
          onChange={(e) => handleInputChange(e, "proteina")}
        />
      </div>

      <div className="form-row">
        <label className="label">Lípido Total (Otro Método):</label>
        <input
          className="input"
          type="text"
          placeholder="Lípido Total"
          value={formData.lipidoTotalOtroMetodo}
          onChange={(e) => handleInputChange(e, "lipidoTotalOtroMetodo")}
        />
      </div>

      <div className="form-row">
        <label className="label">Fibra Alimentaria Total (g):</label>
        <input
          className="input"
          type="text"
          placeholder="Fibra Alimentaria"
          value={formData.fibraTotal}
          onChange={(e) => handleInputChange(e, "fibraTotal")}
        />
      </div>
    </div>
  );
};

export default Macronutrients;
