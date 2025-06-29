"use client";

import api, { type BaseFood } from "@/api";
import Loading from "@/app/components/Loading/Loading";
import { useAuth } from "@/context/AuthContext";
import { useComparison } from "@/context/ComparisonContext";
import { useTranslation } from "@/context/I18nContext";
import { type FetchResult, FetchStatus } from "@/hooks";
import { ArrowDown, ArrowUp, Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type JSX, useEffect, useState } from "react";
import Pagination from "../Pagination";
import "./index.css";

type FoodResultsListProps = {
    data: FetchResult<BaseFood[]>;
    status: FetchStatus;
    searchForName: string;
    setSearchForName: (value: string) => void;
};

enum SortType {
    CODE,
    NAME,
    SCIENTIFIC_NAME,
}

enum SortOrder {
    ASC,
    DESC,
}

export default function FoodResultsTable({
    data,
    searchForName,
    setSearchForName,
}: FoodResultsListProps): JSX.Element {
    const router = useRouter();
    const { state } = useAuth();
    const { comparisonFoods, addToComparison, removeFromComparison } = useComparison();
    const { t, language } = useTranslation();
    const [selectedSort, setSelectedSort] = useState(SortType.NAME);
    const [sortOrder, setSortOrder] = useState(SortOrder.ASC);
    const [resultsPerPage, setResultsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedData, setSortedData] = useState<BaseFood[]>([]);

    const totalPages = Math.ceil(sortedData.length / resultsPerPage);
    const lastIndex = currentPage * resultsPerPage;
    const firstIndex = lastIndex - resultsPerPage;
    const records = sortedData.slice(firstIndex, lastIndex);

    const toFoodDetail = (code: string): void => {
        router.push(`/detail-food/${code}`);
    };

    const toModifyFoodDetail = (code: string): void => {
        if (state.isAuthenticated) {
            router.push(`/modify-food/${code}`);
        } else {
            router.push("/login");
        }
    };

    const changePage = (page: number): void => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const exportData = async (codes: string[]): Promise<void> => {
        try {
            const result = await api.getXlsx({
                query: {
                    codes,
                },
            });

            if (result.error) {
                console.error(result.error);
                return;
            }

            const blob = new Blob([result.data as ArrayBuffer], {
                type: result.response.headers.get("content-type")!,
            });
            const url = window.URL.createObjectURL(blob);

            const fileName = result.response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1]
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

    useEffect(() => {
        const sorted = [...(data.status === FetchStatus.Success ? data.data : [])].sort((a, b) => {
            let stringA: string;
            let stringB: string;

            switch (selectedSort) {
                case SortType.CODE: {
                    stringA = a.code;
                    stringB = b.code;
                    break;
                }
                case SortType.NAME: {
                    stringA = a.commonName[language]?.toLowerCase() ?? "~";
                    stringB = b.commonName[language]?.toLowerCase() ?? "~";
                    break;
                }
                case SortType.SCIENTIFIC_NAME: {
                    const scientificNameA = a.scientificName?.toLowerCase() ?? "";
                    const subspeciesA = a.subspecies?.toLowerCase() ?? "";
                    const scientificNameB = b.scientificName?.toLowerCase() ?? "";
                    const subspeciesB = b.subspecies?.toLowerCase() ?? "";
                    stringA = (subspeciesA ? `${scientificNameA} ${subspeciesA}` : scientificNameA) || "~";
                    stringB = (subspeciesB ? `${scientificNameB} ${subspeciesB}` : scientificNameB) || "~";
                    break;
                }
            }

            if (stringA > stringB) {
                return sortOrder === SortOrder.ASC ? 1 : -1;
            }

            if (stringA < stringB) {
                return sortOrder === SortOrder.ASC ? -1 : 1;
            }

            return 0;
        });

        setSortedData(sorted);

        const maxPage = Math.max(Math.ceil(sorted.length / resultsPerPage), 1);
        if (currentPage > maxPage) {
            setCurrentPage(maxPage);
        }
        // eslint-disable-next-line
    }, [
        data,
        language,
        selectedSort,
        sortOrder,
        resultsPerPage,
        searchForName,
    ]);

    const handleSortClick = (type: SortType): void => {
        if (selectedSort === type) {
            setSortOrder(
                sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
            );
        } else {
            setSelectedSort(type);
            setSortOrder(SortOrder.ASC);
        }
    };

    const selectAllFoodComparison = (): void => {
        const currentSelected = new Set(comparisonFoods.map(f => f.code));

        const newItems = records.filter(
            (item) => !currentSelected.has(item.code)
        );

        if (newItems.length === 0) return;

        const foodsToAdd = newItems.map(item => ({
            code: item.code,
            name: item.commonName[language] ?? "",
        }));

        addToComparison(foodsToAdd);
    };

    const deselectAllFoodComparison = (): void => {
        const currentSelected = new Set(comparisonFoods.map(f => f.code));

        const itemsToRemove = records
            .filter(item => currentSelected.has(item.code))
            .map(item => item.code);

        if (itemsToRemove.length === 0) return;

        removeFromComparison(itemsToRemove);
    };

    const currentFoodInComparison = new Set(comparisonFoods.map((f) => f.code));
    const selectedItemsInCurrentPage = records.filter((item) =>
        currentFoodInComparison.has(item.code)
    ).length;

    const isAllSelected = selectedItemsInCurrentPage === records.length && records.length > 0;

    const handleToggle = (): void => {
        if (isAllSelected) {
            deselectAllFoodComparison();
        } else {
            selectAllFoodComparison();
        }
    };

    return (
        <div className="food-list">
            <h2
                className="
                text-[24px]
                text-[black]
                text-left
                mb-[18px]
                border-b-[2px]]
                border-[#a8d8d2]
                pb-[8px]
                tracking-wider
                transition-colors
                duration-300
                ease-in-out
                hover:text-[#388e60]
                "
            >
                {t.foodResults.title}
            </h2>
            <div className="filter-name">
                <div className="g-[12px]">
                    <div className="flex flex-row items-center gap-[24px] w-full">
                        <div className="flex-1 w-full">
                            <input
                                className="
                                w-full
                                bg-[#f9f9f9]
                                px-[16px]
                                py-[14px]
                                rounded-[30px]
                                border-[2px]
                                border-solid
                                border-[#a8d8d2]
                                shadow-[0_2px_6px_rgba(0,0,0,0.1)]
                                outline-[none]
                                transition-colors
                                duration-300
                                text-[16px]
                                focus:border-[#007f67]
                                focus:shadow-[0_4px_12px_rgba(0,127,103,0.2)]
                                placeholder:text-[#a9a9a9]
                                "
                                type="text"
                                placeholder={t.foodResults.search}
                                value={searchForName}
                                onChange={(e) => setSearchForName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-row items-center gap-[8px] min-w-[180px]">
                            <label
                                htmlFor="resultsPerPage"
                                className="text-[14px] font-medium text-[#4a4a4a] whitespace-nowrap"
                            >
                                {t.foodResults.resultsPerPage}
                            </label>
                            <div className="relative w-full md:w-[100px]">
                                <select
                                    id="resultsPerPage"
                                    value={resultsPerPage}
                                    onChange={(e) => setResultsPerPage(+e.target.value)}
                                    className="
                                    appearance-none
                                    w-full
                                    bg-[#f9f9f9]
                                    px-[12px]
                                    py-[10px]
                                    pr-[32px]
                                    rounded-[8px]
                                    border-[2px]
                                    border-solid
                                    border-[#a8d8d2]
                                    shadow-[0_2px_4px_rgba(0,0,0,0.05)]
                                    outline-[none]
                                    transition-colors
                                    duration-300
                                    text-[14px]
                                    text-[#4a4a4a]
                                    cursor-pointer
                                    focus:border-[#007f67]
                                    focus:shadow-[0_2px_8px_rgba(0,127,103,0.15)]
                                    "
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <div
                                    className="
                                    absolute
                                    right-[12px]
                                    top-[50%]
                                    transform
                                    translate-y-[-50%]
                                    pointer-events-none
                                    "
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[16px] w-[16px] text-[#007f67]"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-[16px] my-[24px] w-full">
                        <button
                            className="
                            bg-[#1d6735]
                            text-[white]
                            px-[16px]
                            py-[14px]
                            border-none
                            rounded-[6px]
                            text-[16px]
                            font-[500]
                            cursor-pointer
                            transition-all
                            duration-300
                            ease-in-out
                            w-full
                            shadow-[0_2px_5px_rgba(0,0,0,0.2)]
                            hover:bg-[#20703a]
                            hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]
                            hover:-translate-y-[1px]
                            active:bg-[#3e8e41]
                            active:shadow-[0_1px_3px_rgba(0,0,0,0.2)]
                            active:translate-y-[1px]
                            "
                            disabled={data.status === FetchStatus.Loading}
                            onClick={() => exportData((data.status === FetchStatus.Success ? data.data : [])
                                .map((f) => f.code)
                            )}
                        >
                            {t.foodResults.export}
                        </button>
                        <button
                            className="
                            bg-[#1d6735]
                            text-[white]
                            px-[16px]
                            py-[14px]
                            border-none
                            rounded-[6px]
                            text-[16px]
                            font-[500]
                            cursor-pointer
                            transition-all
                            duration-300
                            ease-in-out
                            w-full
                            shadow-[0_2px_5px_rgba(0,0,0,0.2)]
                            hover:bg-[#20703a]
                            hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]
                            hover:-translate-y-[1px]
                            active:bg-[#3e8e41]
                            active:shadow-[0_1px_3px_rgba(0,0,0,0.2)]
                            active:translate-y-[1px]
                            "
                            onClick={() => router.push("/compare")}
                        >
                            {t.foodResults.goToCompare} ({comparisonFoods.length})
                        </button>
                        <button
                            className={`
                            ${isAllSelected
                                ? "bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c]"
                                : "bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857]"
                            }
                            text-[white]
                            px-[20px]
                            py-[16px]
                            border-none
                            rounded-[12px]
                            text-[16px]
                            font-[600]
                            cursor-pointer
                            transition-all
                            duration-300
                            ease-in-out
                            w-full
                            shadow-[0_4px_14px_rgba(0,0,0,0.25)]
                            hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]
                            hover:-translate-y-[2px]
                            active:translate-y-[0px]
                            active:shadow-[0_2px_8px_rgba(0,0,0,0.2)]
                            flex
                            items-center
                            justify-center
                            gap-[10px]
                            relative
                            overflow-hidden
                            ${records.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
                            group
                            `}
                            onClick={handleToggle}
                            disabled={records.length === 0}
                        >
                            <div
                                className="
                                absolute
                                inset-0
                                bg-gradient-to-r
                                from-transparent
                                via-[white]/[0.2]
                                to-transparent
                                translate-x-[-100%]
                                group-hover:translate-x-[100%]
                                transition-transform
                                duration-[600ms]
                                "
                            />
                            <span className="relative z-10 flex items-center gap-[10px]">
                                <span className="group-hover:scale-[1.1] transition-transform duration-[200ms]">
                                    {isAllSelected ? (
                                        <X className="w-[18px] h-[18px]"/>
                                    ) : (
                                        <Plus className="w-[18px] h-[18px]"/>
                                    )}
                                </span>
                                {isAllSelected ? t.foodResults.deselect : t.foodResults.select}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {data.status === FetchStatus.Loading
                ? <Loading size="large" text={t.foodResults.loading}/>
                : sortedData.length === 0
                    ? <p>{t.foodResults.noResults}</p>
                    : <>
                        <table
                            className="
                            content-table-foods
                            border-collapse
                            font-[0.95em]
                            w-full
                            rounded-t-[8px]
                            overflow-hidden
                            shadow-[0_6px_18px_rgba(0, 0, 0, 0.1)]
                            "
                        >
                            <thead>
                                <tr className="bg-[#1d6735] text-[#F8F8FF] text-left font-[700] select-none">
                                    <th className="text-[22px] font-[500] py-[14px] px-[18px] text-left">
                                        <div
                                            className="flex flex-row items-center cursor-pointer w-[max-content]"
                                            onClick={() => handleSortClick(SortType.CODE)}
                                        >
                                            {selectedSort === SortType.CODE
                                                && (sortOrder === SortOrder.ASC ? (
                                                    <ArrowUp className="mr-[5px]" height={24}/>
                                                ) : (
                                                    <ArrowDown className="mr-[5px]" height={24}/>
                                                ))}
                                            {t.foodResults.table.code}
                                        </div>
                                    </th>
                                    <th className="text-[22px] font-[500] py-[14px] px-[18px] text-left">
                                        <div
                                            className="flex flex-row items-center cursor-pointer w-[max-content]"
                                            onClick={() => handleSortClick(SortType.NAME)}
                                        >
                                            {selectedSort === SortType.NAME
                                                && (sortOrder === SortOrder.ASC
                                                        ? <ArrowUp className="mr-[5px]" height={24}/>
                                                        : <ArrowDown className="mr-[5px]" height={24}/>
                                                )}
                                            {t.foodResults.table.name}
                                        </div>
                                    </th>
                                    <th className="text-[22px] font-[500] py-[14px] px-[18px] text-left">
                                        <div
                                            className="flex flex-row items-center cursor-pointer w-[max-content]"
                                            onClick={() => handleSortClick(SortType.SCIENTIFIC_NAME)}
                                        >
                                            {selectedSort === SortType.SCIENTIFIC_NAME
                                                && (sortOrder === SortOrder.ASC
                                                        ? <ArrowUp height={24}/>
                                                        : <ArrowDown height={24}/>
                                                )}
                                            {t.foodResults.table.scientificName}
                                        </div>
                                    </th>
                                    <th className="text-[22px] font-[500] py-[14px] px-[18px] text-left">
                                        {t.foodResults.table.action}
                                    </th>
                                    <th className="text-[22px] font-[500] py-[14px] px-[18px] text-left">
                                        {t.foodResults.table.compare}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((item, index) => (
                                    <tr
                                        key={item.code}
                                        className={`
                                        border-b-[1px] border-[#dddddd]
                                        ${index % 2 === 1 ? "bg-[#f8f8f8]" : ""}
                                        ${index === records.length - 1 ? "border-b-[2px] border-[#009879]" : ""}
                                        `}
                                    >
                                        <td className="text-center" data-label={t.foodResults.table.code}>
                                            {item.code}
                                        </td>
                                        <td data-label={t.foodResults.table.name}>
                                            {item.commonName[language] || "N/A"}
                                        </td>
                                        <td className="text-center" data-label={t.foodResults.table.scientificName}>
                                            {item.subspecies
                                                ? `${item.scientificName} ${item.subspecies.toLowerCase()}`
                                                : item.scientificName || "N/A"}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="
                                                bg-[#1d6735]
                                                rounded-[30px]
                                                text-[white]
                                                cursor-pointer
                                                py-[10px]
                                                px-[18px]
                                                text-center
                                                transition-all
                                                duration-300
                                                ease-in-out
                                                border-none
                                                text-[14px]
                                                box-shadow[0_4px_6px_rgba(0,0,0,0.3)]
                                                mb-[10px]
                                                hover:bg-[#388e60]
                                                hover:translate-y-[3px]
                                                "
                                                onClick={() => toFoodDetail(item.code)}
                                            >
                                                {t.foodResults.table.details}
                                            </button>
                                            {state.isAuthenticated && (
                                                <button
                                                    className="
                                                    bg-[#00707f]
                                                    rounded-[30px]
                                                    text-[white]
                                                    cursor-pointer
                                                    py-[10px]
                                                    px-[18px]
                                                    text-center
                                                    transition-all
                                                    duration-300
                                                    ease-in-out
                                                    border-none
                                                    text-[14px]
                                                    box-shadow[0_4px_6px_rgba(0,0,0,0.3)]
                                                    mb[10px]
                                                    hover:bg-[#005561FF]
                                                    hover:translate-y-[3px]
                                                    "
                                                    onClick={() => toModifyFoodDetail(item.code)}
                                                >
                                                    {t.foodResults.table.modify}
                                                </button>
                                            )}
                                        </td>
                                        <th className="flex items-center justify-center h-[55px] md:h-auto">
                                            {comparisonFoods.map((f) => f.code).includes(item.code) ? (
                                                <button
                                                    onClick={() => removeFromComparison([item.code])}
                                                    className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    w-full
                                                    h-[45px]
                                                    rounded-[6px]
                                                    border-none
                                                    cursor-pointer
                                                    transition-all
                                                    duration-200
                                                    ease-in-out
                                                    bg-[#ecc1c1]
                                                    text-[#c31a3f]
                                                    hover:bg-[#fecaca]
                                                    "
                                                    aria-label={t.foodResults.table.delete}
                                                >
                                                    <Minus size={16}/>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => addToComparison([{
                                                        code: item.code,
                                                        name: item.commonName[language] ?? "",
                                                    }])}
                                                    className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    w-full
                                                    h-[45px]
                                                    rounded-[6px]
                                                    border-none
                                                    cursor-pointer
                                                    transition-all
                                                    duration-200
                                                    ease-in-out
                                                    bg-[#a8dbc1]
                                                    text-[#059669]
                                                    hover:bg-[#a7f3d0]
                                                    "
                                                    aria-label={t.foodResults.table.compare}
                                                >
                                                    <Plus size={16}/>
                                                </button>
                                            )}
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={changePage}
                            />
                        )}
                    </>
            }
        </div>
    );
}
