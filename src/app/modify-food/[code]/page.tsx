import { FoodResult } from "@/types/option";
import ModifyFoodClient from "./client";

export async function generateStaticParams() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/foods`);
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

export default async function ModifyFoodPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    return <ModifyFoodClient code={code}/>;
}
