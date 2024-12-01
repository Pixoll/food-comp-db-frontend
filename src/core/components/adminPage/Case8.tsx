import React from "react";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation("global");
  return (
    <div className="section">
      <h3 className="subtitle">{t('Case_8.title')}</h3>

      <div className="form-row">
        <label className="label">{t('Case_8.Calcium')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_8.Calcium')}
          value={formData.calcio}
          onChange={(e) => handleInputChange(e, "calcio")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_8.Iron')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_8.Iron')}
          value={formData.hierro}
          onChange={(e) => handleInputChange(e, "hierro")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_8.Sodium')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_8.Sodium')}
          value={formData.sodio}
          onChange={(e) => handleInputChange(e, "sodio")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_8.Magnesium')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_8.Magnesium')}
          value={formData.magnesio}
          onChange={(e) => handleInputChange(e, "magnesio")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_8.Phosphorus')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_8.Phosphorus')}
          value={formData.fosforo}
          onChange={(e) => handleInputChange(e, "fosforo")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_8.Potassium')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_8.Potassium')}
          value={formData.potasio}
          onChange={(e) => handleInputChange(e, "potasio")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_8.Manganese')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_8.Manganese')}
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
        <label className="label">{t('Case_8.Copper')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_8.Copper')}
          value={formData.cobre}
          onChange={(e) => handleInputChange(e, "cobre")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_8.Selenium')} (mcg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_8.Selenium')}
          value={formData.selenio}
          onChange={(e) => handleInputChange(e, "selenio")}
        />
      </div>
    </div>
  );
};

export default Minerals;
