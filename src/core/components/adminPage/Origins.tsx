import React, { useState } from "react";
import OriginSelector from "./OriginSelector";
import RegionsOrigin from "./getters/RegionsOrigin";
import ProvincesOrigin from "./getters/ProvincesOrigin";
import CommunesOrigin from "./getters/CommunesOrigin";
import LocationsOrigin from "./getters/LocationsOrigin";

const Origins: React.FC = () => {
  const regions = RegionsOrigin();
  /*const provinces = ProvincesOrigin(selectedRegion);
  const communes = CommunesOrigin(selectedProvince);
  const locations = LocationsOrigin(selectedCommune);*/

  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<number | null>(null);
  
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Región</th>
          <th>Provincia</th>
          <th>Comuna</th>
          <th>Locación</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
              <OriginSelector
                options={regions || []}
                placeholder="Selecciona una región"
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
                placeholder="Selecciona una"
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
                placeholder="Selecciona una"
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
                placeholder="Selecciona una"
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