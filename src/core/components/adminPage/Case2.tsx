import React from "react";
import { useTranslation } from "react-i18next";
// Define los tipos para los props
interface Case2Props {
  formData: {
    groupName: string;
    groupCode: string;
    typeName: string;
    typeCode: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const Case2: React.FC<Case2Props> = ({ formData, handleInputChange }) => {
  const {t} = useTranslation("global");
  return (
    <div className="section">
      <h3 className="subtitle">{t('Case_2.title')} </h3>
      <div className="form-row">
        <label className="label">{t('Case_2.group_name')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_2.name_G')}
          value={formData.groupName}
          onChange={(e) => handleInputChange(e, "groupName")}
        />
      </div>
      <div className="form-row">
        <label className="label">{t('Case_2.group_code')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_2.code_G')}
          value={formData.groupCode}
          onChange={(e) => handleInputChange(e, "groupCode")}
        />
      </div>
      <div className="form-row">
        <label className="label">{t('Case_2.type_name')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_2.name_T')}
          value={formData.typeName}
          onChange={(e) => handleInputChange(e, "typeName")}
        />
      </div>
      <div className="form-row">
        <label className="label">{t('Case_2.type_code')}</label>
        <input
          className="input"
          type="text"
          placeholder={t('Case_2.code_T')}
          value={formData.typeCode}
          onChange={(e) => handleInputChange(e, "typeCode")}
        />
      </div>
    </div>
  );
};

export default Case2;
