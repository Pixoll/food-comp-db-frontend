"use client";

import api from "@/api";
import {useAuth} from "@/context/AuthContext";
import {useComparison} from "@/context/ComparisonContext";
import {FetchStatus, useFetch} from "@/hooks";
import {SingleFoodResult} from "@/types/SingleFoodResult";
import {ArrowLeft, ArrowRight, Download, Trash, Search} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import NutrientComparisonTable from "./components/NutrientComparisonTable";

export type GetFoodMeasurementsResult = Pick<SingleFoodResult, "commonName" | "nutrientMeasurements"> & {
    code: string;
};

export default function ComparisonPage() {
    const {comparisonFoods, removeFromComparison} = useComparison();
    const [comparisonSectionOpen, setComparisonSectionOpen] = useState(false);
    const {state} = useAuth();
    const {token} = state;
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
        <div className="min-h-full h-full bg-gradient-to-br from-[#aff5af] via-[#eff9ef] to-[#def9de] relative ">


            <div className="h-full relative z-10 container mx-auto px-[16px] py-[24px] max-w-[1400px]">
                <div className="mb-[32px]">
                    <button
                        onClick={() => router.push("/search")}
                        className="inline-flex items-center px-[20px] py-[12px] border border-[#d1d5db] text-[16px] font-[500] rounded-[12px] text-[#374151] bg-[white] hover:bg-[#f9fafb] hover:border-[#9ca3af] transition-all duration-[200ms] shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-[8px] mb-[24px]"
                    >
                        <ArrowLeft className="mr-[8px] h-[18px] w-[18px]"/> Volver
                    </button>

                    {comparisonFoods.length < 2 && (
                        <div className="text-center max-w-[900px] mx-auto">

                        <h1 className="text-[36px] md:text-[42px] font-[800] bg-gradient-to-r from-[#15803d] via-[#16a34a] to-[#22c55e] bg-clip-text text-transparent mb-[16px] leading-[1.2]">
                            Comparación de Alimentos
                        </h1>

                        <p className="text-[#6b7280] text-[18px] leading-[1.6] max-w-[600px] mx-auto">
                            Selecciona los alimentos que deseas comparar y analiza sus valores nutricionales de manera
                            detallada
                        </p>
                    </div>
                    )}
                </div>

                {comparisonFoods.length < 2 ? (
                    <div
                        className="text-center py-[80px] px-[32px] bg-[white]/[0.8] backdrop-blur-[12px] border border-[#e5e7eb]/[0.6] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-w-[900px] mx-auto mt-[48px] relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-transparent to-[#f1f5f9] opacity-[0.7]"></div>

                        <div className="relative z-10">
                            <div
                                className="inline-flex items-center justify-center w-[100px] h-[100px] bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] rounded-[50%] mb-[24px] shadow-inner">
                                <Search className="w-[45px] h-[45px] text-[#9ca3af]"/>
                            </div>

                            <h4 className="text-[28px] font-[700] text-[#1f2937] mb-[16px]">
                                No hay alimentos suficientes para comparar
                            </h4>

                            <p className="text-[#6b7280] text-[18px] leading-[1.6] mb-[32px] max-w-[500px] mx-auto">
                                Necesitas al menos 2 alimentos para comenzar la comparación. Agrega alimentos desde la
                                sección de búsqueda.
                            </p>

                            <button
                                onClick={() => router.push("/search")}
                                className="inline-flex items-center px-[32px] py-[16px] bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[white] font-[600] text-[18px] rounded-[16px] hover:from-[#15803d] hover:to-[#166534] transform hover:scale-[1.02] transition-all duration-[300ms] shadow-[0_8px_24px_rgba(22,163,74,0.35)] hover:shadow-[0_12px_32px_rgba(22,163,74,0.4)]"
                            >
                                <Search className="mr-[12px] h-[20px] w-[20px]"/>
                                Ir a la búsqueda
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {!comparisonSectionOpen ? (
                            <div className="space-y-[32px]">
                                <div className="flex justify-center">
                                    <div
                                        className="inline-flex items-center px-[28px] py-[14px] bg-gradient-to-r from-[#ecfdf5] to-[#f0fdf4] border-[2px] border-[#16a34a]/[0.2] rounded-[50px] shadow-[0_4px_16px_rgba(22,163,74,0.15)]">
                                        <div
                                            className="w-[12px] h-[12px] bg-[#16a34a] rounded-[50%] mr-[12px] animate-pulse"></div>
                                        <span className="text-[#15803d] font-[700] text-[18px]">
                                            {comparisonFoods.length} alimentos seleccionados.
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] max-w-[1200px] mx-auto">
                                    {comparisonFoods.map((food, index) => (
                                        <div
                                            key={index}
                                            className="group bg-[white]/[0.9] backdrop-blur-[8px] rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-[400ms] hover:translate-y-[-8px] border border-[#e5e7eb]/[0.6] hover:border-[#16a34a]/[0.3] overflow-hidden relative"
                                        >
                                            <div
                                                className="absolute inset-0 bg-gradient-to-br from-[#f8fafc]/[0.8] via-transparent to-[#f1f5f9]/[0.6] opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]"></div>

                                            <div className="relative z-10">
                                                <div
                                                    className="flex justify-between items-center p-[20px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#e5e7eb]/[0.8]">
                                                    <span
                                                        className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[white] px-[16px] py-[8px] rounded-[12px] text-[14px] font-[700] shadow-[0_2px_8px_rgba(22,163,74,0.3)]">
                                                        {food.code}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromComparison([food.code])}
                                                        className="flex items-center justify-center w-[44px] h-[44px] rounded-[50%] bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] hover:text-[#b91c1c] transition-all duration-[200ms] hover:scale-[1.1] shadow-[0_2px_8px_rgba(220,38,38,0.2)] hover:shadow-[0_4px_12px_rgba(220,38,38,0.3)]"
                                                        aria-label={`Eliminar ${food.name}`}
                                                    >
                                                        <Trash className="h-[20px] w-[20px]"/>
                                                    </button>
                                                </div>

                                                <div className="p-[20px]">
                                                    <h5 className="text-[18px] font-[600] text-[#1f2937] leading-[1.4] line-clamp-2 group-hover:text-[#15803d] transition-colors duration-[200ms]">
                                                        {food.name}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center pt-[16px]">
                                    <button
                                        onClick={() => setComparisonSectionOpen(true)}
                                        className="inline-flex items-center px-[40px] py-[18px] bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[white] font-[700] text-[18px] rounded-[50px] shadow-[0_8px_32px_rgba(22,163,74,0.4)] hover:shadow-[0_12px_40px_rgba(22,163,74,0.5)] hover:from-[#15803d] hover:to-[#166534] transform hover:scale-[1.05] transition-all duration-[300ms] relative overflow-hidden group"
                                    >
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-[white]/[0.2] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[600ms]"></div>

                                        <span className="relative z-10 flex items-center">
                                            Ver Comparación de Nutrientes
                                            <ArrowRight
                                                className="ml-[12px] h-[20px] w-[20px] group-hover:translate-x-[4px] transition-transform duration-[200ms]"/>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="bg-[white]/[0.9] backdrop-blur-[12px] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#e5e7eb]/[0.6] overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-[#f8fafc] via-[white] to-[#f1f5f9] px-[32px] py-[24px] border-b border-[#e5e7eb]/[0.8]">
                                    <div
                                        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[16px]">
                                        <div>
                                            <h2 className="text-[28px] font-[800] bg-gradient-to-r from-[#15803d] to-[#16a34a] bg-clip-text text-transparent mb-[8px]">
                                                Comparación de Nutrientes
                                            </h2>
                                            <p className="text-[#6b7280] text-[16px]">
                                                Análisis detallado de {comparisonFoods.length} alimentos seleccionados
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-[12px]">
                                            <button
                                                className="inline-flex items-center px-[20px] py-[12px] bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[white] font-[600] rounded-[12px] hover:from-[#15803d] hover:to-[#166534] transition-all duration-[200ms] shadow-[0_4px_16px_rgba(22,163,74,0.3)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.4)] transform hover:scale-[1.02]"
                                                onClick={() => exportData(data.map((f) => f.code))}
                                            >
                                                <Download className="mr-[8px] h-[18px] w-[18px]"/>
                                                Exportar datos
                                            </button>
                                            <button
                                                className="inline-flex items-center px-[20px] py-[12px] border border-[#d1d5db] text-[16px] font-[600] rounded-[12px] text-[#374151] bg-[white] hover:bg-[#f9fafb] hover:border-[#9ca3af] transition-all duration-[200ms] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                                                onClick={() => setComparisonSectionOpen(false)}
                                            >
                                                <ArrowLeft className="mr-[8px] h-[18px] w-[18px]"/>
                                                Volver
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-[32px]">
                                    {foodsResult.status === FetchStatus.Loading && (
                                        <div
                                            className="flex flex-col items-center justify-center py-[80px] text-center">
                                            <div className="relative">
                                                <div
                                                    className="inline-block animate-spin rounded-[50%] h-[60px] w-[60px] border-[4px] border-[#f3f4f6] border-t-[#16a34a] shadow-[0_4px_16px_rgba(22,163,74,0.2)]"></div>
                                                <div
                                                    className="absolute inset-0 inline-block animate-spin rounded-[50%] h-[60px] w-[60px] border-[4px] border-transparent border-r-[#22c55e] animation-delay-[150ms]"></div>
                                            </div>
                                            <p className="mt-[24px] text-[#6b7280] text-[18px] font-[500]">
                                                Cargando datos nutricionales...
                                            </p>
                                            <p className="mt-[8px] text-[#9ca3af] text-[14px]">
                                                Esto puede tomar unos segundos
                                            </p>
                                        </div>
                                    )}

                                    {foodsResult.status === FetchStatus.Failed && (
                                        <div className="py-[60px] text-center">
                                            <div
                                                className="bg-gradient-to-r from-[#fee2e2] to-[#fecaca] border-[2px] border-[#f87171] text-[#b91c1c] px-[32px] py-[24px] rounded-[16px] inline-block max-w-[600px] mx-auto shadow-[0_8px_24px_rgba(248,113,113,0.2)]">
                                                <div
                                                    className="w-[48px] h-[48px] bg-[#dc2626] rounded-[50%] flex items-center justify-center mx-auto mb-[16px]">
                                                    <span className="text-[white] text-[24px] font-[700]">!</span>
                                                </div>
                                                <p className="text-[18px] font-[600] mb-[8px]">
                                                    Error al cargar los datos nutricionales
                                                </p>
                                                <p className="mb-[20px] text-[16px]">
                                                    Por favor, intente nuevamente o contacte al soporte si el problema
                                                    persiste.
                                                </p>
                                                <button
                                                    onClick={() => window.location.reload()}
                                                    className="px-[24px] py-[12px] bg-[#dc2626] text-[white] rounded-[12px] hover:bg-[#b91c1c] transition-colors duration-[200ms] font-[600] shadow-[0_4px_12px_rgba(220,38,38,0.3)]"
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
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
