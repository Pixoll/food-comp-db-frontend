import React from "react";
import OriginSelector from "./OriginSelector";
import { useTranslation } from "react-i18next";
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
  const {t} = useTranslation("global");
  return (
    <div className="section">
      <h3 className="subtitle">{t('Case_1.title')}</h3>
      <div className="form-row">
        <label className="label">{t('Case_1.food_E')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_1.Spanish')}
          value={formData.nombreAlimentoEsp}
          onChange={(e) => handleInputChange(e, "nombreAlimentoEsp")}
        />
      </div>
      <div className="form-row">
        <label className="label">{t('Case_1.food_P')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_1.Portuguese')}
          value={formData.nombreAlimentoPortu}
          onChange={(e) => handleInputChange(e, "nombreAlimentoPortu")}
        />
      </div>
      <div className="form-row">
        <label className="label">{t('Case_1.food_I')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_1.English')}
          value={formData.nombreAlimentoEn}
          onChange={(e) => handleInputChange(e, "nombreAlimentoEn")}
        />
      </div>
    </div>
  );
};

export default Case1;
