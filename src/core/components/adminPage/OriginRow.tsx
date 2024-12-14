import React, { useState} from "react";
import OriginSelector from "./OriginSelector";
import { useTranslation } from "react-i18next";
import { Region, Province, Commune, Location } from "./getters/useOrigins";
import { Collection } from "../../utils/collection";

type OriginRowProps = {
  data: {
    regions: Collection<number, Region>;
    provinces: Collection<number, Province>;
    communes: Collection<number, Commune>;
    locations: Collection<number, Location>;
  };
  onAddressChange: (address: string) => void;
  onIdChange: (id: number | null, index: number) => void;
  index: number;
  initialId: number;
};

const OriginRow: React.FC<OriginRowProps> = ({
  data,
  onAddressChange,
  onIdChange,
  index,
  initialId,
}) => {
  const { regions, provinces, communes, locations } = data;

  const location = locations.get(initialId);
  const commune = communes.get(location?.parent.id ?? initialId);
  const province = provinces.get(commune?.parent.id ?? initialId);
  const region = regions.get(province?.parent.id ?? initialId);
  
  const [selectedRegion, setSelectedRegion] = useState<number | null>(region?.id ?? null);
  const [selectedRegionName, setSelectedRegionName] = useState<string>(region?.name ?? "");

  const [selectedProvince, setSelectedProvince] = useState<number | null>(province?.id ?? null);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>(province?.name ?? "");

  const [selectedCommune, setSelectedCommune] = useState<number | null>(commune?.id ?? null);
  const [selectedCommuneName, setSelectedCommuneName] = useState<string>(commune?.name ?? "");

  const [selectedLocation, setSelectedLocation] = useState<number | null>(location?.id ?? null);
  const [selectedLocationName, setSelectedLocationName] = useState<string>(location?.name ?? "");

  const regionOptions = Array.from(regions.values());
  
  const { t } = useTranslation("global");

  const notifyIdsChange = (
    updatedSelectedLocation: number | null,
    updatedSelectedCommune: number | null,
    updatedSelectedProvince: number | null,
    updatedSelectedRegion: number | null
  ) => {
    const selectedId =
      updatedSelectedLocation ??
      updatedSelectedCommune ??
      updatedSelectedProvince ??
      updatedSelectedRegion ??
      null;
    onIdChange(selectedId, index);
  };

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
        let regionName = selectedRegionName;
        let provinceName = selectedProvinceName;
        let communeName = selectedCommuneName;
        let locationName = selectedLocationName;
      
        let updatedSelectedRegion = selectedRegion;
        let updatedSelectedProvince = selectedProvince;
        let updatedSelectedCommune = selectedCommune;
        let updatedSelectedLocation = selectedLocation;
      
        if (level === "region") {
          if (id === null) {
            updatedSelectedRegion = null;
            updatedSelectedProvince = null;
            updatedSelectedCommune = null;
            updatedSelectedLocation = null;
            setSelectedRegion(null);
            setSelectedProvince(null);
            setSelectedCommune(null);
            setSelectedLocation(null);
            setSelectedRegionName("");
            setSelectedProvinceName("");
            setSelectedCommuneName("");
            setSelectedLocationName("");
            regionName = "";
            provinceName = "";
            communeName = "";
            locationName = "";
          } else {
            updatedSelectedRegion = id;
            setSelectedRegion(id);
            setSelectedRegionName(name);
            setSelectedProvince(null);
            setSelectedProvinceName("");
            setSelectedCommune(null);
            setSelectedCommuneName("");
            setSelectedLocation(null);
            setSelectedLocationName("");
            regionName = name;
            provinceName = "";
            communeName = "";
            locationName = "";
          }
        } else if (level === "province") {
          if (id === null) {
            updatedSelectedProvince = null;
            updatedSelectedCommune = null;
            updatedSelectedLocation = null;
            setSelectedProvince(null);
            setSelectedCommune(null);
            setSelectedLocation(null);
            setSelectedProvinceName("");
            setSelectedCommuneName("");
            setSelectedLocationName("");
            provinceName = "";
            communeName = "";
            locationName = "";
          } else {
            updatedSelectedProvince = id;
            setSelectedProvince(id);
            setSelectedProvinceName(name);
            setSelectedCommune(null);
            setSelectedCommuneName("");
            setSelectedLocation(null);
            setSelectedLocationName("");
            provinceName = name;
            communeName = "";
            locationName = "";
      
            const parentRegion = Array.from(regions.values()).find((region) =>
              region.provinces.has(id!)
            );
            if (parentRegion) {
              updatedSelectedRegion = parentRegion.id;
              setSelectedRegion(parentRegion.id);
              setSelectedRegionName(parentRegion.name);
              regionName = parentRegion.name;
            }
          }
        } else if (level === "commune") {
          if (id === null) {
            updatedSelectedCommune = null;
            updatedSelectedLocation = null;
            setSelectedCommune(null);
            setSelectedLocation(null);
            setSelectedCommuneName("");
            setSelectedLocationName("");
            communeName = "";
            locationName = "";
          } else {
            updatedSelectedCommune = id;
            setSelectedCommune(id);
            setSelectedCommuneName(name);
            setSelectedLocation(null);
            setSelectedLocationName("");
            communeName = name;
            locationName = "";
      
            const parentProvince = Array.from(provinces.values()).find((province) =>
              province.communes.has(id!)
            );
            if (parentProvince) {
              updatedSelectedProvince = parentProvince.id;
              setSelectedProvince(parentProvince.id);
              setSelectedProvinceName(parentProvince.name);
              provinceName = parentProvince.name;
      
              const parentRegion = Array.from(regions.values()).find((region) =>
                region.provinces.has(parentProvince.id)
              );
              if (parentRegion) {
                updatedSelectedRegion = parentRegion.id;
                setSelectedRegion(parentRegion.id);
                setSelectedRegionName(parentRegion.name);
                regionName = parentRegion.name;
              }
            }
          }
        } else if (level === "location") {
          if (id === null) {
            updatedSelectedLocation = null;
            setSelectedLocation(null);
            setSelectedLocationName("");
            locationName = "";
          } else {
            updatedSelectedLocation = id;
            setSelectedLocation(id);
            setSelectedLocationName(name);
            locationName = name;
      
            const parentCommune = Array.from(communes.values()).find((commune) =>
              commune.locations.has(id!)
            );
            if (parentCommune) {
              updatedSelectedCommune = parentCommune.id;
              setSelectedCommune(parentCommune.id);
              setSelectedCommuneName(parentCommune.name);
              communeName = parentCommune.name;
      
              const parentProvince = Array.from(provinces.values()).find((province) =>
                province.communes.has(parentCommune.id)
              );
              if (parentProvince) {
                updatedSelectedProvince = parentProvince.id;
                setSelectedProvince(parentProvince.id);
                setSelectedProvinceName(parentProvince.name);
                provinceName = parentProvince.name;
      
                const parentRegion = Array.from(regions.values()).find((region) =>
                  region.provinces.has(parentProvince.id)
                );
                if (parentRegion) {
                  updatedSelectedRegion = parentRegion.id;
                  setSelectedRegion(parentRegion.id);
                  setSelectedRegionName(parentRegion.name);
                  regionName = parentRegion.name;
                }
              }
            }
          }
        }
        const address = [regionName, provinceName, communeName, locationName]
          .filter((part) => part !== "")
          .join(", ");
      
        const selectedId =
          updatedSelectedLocation ??
          updatedSelectedCommune ??
          updatedSelectedProvince ??
          updatedSelectedRegion ??
          null;
      
        onAddressChange(address);
        notifyIdsChange(
          updatedSelectedLocation,
          updatedSelectedCommune,
          updatedSelectedProvince,
          updatedSelectedRegion
        );
      };
      
      

  return (
    <tr>
      <td>
        <OriginSelector
          options={regionOptions}
          placeholder={t("OriginRow.selected")}
          selectedValue={selectedRegionName}
          onSelect={(id, name) => handleSelection("region", id, name)}
        />
      </td>
      <td>
        <OriginSelector
          options={provincesOptions}
          placeholder={t("OriginRow.selected")}
          selectedValue={selectedProvinceName}
          onSelect={(id, name) => handleSelection("province", id, name)}
        />
      </td>
      <td>
        <OriginSelector
          options={communesOptions}
          placeholder={t("OriginRow.selected")}
          selectedValue={selectedCommuneName}
          onSelect={(id, name) => handleSelection("commune", id, name)}
        />
      </td>
      <td>
        <OriginSelector
          options={locationOptions}
          placeholder={t("OriginRow.selected")}
          selectedValue={selectedLocationName}
          onSelect={(id, name) => handleSelection("location", id, name)}
        />
      </td>
    </tr>
  );
};

export default OriginRow;
