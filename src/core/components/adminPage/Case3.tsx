import React from "react";
import { useTranslation } from "react-i18next";
// Definir los tipos de los props
interface IngredientsProps {
  formData: {

      ingredients_es: string;
      ingredients_pt: string;
      ingredients_en: string;
    
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const Ingredients: React.FC<IngredientsProps> = ({ formData, handleInputChange }) => {
  const {t} = useTranslation("global");

  return (
    <div className="section">
      <h3 className="subtitle">{t('Case_3.title')}</h3>
      <div className="form-row">
        <label className="label">{t('Case_3.Ingredients_E')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_3.Spanish')}
          value={formData.ingredients_es}
          onChange={(e) => handleInputChange(e, "ingredients_es")}
        />
      </div>
      <div className="form-row">
        <label className="label">{t('Case_3.Ingredients_P')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_3.Portuguese')}
          value={formData.ingredients_pt}
          onChange={(e) => handleInputChange(e, "ingredients_pt")}
        />
      </div>
      <div className="form-row">
        <label className="label">{t('Case_3.Ingredients_I')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_3.English')}
          value={formData.ingredients_en}
          onChange={(e) => handleInputChange(e, "ingredients_en")}
        />
      </div>
    </div>
  );
};

export default Ingredients;
