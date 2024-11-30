import useFetch from '../../../hooks/useFetch';
import { GroupedNutrients } from '../../../types/option';
import { Collection } from '../../../utils/collection';


const GetNutrients = () => {
  const { data, error, loading } = useFetch<GroupedNutrients>("http://localhost:3000/api/v1/nutrients");

  const collectionNutrients = new Collection<string,string>()

  if (data) {
    data.macronutrients.forEach((macro) => {
      collectionNutrients.set(macro.id.toString(), macro.name + " ("+ macro.measurementUnit+")");
      if (macro.components) {
        macro.components.forEach((component) => collectionNutrients.set(component.id.toString(), component.name+ " ("+ component.measurementUnit+")"));
      }
    });

    data.micronutrients.vitamins.forEach((vitamin) => 
      collectionNutrients.set(vitamin.id.toString(), vitamin.name+ " ("+ vitamin.measurementUnit+")")
    );

    data.micronutrients.minerals.forEach((mineral) => 
      collectionNutrients.set(mineral.id.toString(), mineral.name+ " ("+ mineral.measurementUnit+")")
    );
  }
  return { data, error, loading, collectionNutrients};
};

export default GetNutrients;
