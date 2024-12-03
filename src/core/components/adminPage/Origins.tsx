import React, { useState } from "react";
import OriginSelector from "./OriginSelector";
import RegionsOrigin from "./getters/RegionsOrigin";
import ProvincesOrigin from "./getters/ProvincesOrigin";
import CommunesOrigin from "./getters/CommunesOrigin";
import LocationsOrigin from "./getters/LocationsOrigin";
import { useTranslation } from "react-i18next";

const Origins: React.FC = () => {
  const regions = RegionsOrigin();
  /*const provinces = ProvincesOrigin(selectedRegion);
  const communes = CommunesOrigin(selectedProvince);
  const locations = LocationsOrigin(selectedCommune);*/

  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<number | null>(null);
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
                options={regions || []}
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
                options={regions || []}
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
                options={regions || []}
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
                options={regions || []}
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
