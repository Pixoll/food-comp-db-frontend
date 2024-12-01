import React from "react";
import { useTranslation } from "react-i18next";

// Definir los tipos de los props
interface SubspeciesAndStrainProps {
  formData: {
    subspecies: string;
    strain: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const SubspeciesAndStrain: React.FC<SubspeciesAndStrainProps> = ({ formData, handleInputChange }) => {
  const {t} = useTranslation("global");

  return (
    <div className="section">
      <h3 className="subtitle">{t('Case_4.title')}</h3>
      <div className="form-row">
        <label className="label">{t('Case_4.Subspecies')}:</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_4.Subspecies')}
          value={formData.subspecies}
          onChange={(e) => handleInputChange(e, "subspecies")}
        />
      </div>
      <div className="form-row">
        <label className="label">{t('Case_4.strain')}:</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_4.strain')}
          value={formData.strain}
          onChange={(e) => handleInputChange(e, "strain")}
        />
      </div>
    </div>
  );
};

export default SubspeciesAndStrain;
