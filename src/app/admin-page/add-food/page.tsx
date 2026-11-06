"use client";

import { NewFoodForm } from "@/app/components/food-form/FoodForm";
import RequireAdmin from "@/app/components/RequireAdmin";
import type { JSX } from "react";

export default function AddFoodPage(): JSX.Element {
    return (
        <RequireAdmin>
            <NewFoodForm/>
        </RequireAdmin>
    );
}
