import { useState } from "react";
import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

type Origin = CommonOrigin & ({
  type: "region";
  regionNumber: number;
  regionPlace: number;
} | {
  type: "province" | "commune";
  parentId: number;
} | {
  type: "location";
  parentId: number;
  locationType: "city" | "town";
});

type CommonOrigin = {
  id: number;
  name: string;
};

export type Region = CommonOrigin & {
  number: number;
  place: number;
  provinces: Collection<number, Province>;
};

export type Province = CommonOrigin & {
  parent: Region;
  communes: Collection<number, Commune>;
};

export type Commune = CommonOrigin & {
  parent: Province;
  locations: Collection<number, Location>;
};

export type Location = CommonOrigin & {
  parent: Commune;
  type: "city" | "town";
};

export function useOrigins() {
  const result = useFetch<Origin[]>("/origins");
  const [regions, setRegions] = useState(new Collection<number, Region>());
  const [provinces, setProvinces] = useState(new Collection<number, Province>());
  const [communes, setCommunes] = useState(new Collection<number, Commune>());
  const [locations, setLocations] = useState(new Collection<number, Location>());

  if (result.status === FetchStatus.Success
    && regions.size === 0
    && provinces.size === 0
    && communes.size === 0
    && locations.size === 0
  ) {
    result.data.sort((a, b) => a.id - b.id).forEach((o) => {
      const common = {
        id: o.id,
        name: o.name,
      };
      switch (o.type) {
        case "region": {
          regions.set(o.id, {
            ...common,
            number: o.regionNumber,
            place: o.regionPlace,
            provinces: new Collection(),
          });
          break;
        }
        case "province": {
          const region = regions.get(o.parentId)!;
          const province: Province = {
            ...common,
            parent: region,
            communes: new Collection(),
          };
          region.provinces.set(o.id, province);
          provinces.set(o.id, province);
          break;
        }
        case "commune": {
          const province = provinces.get(o.parentId)!;
          const commune: Commune = {
            ...common,
            parent: province,
            locations: new Collection(),
          };
          province.communes.set(o.id, commune);
          communes.set(o.id, commune);
          break;
        }
        case "location": {
          const commune = communes.get(o.parentId)!;
          const location: Location = {
            ...common,
            parent: commune,
            type: o.locationType,
          };
          commune.locations.set(o.id, location);
          locations.set(o.id, location);
          break;
        }
      }
    });

    setRegions(regions.clone());
    setProvinces(provinces.clone());
    setCommunes(communes.clone());
    setLocations(locations.clone());
  }

  return { regions, provinces, communes, locations };
}
