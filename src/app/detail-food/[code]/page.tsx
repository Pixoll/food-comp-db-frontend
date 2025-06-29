"use client";

import type { Food } from "@/api";
import GramsAdjuster from "@/app/detail-food/components/grams-adjuster/GramsAdjuster";
import { useTranslation } from "@/context/I18nContext";
import { FetchStatus, useApi } from "@/hooks";
import { useParams } from "next/navigation";
import { type JSX, useState } from "react";
import Tab from "../../components/Tabs/Tab";
import TabItem from "../../components/Tabs/TabItem";
import CompositionDropdown from "../components/CompositionDropdown";
import Graphic from "../components/Graphic";
import FoodInformation from "../components/FoodInformation";
import LangualCodes from "@/app/detail-food/components/langual-codes/LangualCodes";
import References from "../components/References";
import styles from "./detail-food.module.css";

const pieColors = [
    "#0088fe",
    "#00c49f",
    "#ffbb28",
    "#ff8042",
    "#a28cc3",
    "#ff6361",
    "#bc5090",
    "#58508d",
    "#003f5c",
    "#ffa600",
    "#2f4b7c",
    "#665191",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#1f77b4",
    "#aec7e8",
    "#ff9896",
    "#98df8a",
    "#c5b0d5",
    "#ffbb78",
    "#9467bd",
    "#c49c94",
    "#e377c2",
    "#f7b6d2",
    "#7f7f7f",
    "#c7c7c7",
    "#bcbd22",
    "#dbdb8d",
    "#17becf",
] as const;

function useDetail(code: string): Food {
    const result = useApi([code], (api, depCode) => api.getFood({
        path: {
            code: depCode,
        },
    }));

    if (result.status === FetchStatus.Success) {
        return result.data;
    } else {
        return {
            commonName: {
                es: null,
                en: null,
                pt: null,
            },
            ingredients: {
                es: null,
                en: null,
                pt: null,
            },
            group: {
                code: "",
                name: "",
            },
            type: {
                code: "",
                name: "",
            },
            brand: undefined,
            origins: [],
            nutrientMeasurements: {
                energy: [],
                macronutrients: [],
                micronutrients: {
                    vitamins: [],
                    minerals: [],
                },
            },
            langualCodes: [],
            references: [],
        };
    }
}

export default function DetailFoodPage(): JSX.Element {
    const params = useParams();
    const code = params.code as string;
    const { t, language } = useTranslation();
    const [grams, setGrams] = useState<number>(100);

    const data = useDetail(code);

    const references = data.references ?? [];
    const mainNutrients = data.nutrientMeasurements?.macronutrients ?? [];

    const graphicData = mainNutrients
        .filter((mainNutrient) => mainNutrient.nutrientId !== 12)
        .map((mainNutrient, index) => ({
            name: mainNutrient.name,
            value: +((grams / 100) * mainNutrient.average).toFixed(2),
            fill: pieColors[index % pieColors.length],
        }));

    const graphicDataPercent = mainNutrients
        .filter((mainNutrient) =>
            mainNutrient.nutrientId !== 12 && mainNutrient.nutrientId !== 1
        )
        .map((mainNutrient, index) => ({
            name: mainNutrient.name,
            value: +(((grams / 100) * mainNutrient.average) / 100).toFixed(2),
            fill: pieColors[index % pieColors.length],
        }));

    return (
        <div className="w-full h-full bg-[#effce8] rounded-t-[2px]">
            <div
                className="
                px-[24px] py-[20px]
                bg-gradient-to-r from-[#ffffff] to-[#f8fdf6]
                border-b-[2px] border-b-[#7cbb75]
                shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                mb-[16px]
                "
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-[8px] sm:gap-[16px]">
                    <span
                        className="
                        inline-flex items-center justify-center
                        bg-[#7cbb70]
                        text-white
                        font-[600]
                        text-[16px]
                        px-[6px] py-[4px]
                        rounded-[8px]
                        min-w-[80px]
                        text-center
                        shadow-[0_2px_4px_rgba(124,187,117,0.3)]
                        "
                    >
                    </span>
                    <h1
                        className="
                        font-[700]
                        text-[28px] sm:text-[32px]
                        text-[#2d3748]
                        m-[0px]
                        leading-[1.1]
                        tracking-[-0.02em]
                        flex-1
                        "
                    >
                        [{code}] {data.commonName[language] ?? data.commonName.en ?? data.commonName.es}
                    </h1>
                </div>
            </div>
            <Tab defaultTab={0}>
                <TabItem label={t.foodDetail.generalInfo}>
                    <FoodInformation
                        data={{
                            ingredients: data.ingredients,
                            group: data.group,
                            type: data.type,
                            scientificName: data.scientificName,
                            subspecies: data.subspecies ?? "",
                            strain: data.strain ?? "",
                            brand: data.brand ?? "",
                            observation: data.observation ?? "",
                            origins: data.origins ?? [],
                        }}
                    />
                </TabItem>
                <TabItem label={t.foodDetail.foodComposition}>
                    <GramsAdjuster
                        initialGrams={100}
                        onGramsChange={(newGrams) => {
                            setGrams(newGrams);
                        }}
                    />
                    <div className={styles["graphic-container"]}>
                        <Graphic title={t.foodDetail.graphics.titleLeft} data={graphicData} grams={grams}/>
                        <Graphic title={t.foodDetail.graphics.titleRight} data={graphicDataPercent} grams={grams}/>
                    </div>
                    <div
                        className="
                        mt-[10px]
                        border-[1px]
                        rounded-[4px]
                        shadow-[0_4px_10px_rgba(0,0,0,0.2)]
                        bg-[white]
                        "
                    >
                        <h2 className="text-center ">{t.foodDetail.compositionTable}</h2>
                        <CompositionDropdown nutrientData={data.nutrientMeasurements ?? []} grams={grams}/>
                    </div>
                </TabItem>
                <TabItem label={t.foodDetail.langualCodes}>
                    <div
                        className="
                        flex
                        flex-col
                        mt-[10px]
                        border-[1px]
                        rounded-[4px]
                        shadow-[0_4px_10px_rgba(0,0,0,0.2)]
                        bg-[white]
                        "
                    >
                        <h2 className="text-center pb-[12px]">{t.foodDetail.langualCodes}</h2>
                        <LangualCodes data={data.langualCodes}/>
                    </div>
                </TabItem>
                <TabItem label={t.foodDetail.references.title}>
                    <div
                        className="
                        flex
                        flex-col
                        mt-[10px]
                        border-[1px]
                        rounded-[4px]
                        shadow-[0_4px_10px_rgba(0,0,0,0.2)]
                        bg-[white]
                        "
                    >
                        <h2 className="text-center pb-[12px]">{t.foodDetail.references.title}</h2>
                        <References data={references}/>
                    </div>
                </TabItem>
            </Tab>
        </div>
    );
}
