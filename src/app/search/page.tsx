'use client'
import { useSearchParams } from 'next/navigation';
import FoodFilter from "./components/FoodFilter";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const foodName = searchParams.get('foodName') || "";
    return (
            <FoodFilter foodName={foodName ?? ""}/>
    );
}
