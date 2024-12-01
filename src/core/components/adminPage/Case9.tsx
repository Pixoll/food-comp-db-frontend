import React from "react";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation("global");
  return (
    <div className="section">
      <h3 className="subtitle">{t('Case_9.title')}</h3>

      <div className="form-row">
        <label className="label">{t('Case_9.A')} (mcg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_9.A')}
          value={formData.vitaminaA}
          onChange={(e) => handleInputChange(e, "vitaminaA")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_9.RAE')} (mcg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_9.RAE')}
          value={formData.vitaminaRAE}
          onChange={(e) => handleInputChange(e, "vitaminaRAE")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_9.D')} (mcg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_9.D')}
          value={formData.vitaminaD}
          onChange={(e) => handleInputChange(e, "vitaminaD")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_9.Tocopherol')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_9.Tocopherol')}
          value={formData.alfaTocoferol}
          onChange={(e) => handleInputChange(e, "alfaTocoferol")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_9.Thiamin')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_9.Thiamin')}
          value={formData.tiamina}
          onChange={(e) => handleInputChange(e, "tiamina")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_9.Riboflavin')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_9.Riboflavin')}
          value={formData.riboflavina}
          onChange={(e) => handleInputChange(e, "riboflavina")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_9.Niacin')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_9.Niacin')}
          value={formData.niacinaPreformada}
          onChange={(e) => handleInputChange(e, "niacinaPreformada")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_9.B6')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_9.B6')}
          value={formData.vitaminaB6}
          onChange={(e) => handleInputChange(e, "vitaminaB6")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_9.B12')} (mcg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_9.B12')}
          value={formData.vitaminaB12}
          onChange={(e) => handleInputChange(e, "vitaminaB12")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_9.C')} (mg):</label>
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
