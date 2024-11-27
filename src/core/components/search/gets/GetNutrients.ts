import useFetch from '../../../hooks/useFetch';
import { GroupedNutrients } from '../../../types/option';
import { Collection } from '../../../utils/collection';


const GetNutrients = () => {
  const { data, error, loading } = useFetch<GroupedNutrients>("http://localhost:3000/api/v1/nutrients");

  const collectionNutrients = new Collection<string,string>()

  if (data) {
    data.macronutrients.forEach((macro) => {
      collectionNutrients.set(macro.name, macro.name);
      if (macro.components) {
        macro.components.forEach((component) => collectionNutrients.set(component.name, component.name));
      }
    });

    data.micronutrients.vitamins.forEach((vitamin) => 
      collectionNutrients.set(vitamin.name, vitamin.name)
    );

    data.micronutrients.minerals.forEach((mineral) => 
      collectionNutrients.set(mineral.name, mineral.name)
    );
  }
  return { data, error, loading, collectionNutrients};
};

export default GetNutrients;
