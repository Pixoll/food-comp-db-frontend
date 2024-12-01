import React from "react";
import { useTranslation } from "react-i18next";

// Definir los tipos de los props
interface FatsAndFattyAcidsProps {
  formData: {
    acGrasosSaturados: string;
    acGrasosMonoinsat: string;
    acGrasosPolinsat: string;
    acGrasosTrans: string;
    colesterol: string;
    c18_2n6: string;
    c18_3n3: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const FatsAndFattyAcids: React.FC<FatsAndFattyAcidsProps> = ({ formData, handleInputChange }) => {
  const {t} = useTranslation("global");
  return (
    <div className="section">
      <h3 className="subtitle">{t('Case_7.title')}</h3>

      <div className="form-row">
        <label className="label">{t('Case_7.Saturated')} (g):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_7.Saturated')}
          value={formData.acGrasosSaturados}
          onChange={(e) => handleInputChange(e, "acGrasosSaturados")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_7.Monounsaturated')} (g):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_7.Monounsaturated')}
          value={formData.acGrasosMonoinsat}
          onChange={(e) => handleInputChange(e, "acGrasosMonoinsat")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_7.Polyunsaturated')} (g):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_7.Polyunsaturated')}
          value={formData.acGrasosPolinsat}
          onChange={(e) => handleInputChange(e, "acGrasosPolinsat")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_7.Trans')} (g):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_7.Trans')}
          value={formData.acGrasosTrans}
          onChange={(e) => handleInputChange(e, "acGrasosTrans")}
        />
      </div>

      <div className="form-row">
        <label className="label">{t('Case_7.Cholesterol')} (mg):</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_7.Cholesterol')}
          value={formData.colesterol}
          onChange={(e) => handleInputChange(e, "colesterol")}
        />
      </div>

      <div className="form-row">
        <label className="label">C18:2n6 (g):</label>
        <input
          className="input"
          type="text"
          placeholder="C18:2n6"
          value={formData.c18_2n6}
          onChange={(e) => handleInputChange(e, "c18_2n6")}
        />
      </div>

      <div className="form-row">
        <label className="label">C18:3n3 (g):</label>
        <input
          className="input"
          type="text"
          placeholder="C18:3n3"
          value={formData.c18_3n3}
          onChange={(e) => handleInputChange(e, "c18_3n3")}
        />
      </div>
    </div>
  );
};

export default FatsAndFattyAcids;
