import useFetch, { FetchStatus } from '../../../hooks/useFetch';
import { GroupedNutrients } from '../../../types/option';
import { Collection } from '../../../utils/collection';


const GetNutrients = () => {
  const result = useFetch<GroupedNutrients>("http://localhost:3000/api/v1/nutrients");

  const collectionNutrients = new Collection<string,string>()

  if (result.status === FetchStatus.Success) {
    result.data.macronutrients.forEach((macro) => {
      collectionNutrients.set(macro.id.toString(), macro.name + " ("+ macro.measurementUnit+")");
      if (macro.components) {
        macro.components.forEach((component) => collectionNutrients.set(component.id.toString(), component.name+ " ("+ component.measurementUnit+")"));
      }
    });

    result.data.micronutrients.vitamins.forEach((vitamin) => 
      collectionNutrients.set(vitamin.id.toString(), vitamin.name+ " ("+ vitamin.measurementUnit+")")
    );

    result.data.micronutrients.minerals.forEach((mineral) => 
      collectionNutrients.set(mineral.id.toString(), mineral.name+ " ("+ mineral.measurementUnit+")")
    );
  }
  return { collectionNutrients };
};

export default GetNutrients;
