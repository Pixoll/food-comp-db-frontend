import {FoodResult} from "../../../core/types/option";
import ModifyFoodClient from "./client"

export async function generateStaticParams() {
    try {
        const response = await fetch("http://localhost:3000/api/foods");
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const foods: FoodResult[] = await response.json();
        return foods.map((food: FoodResult) => ({ code: food.code }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}
export default function ModifyFoodPage({ params }:{ params: {code:string}}) {
    const code  = params.code;
    return (<ModifyFoodClient code={code} />);
}
