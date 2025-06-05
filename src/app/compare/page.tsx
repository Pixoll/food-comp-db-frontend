"use client";

import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import { useComparison } from "@/context/ComparisonContext";
import { FetchStatus, useFetch } from "@/hooks";
import { SingleFoodResult } from "@/types/SingleFoodResult";
import { ArrowLeft, ArrowRight, Download, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NutrientComparisonTable from "./components/NutrientComparisonTable";

export type GetFoodMeasurementsResult = Pick<SingleFoodResult, "commonName" | "nutrientMeasurements"> & {
    code: string;
};

export default function ComparisonPage() {
    const { comparisonFoods, removeFromComparison } = useComparison();
    const [comparisonSectionOpen, setComparisonSectionOpen] = useState(false);
    const { state } = useAuth();
    const { token } = state;
    const codes = comparisonFoods.map((food) => `${food.code}`).join(",");
    const router = useRouter();

    const exportData = async (codes: string[]) => {
        try {
            const result = await api.getXlsxV1({
                query: {
                    codes,
                },
                auth: token ?? "",
            });

            if (result.error) {
                console.error(result.error);
                return;
            }

            const blob = new Blob([result.data as any], {
                type: result.response.headers.get("content-type")!,
            });
            const url = window.URL.createObjectURL(blob);

            let fileName = result.response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1]
                ?? "foods_data.xlsx";

            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };

    const foodsResult = useFetch<GetFoodMeasurementsResult[]>(
        `/foods/compare?codes=${codes}`
    );
    const data =
        foodsResult.status === FetchStatus.Success ? foodsResult.data : [];

    return (
        <div className="container mx-auto px-[16px] py-[16px] bg-[white] min-h-[100vh]">
            <div className="flex flex-wrap -mx-[8px] mb-[16px]">
                <div className="w-[100%] px-[8px]">
                    <button
                        onClick={() => router.push("/search")}
                        className="inline-flex items-center px-[16px] py-[8px] border border-[#d1d5db] text-[16px] font-[500] rounded-[6px] text-[#374151] bg-[white] hover:bg-[#f9fafb] transition-colors duration-[200ms]"
                    >
                        <ArrowLeft className="mr-[8px] h-[16px] w-[16px]"/> Volver
                    </button>
                    <h1 className="text-center text-[28px] font-[700] text-[#103c22] mb-[12px] mt-[20px]">Comparación de
                                                                                                          Alimentos</h1>
                    <p className="text-center text-[#6b7280] text-[16px] max-w-[700px] mx-auto">
                        Selecciona los alimentos que deseas comparar y presiona el botón
                        para ver sus nutrientes
                    </p>
                </div>
            </div>

            {comparisonFoods.length < 2 ? (
                <div className="text-center p-[48px] bg-[#f3f4f6] border border-[#e5e7eb] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] max-w-[800px] mx-auto mt-[32px]">
                    <h4 className="text-[22px] font-[600] text-[#374151] mb-[16px]">No hay alimentos suficientes para
                                                                                    comparar</h4>
                    <p className="text-[#4b5563] text-[16px]">
                        Por favor, agrega alimentos desde la sección de búsqueda para
                        comenzar a comparar.
                    </p>
                    <button
                        onClick={() => router.push("/search")}
                        className="mt-[24px] inline-flex items-center px-[20px] py-[10px] bg-[#1e5f37] text-[white] font-[500] rounded-[8px] hover:bg-[#164a2b] transition-colors duration-[200ms]"
                    >
                        Ir a la búsqueda
                    </button>
                </div>
            ) : (
                <>
                    {!comparisonSectionOpen ? (
                        <>
                            <div className="flex flex-wrap -mx-[8px] mb-[24px]">
                                <div className="w-[100%] px-[8px]">
                                    <div className="flex justify-center mb-[24px]">
                                        <span className="bg-[#e9f5ee] text-[#103c22] px-[24px] py-[10px] rounded-[30px] font-[600] border border-[#1e5f37] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                                            {comparisonFoods.length} /5{" "}
                                            {comparisonFoods.length === 1 ? "alimento" : "alimentos"} seleccionados
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap -mx-[12px] mb-[32px]">
                                {comparisonFoods.map((food, index) => (
                                    <div key={index} className="w-[100%] md:w-[50%] lg:w-[33.333%] px-[12px] mb-[24px]">
                                        <div className="bg-[white] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] h-[100%] transition-all duration-[300ms] hover:translate-y-[-5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.12)] border border-[#e5e7eb]">
                                            <div className="flex justify-between items-center p-[16px] bg-[#f9fafb] rounded-t-[12px] border-b border-[#e5e7eb]">
                                                <span className="bg-[#1e5f37] text-[white] px-[12px] py-[4px] rounded-[6px] text-[14px] font-[500]">{food.code}</span>
                                                <button
                                                    onClick={() => removeFromComparison(food.code)}
                                                    className="flex items-center justify-center w-[36px] h-[36px] rounded-[50%] bg-[#fee2e2] border-[#628462] border-[1px] text-[#b91c1c] hover:bg-[#fecaca] hover:text-[#991b1b] transition-all duration-[200ms]"
                                                    aria-label={`Eliminar ${food.name}`}
                                                >
                                                    <Trash className="h-[18px] w-[18px]"/>
                                                </button>
                                            </div>
                                            <div className="p-[16px]">
                                                <h5 className="text-[18px] font-[500] text-[#1f2937] line-clamp-2">{food.name}</h5>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-[32px] mb-[24px]">
                                <div className="w-[100%] md:w-[50%] text-center">
                                    <button
                                        onClick={() => setComparisonSectionOpen(true)}
                                        className="inline-flex items-center px-[32px] py-[14px] bg-[#1e5f37] text-[white] font-[500] text-[16px] rounded-[30px] shadow-[0_4px_10px_rgba(30,95,55,0.3)] hover:bg-[#164a2b] hover:translate-y-[-2px] hover:shadow-[0_6px_14px_rgba(30,95,55,0.4)] transition-all duration-[300ms]"
                                    >
                                        Ver Comparación de
                                        Nutrientes <ArrowRight className="ml-[10px] h-[18px] w-[18px]"/>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="nutrient-comparison-section bg-[#f9fafb] p-[24px] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] mt-[24px] border border-[#e5e7eb]">
                            <div className="flex flex-wrap items-center justify-between mb-[24px] border-b-[1px] border-[#e5e7eb] pb-[16px]">
                                <h2 className="text-[24px] font-[700] text-[#103c22] mb-[12px] md:mb-[0]">Comparación de
                                                                                                          Nutrientes</h2>
                                <div className="flex flex-wrap gap-[12px]">
                                    <button
                                        className="inline-flex items-center px-[16px] py-[10px] bg-[#1e5f37] text-[white] font-[500] rounded-[8px] hover:bg-[#164a2b] transition-colors duration-[200ms] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                                        onClick={() => exportData(data.map((f) => f.code))}
                                    >
                                        <Download className="mr-[8px] h-[16px] w-[16px]"/> Exportar datos
                                    </button>
                                    <button
                                        className="inline-flex items-center px-[16px] py-[10px] border border-[#d1d5db] text-[16px] font-[500] rounded-[8px] text-[#374151] bg-[white] hover:bg-[#f3f4f6] transition-colors duration-[200ms]"
                                        onClick={() => setComparisonSectionOpen(false)}
                                    >
                                        <ArrowLeft className="mr-[8px] h-[16px] w-[16px]"/> Volver
                                    </button>
                                </div>
                            </div>

                            {foodsResult.status === FetchStatus.Loading && (
                                <div className="flex flex-col items-center justify-center py-[80px] text-center">
                                    <div
                                        className="inline-block animate-spin rounded-[50%] h-[48px] w-[48px] border-[3px] border-[#e5e7eb] border-t-[#1e5f37]"
                                        role="status"
                                    >
                                        <span className="sr-only">Cargando...</span>
                                    </div>
                                    <p className="mt-[16px] text-[#4b5563] text-[16px]">Cargando datos
                                                                                        nutricionales...</p>
                                </div>
                            )}

                            {foodsResult.status === FetchStatus.Failed && (
                                <div className="py-[60px] text-center">
                                    <div className="bg-[#fee2e2] border border-[#f87171] text-[#b91c1c] px-[24px] py-[16px] rounded-[8px] inline-block max-w-[600px] mx-auto shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                                        <p className="text-[16px] font-[500]">Error al cargar los datos
                                                                              nutricionales.</p>
                                        <p className="mt-[8px]">Por favor, intente nuevamente o contacte al soporte si
                                                                el problema persiste.</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="mt-[16px] px-[16px] py-[8px] bg-[#b91c1c] text-[white] rounded-[6px] hover:bg-[#991b1b] transition-colors duration-[200ms]"
                                        >
                                            Reintentar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {foodsResult.status === FetchStatus.Success && (
                                <NutrientComparisonTable
                                    foodsData={data}
                                    onRemoveFood={removeFromComparison}
                                />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
