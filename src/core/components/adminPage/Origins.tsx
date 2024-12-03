import React, { useState } from "react";
import OriginSelector from "./OriginSelector";
import useOrigins from "./getters/useOrigins";
import { useTranslation } from "react-i18next";

const Origins: React.FC = () => {
  const { regions, provinces, communes, locations } = useOrigins();

  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<number | null>(null);
  const handleRegions = () =>{

  }
  
  const {t} = useTranslation("global");
  return (
    <table className="table">
      <thead>
        <tr>
          <th>{t('Origins.Region')}</th>
          <th>{t('Origins.Province')}</th>
          <th>{t('Origins.Commune')}</th>
          <th>{t('Origins.Location')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
              <OriginSelector
                options={}
                placeholder={t('Origins.select_region')}
                selectedValue=""
                onSelect={(id) => {
                  setSelectedRegion(id);
                  setSelectedProvince(null);
                  setSelectedCommune(null);
                }}
              />
          </td>
          <td>
              <OriginSelector
                options={origins}
                placeholder={t('Origins.select')}
                selectedValue=""
                onSelect={(id) => {
                  setSelectedRegion(id);
                  setSelectedProvince(null);
                  setSelectedCommune(null);
                }}
              />
          </td>
          <td>
              <OriginSelector
                options={origins}
                placeholder={t('Origins.select')}
                selectedValue=""
                onSelect={(id) => {
                  setSelectedRegion(id);
                  setSelectedProvince(null);
                  setSelectedCommune(null);
                }}
              />
          </td>
          <td>
              <OriginSelector
                options={origins}
                placeholder={t('Origins.select')}
                selectedValue=""
                onSelect={(id) => {
                  setSelectedRegion(id);
                  setSelectedProvince(null);
                  setSelectedCommune(null);
                }}
              />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Origins;
