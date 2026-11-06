"use client";

import { EditFoodForm } from "@/app/components/food-form/FoodForm";
import RequireAdmin from "@/app/components/RequireAdmin";
import { useParams } from "next/navigation";
import type { JSX } from "react";

export default function ModifyFoodPage(): JSX.Element {
    const params = useParams();
    const code = (params.code as string).toUpperCase();

    return (
        <RequireAdmin>
            <EditFoodForm code={code}/>
        </RequireAdmin>
    );
}
