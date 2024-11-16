export type Language = {
    id: number;
    code: string;
    name: string;
  };

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
    id: string;
    code: string;
    groupId: number;
    typeId: number;
    commonName:{
        es: string | null;
        en: string | null;
        pt: string | null;
    }
    scientificName: string;
    subspecies: string;
  };
