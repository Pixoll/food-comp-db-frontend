import React from "react";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation("global");
  return (
    <div className="section">
      <h3 className="subtitle">{t('Case_6.title')}</h3>

      <div className="form-row">
        <label className="label">{t('Case_6.Alcohol')}(g):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_6.Alcohol')}
          value={formData.alcohol}
          onChange={(e) => handleInputChange(e, "alcohol")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_6.acids_T_G')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_6.acids')}
          value={formData.acidosOrganicos}
          onChange={(e) => handleInputChange(e, "acidosOrganicos")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_6.Polyols')}(g):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_6.Polyols')}
          value={formData.poliolesTotales}
          onChange={(e) => handleInputChange(e, "poliolesTotales")}
        />
      </div>
    </div>
  );
};

export default AlcoholAndSpecificCompounds;
