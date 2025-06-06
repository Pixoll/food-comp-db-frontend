export type Group = {
  id: number;
  code: string;
  name: string;
};

export type Region = {
  id: number;
  name: string;
  number: number;
  place: number;
};

export type TypeFood = {
  id: number;
  code: string;
  name: string;
};

export type FoodResult = {
  code: string;
  commonName: {
    es: string | null;
    en: string | null;
    pt: string | null;
  }
  scientificName?: string;
  subspecies?: string;
};
