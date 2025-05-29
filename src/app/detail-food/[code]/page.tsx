import ClientDetailPage from "./client";
import {FoodResult} from "@/core/types/option";

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

export default function DetailFoodPage({ params }:{ params: {code:string}}) {
    const code  = params.code;
    return (<ClientDetailPage code={code} />);
}
