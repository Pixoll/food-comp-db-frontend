import React, { useState } from "react";
import OriginSelector from "./OriginSelector";
import useOrigins from "./getters/useOrigins";
import { useTranslation } from "react-i18next";

const Origins: React.FC = () => {
  const { regions, provinces, communes, locations } = useOrigins();

  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedRegionName, setSelectedRegionName] = useState<string>("");

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>("");

  const [selectedCommune, setSelectedCommune] = useState<number | null>(null);
  const [selectedCommuneName, setSelectedCommuneName] = useState<string>("");

  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string>("");

  const regionOptions = Array.from(regions.values());
  
  const provincesOptions =
    selectedRegion !== null
      ? Array.from(regions.get(selectedRegion)?.provinces.values() || [])
      : Array.from(provinces.values());

  const communesOptions =
    selectedProvince !== null
      ? Array.from(provinces.get(selectedProvince)?.communes.values() || [])
      : Array.from(provinces.values())
      ? Array.from(
          regionOptions.flatMap((region) =>
            Array.from(region.provinces.values()).flatMap((province) =>
              Array.from(province.communes.values())
            )
          )
        )
      : Array.from(communes.values());

      const locationOptions =
      selectedCommune != null
        ? Array.from(communes.get(selectedCommune)?.locations.values() || [])
        : selectedProvince != null
        ? Array.from(
            provincesOptions.flatMap((province) =>
              Array.from(province.communes.values()).flatMap((commune) =>
                Array.from(commune.locations.values())
              )
            )
          )
        : Array.from(locations.values());

        const handleSelection = (
          level: "region" | "province" | "commune" | "location",
          id: number | null,
          name: string
        ) => {
          if (level === "region") {
            setSelectedRegion(id);
            setSelectedRegionName(name);
            setSelectedProvince(null);
            setSelectedProvinceName("");
            setSelectedCommune(null);
            setSelectedCommuneName("");
            setSelectedLocation(null);
            setSelectedLocationName("");

          } else if (level === "province") {
            setSelectedProvince(id);
            setSelectedProvinceName(name);
            setSelectedCommune(null);
            setSelectedCommuneName("");
            setSelectedLocation(null);
            setSelectedLocationName("");
            const parentRegion = Array.from(regions.values()).find((region) =>
              region.provinces.has(id!)
            );
            if (parentRegion) {
              setSelectedRegion(parentRegion.id);
              setSelectedRegionName(parentRegion.name);
            }
            
          } else if (level === "commune") {
            setSelectedCommune(id);
            setSelectedCommuneName(name);
            setSelectedLocation(null);
            setSelectedLocationName("");
            const parentProvince = Array.from(provinces.values()).find((province) =>
              province.communes.has(id!)
            );
            if (parentProvince) {
              setSelectedProvince(parentProvince.id);
              setSelectedProvinceName(parentProvince.name);
              const parentRegion = Array.from(regions.values()).find((region) =>
                region.provinces.has(parentProvince.id)
              );
              if (parentRegion) {
                setSelectedRegion(parentRegion.id);
                setSelectedRegionName(parentRegion.name);
              }
            }
          } else if (level === "location") {
            setSelectedLocation(id);
            setSelectedLocationName(name);
            const parentCommune = Array.from(communes.values()).find((commune) =>
              commune.locations.has(id!)
            );
            if (parentCommune) {
              setSelectedCommune(parentCommune.id);
              setSelectedCommuneName(parentCommune.name);
              const parentProvince = Array.from(provinces.values()).find((province) =>
                province.communes.has(parentCommune.id)
              );
              if (parentProvince) {
                setSelectedProvince(parentProvince.id);
                setSelectedProvinceName(parentProvince.name);
                const parentRegion = Array.from(regions.values()).find((region) =>
                  region.provinces.has(parentProvince.id)
                );
                if (parentRegion) {
                  setSelectedRegion(parentRegion.id);
                  setSelectedRegionName(parentRegion.name);
                }
              }
            }
          }
        };

  const { t } = useTranslation("global");
  return (
    <table className="table">
      <thead>
        <tr>
          <th>{t("Origins.Region")}</th>
          <th>{t("Origins.Province")}</th>
          <th>{t("Origins.Commune")}</th>
          <th>{t("Origins.Location")}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <OriginSelector
              options={regionOptions}
              placeholder="Nada seleccionado"
              selectedValue={selectedRegionName}
              onSelect={(id, name) => handleSelection("region", id, name)}
            />
          </td>
          <td>
            <OriginSelector
              options={provincesOptions}
              placeholder="Nada seleccionado"
              selectedValue={selectedProvinceName}
              onSelect={(id, name) => handleSelection("province", id, name)}
            />
          </td>
          <td>
            <OriginSelector
              options={communesOptions}
              placeholder="Nada seleccionado"
              selectedValue={selectedCommuneName}
              onSelect={(id, name) => handleSelection("commune", id, name)}
            />
          </td>
          <td>
            <OriginSelector
              options={locationOptions}
              placeholder="Nada seleccionado"
              selectedValue={selectedLocationName}
              onSelect={(id, name) => handleSelection("location", id, name)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Origins;
