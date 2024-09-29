import React,{useState} from "react";
import { Collection } from "../../utils/collection";
const foods = new Set<String>([

])
const FoodResultsList = () => {
    const[ foods, setFoods] = useState<Set<String>>( new Set<String>())
    return(
        <ul>
            
        </ul>
    );
    
};

export default FoodResultsList;