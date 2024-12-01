import React from "react";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation("global");
  return (
    <div className="section">
      <h3 className="subtitle">{t('Case_5.title')}</h3>

      <div className="form-row">
        <label className="label">{t('Case_5.carbohydrates_T')}(g):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_5.carbohydrates_T')}
          value={formData.carbohidratosTotales}
          onChange={(e) => handleInputChange(e, "carbohidratosTotales")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_5.carbohydrates_D')}(g):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_5.carbohydrates_D')}
          value={formData.carbohidratosDisponibles}
          onChange={(e) => handleInputChange(e, "carbohidratosDisponibles")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_5.Protein')}(g):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_5.Protein')}
          value={formData.proteina}
          onChange={(e) => handleInputChange(e, "proteina")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_5.Lipid')}(Otro Método):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_5.Lipid')}
          value={formData.lipidoTotalOtroMetodo}
          onChange={(e) => handleInputChange(e, "lipidoTotalOtroMetodo")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_5.fiber_G')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_5.fiber')}
          value={formData.fibraTotal}
          onChange={(e) => handleInputChange(e, "fibraTotal")}
        />
      </div>
    </div>
  );
};

export default Macronutrients;
