import type { Food } from "@/api";
import { useTranslation } from "@/context/I18nContext";
import type { JSX, ReactNode } from "react";

type FoodInformationProps = {
    food: Food;
};

/**
 * Datos generales según el Excel nuevo: nombres, grupo, nombre científico, porción, observación y "otros"
 * (que ahora reúne origen, marca e institución). Solo se muestran los campos con valor; el nombre que ya
 * se usa como título no se repite.
 */
export default function FoodInformation({ food }: FoodInformationProps): JSX.Element {
    const { t } = useTranslation();
    const titleIsCommonName = !food.foodName?.trim();

    const items: Array<{ label: string; value: ReactNode; wide?: boolean }> = [
        { label: t.foodDetail.foodName, value: food.foodName },
        { label: t.foodDetail.commonName, value: titleIsCommonName ? undefined : food.commonName, wide: true },
        {
            label: t.foodDetail.group,
            value: <>{food.group.name} <span className="text-ash">({food.group.code})</span></>,
        },
        {
            label: t.foodDetail.scientificName,
            value: food.scientificName && <span className="italic">{food.scientificName}</span>,
        },
        { label: t.foodDetail.portion, value: food.portionQuantity && t.foodDetail.grams(food.portionQuantity) },
        { label: t.foodDetail.observation, value: food.observation, wide: true },
        { label: t.foodDetail.others, value: food.others, wide: true },
    ];

    return (
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.filter(item => !!item.value).map(item => (
                <div key={item.label} className={item.wide ? "sm:col-span-2 lg:col-span-3" : ""}>
                    <dt className="text-[12px] font-medium uppercase tracking-wide text-ash">{item.label}</dt>
                    <dd className="mt-1 text-[14px] leading-relaxed text-carbon">{item.value}</dd>
                </div>
            ))}
        </dl>
    );
}
