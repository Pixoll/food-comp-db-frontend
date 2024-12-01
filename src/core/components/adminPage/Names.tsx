import React from "react";
import { useTranslation } from "react-i18next";
import useNutrients from "./getters/useNutrients";
// Define los tipos para los props
interface Case1Props {
  formData: {
    nombreAlimentoEsp: string;
    nombreAlimentoPortu: string;
    nombreAlimentoEn: string;
    cientificName: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const Names: React.FC<Case1Props> = ({ formData, handleInputChange }) => {
  const {t} = useTranslation("global");
  const{data: newNutrients} = useNutrients();
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
      <div className="form-row">
        <label className="label">{"Nombre Cientifico del alimento"}</label>
        <input
          className="input"
          type="text"
          placeholder={"Nombre cientifico"}
          value={formData.cientificName}
          onChange={(e) => handleInputChange(e, "nombreAlimentoEn")}
        />
      </div>
    </div>
  );
};

export default Names;
