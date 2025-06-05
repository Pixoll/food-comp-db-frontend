'use client'
import {useState} from 'react'
import {useTranslation} from "react-i18next";
import InfoAboutFoot from "../components/InfoAboutFoot";
import TabItem from "../../components/Tabs/TabItem";
import Tab from "../../components/Tabs/Tab";
import CompositionDropdown from "../components/composition-dropdown/CompositionDropdown";
import Graphic from "../components/Graphic";
import LangualCodes from "../components/LangualCodes";
import References from "../components/References";
import GramsAdjuster from "@/app/detail-food/components/grams-adjuster/GramsAdjuster";
import {FetchStatus, useFetch} from "@/hooks/useFetch";
import {SingleFoodResult} from "@/types/SingleFoodResult";
import styles from "./detail-food.module.css"

function getDetail(code: string): SingleFoodResult {
    const result = useFetch<SingleFoodResult>(`/foods/${code?.toString()}`);

    if (result.status === FetchStatus.Success) {
        return result.data;
    } else {
        return {
            commonName: {},
            ingredients: {},
            group: {
                code: '',
                name: ''
            },
            type: {
                code: '',
                name: ''
            },
            brand: undefined,
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

export default function ClientDetailPage({code}: { code: string }) {
    const {t} = useTranslation();

    const [grams, setGrams] = useState<number>(100);

    const data = getDetail(code)

    const colors = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#A28CC3",
        "#FF6361",
        "#BC5090",
        "#58508D",
        "#003F5C",
        "#FFA600",
        "#2F4B7C",
        "#665191",
        "#D45087",
        "#F95D6A",
        "#FF7C43",
        "#1F77B4",
        "#AEC7E8",
        "#FF9896",
        "#98DF8A",
        "#C5B0D5",
        "#FFBB78",
        "#9467BD",
        "#C49C94",
        "#E377C2",
        "#F7B6D2",
        "#7F7F7F",
        "#C7C7C7",
        "#BCBD22",
        "#DBDB8D",
        "#17BECF",
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
            <Tab defaultTab={0} >
                <TabItem label="Información general">
                    <InfoAboutFoot data={
                        {
                            ingredients: data.ingredients,
                            group: data.group,
                            type: data.type,
                            scientificName: data.scientificName,
                            subspecies: data.subspecies ?? "",
                            strain: data.strain ?? "",
                            brand: data.brand ?? "",
                            observation: data.observation ?? "",
                            origins: data.origins ?? []
                        }
                    }/>
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
                        <CompositionDropdown nutrientData={data.nutrientMeasurements ?? []} grams = {grams}/>
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
                        className="flex flex-col mt-[10px] border-[1px] rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] bg-[white]">
                        <h2 className="text-center pb-[12px]">Referencias</h2>
                        <References data={references}/>
                    </div>
                </TabItem>
            </Tab>
        </div>
    );
}

