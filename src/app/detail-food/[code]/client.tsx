"use client";

import { Food } from "@/api";
import GramsAdjuster from "@/app/detail-food/components/grams-adjuster/GramsAdjuster";
import { FetchStatus, useApi } from "@/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tab from "../../components/Tabs/Tab";
import TabItem from "../../components/Tabs/TabItem";
import CompositionDropdown from "../components/composition-dropdown/CompositionDropdown";
import Graphic from "../components/Graphic";
import InfoAboutFoot from "../components/InfoAboutFoot";
import LangualCodes from "../components/LangualCodes";
import References from "../components/References";
import styles from "./detail-food.module.css";

function getDetail(code: string): Food {
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
                name: ""
            },
            type: {
                code: "",
                name: ""
            },
            brand: undefined,
            origins: [],
            nutrientMeasurements: {
                energy: [],
                macronutrients: [],
                micronutrients: {
                    vitamins: [],
                    minerals: []
                }
            },
            langualCodes: [],
            references: []
        };
    }
}

export default function ClientDetailPage({ code }: { code: string }) {
    const { t } = useTranslation();

    const [grams, setGrams] = useState<number>(100);

    const data = getDetail(code);

    const colors = [
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
    ];

    const references = data.references ?? [];
    const mainNutrients = data.nutrientMeasurements?.macronutrients ?? [];

    const graphicData =
        mainNutrients
            .filter((mainNutrient) => mainNutrient.nutrientId !== 12)
            .map((mainNutrient, index) => ({
                name: mainNutrient.name,
                value: +((grams / 100) * mainNutrient.average).toFixed(2),
                fill: colors[index % colors.length],
            })) || [];

    const graphicDataPercent =
        mainNutrients
            .filter(
                (mainNutrient) =>
                    mainNutrient.nutrientId !== 12 && mainNutrient.nutrientId !== 1
            )
            .map((mainNutrient, index) => ({
                name: mainNutrient.name,
                value: +(((grams / 100) * mainNutrient.average) / 100).toFixed(2),
                fill: colors[index % colors.length],
            })) || [];

    return (
        <div className="w-full h-full bg-[#effce8] rounded-t-[2px]">
            {data.commonName.es && (
                <h2 className="py-[8px] px-[16px] font-[700] text-[#60625f] m-[0px]">
                    {code}, {data.commonName.es}
                </h2>
            )}
            <Tab defaultTab={0}>
                <TabItem label="Información general">
                    <InfoAboutFoot
                        data={{
                            ingredients: data.ingredients,
                            group: data.group,
                            type: data.type,
                            scientificName: data.scientificName,
                            subspecies: data.subspecies ?? "",
                            strain: data.strain ?? "",
                            brand: data.brand ?? "",
                            observation: data.observation ?? "",
                            origins: data.origins ?? []
                        }}
                    />
                </TabItem>
                <TabItem label="Composición del alimento">
                    <GramsAdjuster
                        initialGrams={100}
                        onGramsChange={(newGrams) => {
                            setGrams(newGrams);
                        }}
                    />
                    <div className={styles["graphic-container"]}>
                        <Graphic title={t("DetailFood.graphics.title_L")} data={graphicData} grams={grams}/>
                        <Graphic title={t("DetailFood.graphics.title_R")} data={graphicDataPercent} grams={grams}/>
                    </div>
                    <div className="mt-[10px] border-[1px] rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] bg-[white]">
                        <h2 className="text-center ">Tabla de composición</h2>
                        <CompositionDropdown nutrientData={data.nutrientMeasurements ?? []} grams={grams}/>
                    </div>
                </TabItem>
                <TabItem label="Códigos languales">
                    <div className="flex flex-col mt-[10px] border-[1px] rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] bg-[white]">
                        <h2 className="text-center pb-[12px]">Códigos languales</h2>
                        <LangualCodes data={data.langualCodes}/>
                    </div>
                </TabItem>
                <TabItem label="Referencias">
                    <div
                        className="flex flex-col mt-[10px] border-[1px] rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] bg-[white]"
                    >
                        <h2 className="text-center pb-[12px]">Referencias</h2>
                        <References data={references}/>
                    </div>
                </TabItem>
            </Tab>
        </div>
    );
}

