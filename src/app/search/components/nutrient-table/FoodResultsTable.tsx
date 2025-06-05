'use client'
import axios from "axios";
import {ArrowDown, ArrowUp, Plus, Minus} from "lucide-react";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useRouter} from 'next/navigation';
import {useAuth} from "@/context/AuthContext";
import {useComparison} from "@/context/ComparisonContext";
import {FoodResult} from "@/types/option";
import Pagination from "../Pagination";
import "./index.css"

interface FoodResultsListProps {
    data: FoodResult[];
    searchForName: string;
    setSearchForName: (value: string) => void;
}

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
                                         }: FoodResultsListProps) {
    const router = useRouter();
    const {state} = useAuth();
    const {token} = state;
    const {comparisonFoods, addToComparison, removeFromComparison} =
        useComparison();
    const {t, i18n} = useTranslation();
    const [selectedSort, setSelectedSort] = useState(SortType.NAME);
    const [sortOrder, setSortOrder] = useState(SortOrder.ASC);
    const [resultsPerPage, setResultsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedData, setSortedData] = useState<FoodResult[]>([]);
    const selectedLanguage = i18n.language as "en" | "es" | "pt";

    const npage = Array.isArray(sortedData)
        ? Math.ceil(sortedData.length / resultsPerPage)
        : 0;
    const lastIndex = currentPage * resultsPerPage;
    const firstIndex = lastIndex - resultsPerPage;
    const records = Array.isArray(sortedData)
        ? sortedData.slice(firstIndex, lastIndex)
        : [];

    const toFoodDetail = (code: string) => {
        router.push(`/detail-food/${code}`);
    };


    const toModifyFoodDetail = (code: string) => {
        if (state.isAuthenticated) {
            router.push(`/modify-food/${code}`);
        } else {
            router.push("/login");
        }
    };

    const changePage = (page: number) => {
        if (page >= 1 && page <= npage) {
            setCurrentPage(page);
        }
    };
    const exportData = async (codes: string[]) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/xlsx?codes=${codes.join(",")}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);

            let fileName = "foods_data.xlsx";
            const contentDisposition = response.headers["content-disposition"];
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match && match[1]) {
                    fileName = match[1];
                }
            }

            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const sorted = [...data].sort((a, b) => {
            let stringA: string;
            let stringB: string;

            switch (selectedSort) {
                case SortType.CODE: {
                    stringA = a.code;
                    stringB = b.code;
                    break;
                }
                case SortType.NAME: {
                    stringA = a.commonName[selectedLanguage]?.toLowerCase() ?? "~";
                    stringB = b.commonName[selectedLanguage]?.toLowerCase() ?? "~";
                    break;
                }
                case SortType.SCIENTIFIC_NAME: {
                    const scientificNameA = a.scientificName?.toLowerCase() ?? "";
                    const subspeciesA = a.subspecies?.toLowerCase() ?? "";
                    const scientificNameB = b.scientificName?.toLowerCase() ?? "";
                    const subspeciesB = b.subspecies?.toLowerCase() ?? "";
                    stringA =
                        (subspeciesA
                            ? `${scientificNameA} ${subspeciesA}`
                            : scientificNameA) || "~";
                    stringB =
                        (subspeciesB
                            ? `${scientificNameB} ${subspeciesB}`
                            : scientificNameB) || "~";
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
        selectedLanguage,
        selectedSort,
        sortOrder,
        resultsPerPage,
        searchForName,
    ]);

    const handleSortClick = (type: SortType) => {
        if (selectedSort === type) {
            setSortOrder(
                sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
            );
        } else {
            setSelectedSort(type);
            setSortOrder(SortOrder.ASC);
        }
    };
    const selectAllFoodComparison = () => {
        const currentFoodInComparison = new Set(comparisonFoods.map((f) => f.code));

        const newItems = records.filter(
            (item) => !currentFoodInComparison.has(item.code)
        );

        newItems.forEach((item) =>
            addToComparison({
                code: item.code,
                name: item.commonName[selectedLanguage] ?? "",
            })
        );
    };
    return (
        <div className="food-list">
            <h2 className="text-[24px] text-[black] text-left mb-[18px] border-b-[2px]] border-[#a8d8d2] pb-[8px] tracking-wider transition-colors duration-300 ease-in-out hover:text-[#388e60]">{t("Table.title")}</h2>
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
                                placeholder={t("Table.search")}
                                value={searchForName}
                                onChange={(e) => setSearchForName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-row items-center gap-[8px] min-w-[180px]">
                            <label
                                htmlFor="resultsPerPage"
                                className="
                                text-[14px]
                                font-medium
                                text-[#4a4a4a]
                                whitespace-nowrap
                                "
                            >
                                {t("Table.results_per_page")}
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
                                    className="absolute right-[12px] top-[50%] transform translate-y-[-50%] pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[16px] w-[16px] text-[#007f67]"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-[16px] my-[24px] w-full">
                        <button
                            className="
                            bg-[#4CAF50]
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
                            hover:bg-[#45a049]
                            hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]
                            hover:-translate-y-[1px]
                            active:bg-[#3e8e41]
                            active:shadow-[0_1px_3px_rgba(0,0,0,0.2)]
                            active:translate-y-[1px]
                            "
                            onClick={() => exportData(data.map((f) => f.code))}
                        >
                            Exportar resultados
                        </button>
                        <button
                            className="
                            bg-[#4CAF50]
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
                            hover:bg-[#45a049]
                            hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]
                            hover:-translate-y-[1px]
                            active:bg-[#3e8e41]
                            active:shadow-[0_1px_3px_rgba(0,0,0,0.2)]
                            active:translate-y-[1px]
                            "
                            onClick={() => router.push("/compare")}
                        >
                            Ir a comparar ({comparisonFoods.length})
                        </button>
                        <button
                            className="
                            bg-[#4CAF50]
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
                            hover:bg-[#45a049]
                            hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]
                            hover:-translate-y-[1px]
                            active:bg-[#3e8e41]
                            active:shadow-[0_1px_3px_rgba(0,0,0,0.2)]
                            active:translate-y-[1px]
                            "
                            onClick={() => selectAllFoodComparison()}>
                            Seleccionar todo
                        </button>
                    </div>

                </div>
            </div>

            {!Array.isArray(sortedData) || sortedData.length === 0 ? (
                <p>{t("Table.no_results")}</p>
            ) : (
                <>
                    <table className="content-table-foods
                            border-collapse
                            font-[0.95em]
                            w-full
                            rounded-t-[8px]
                            overflow-hidden
                            shadow-[0_6px_18px_rgba(0, 0, 0, 0.1)]
                        "
                        /*className="content-table-foods"*/>
                        <thead>
                        <tr className="bg-[#4e9f6f] text-[white] text-left font-[700] select-none">
                            <th className="text-[22px] font-[500] py-[14px] px-[18px] text-left">
                                <div className="flex flex-row items-center cursor-pointer w-[max-content]"
                                     onClick={() => handleSortClick(SortType.CODE)}>
                                    {selectedSort === SortType.CODE &&
                                        (sortOrder === SortOrder.ASC ? (
                                            <ArrowUp className="mr-[5px]" height={24}/>
                                        ) : (
                                            <ArrowDown className="mr-[5px]" height={24}/>
                                        ))}
                                    {t("Table_FoodResults.code")}
                                </div>
                            </th>
                            <th className="text-[22px] font-[500] py-[14px] px-[18px] text-left">
                                <div className="flex flex-row items-center cursor-pointer w-[max-content]"
                                     onClick={() => handleSortClick(SortType.NAME)}>
                                    {selectedSort === SortType.NAME &&
                                        (sortOrder === SortOrder.ASC ? (
                                            <ArrowUp className="mr-[5px]" height={24}/>
                                        ) : (
                                            <ArrowDown className="mr-[5px]" height={24}/>
                                        ))}
                                    {t("Table_FoodResults.name")}
                                </div>
                            </th>
                            <th className="text-[22px] font-[500] py-[14px] px-[18px] text-left">
                                <div
                                    className="flex flex-row items-center cursor-pointer w-[max-content]"
                                    onClick={() => handleSortClick(SortType.SCIENTIFIC_NAME)}
                                >
                                    {selectedSort === SortType.SCIENTIFIC_NAME &&
                                        (sortOrder === SortOrder.ASC ? (
                                            <ArrowUp height={24}/>
                                        ) : (
                                            <ArrowDown height={24}/>
                                        ))}
                                    {t("Table_FoodResults.scientific_name")}
                                </div>
                            </th>
                            <th className="text-[22px] font-[500] py-[14px] px-[18px] text-left">{t("Table_FoodResults.action")}</th>
                            <th className="text-[22px] font-[500] py-[14px] px-[18px] text-left">Comparar</th>
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
                                `}>
                                <td className="text-center" data-label="Code">{item.code}</td>
                                <td data-label="Nombre">
                                    {item.commonName[selectedLanguage] || "N/A"}
                                </td>
                                <td className="text-center" data-label="Nombre científico">
                                    {item.subspecies
                                        ? `${item.scientificName} ${item.subspecies.toLowerCase()}`
                                        : item.scientificName || "N/A"}
                                </td>
                                <td className="text-center">
                                    <button
                                        className="
                                        bg-[#4e9f6f]
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
                                        hover:bg-[#007f67]
                                        hover:translate-y-[3px]
                                        "
                                        onClick={() => toFoodDetail(item.code)}
                                    >
                                        {t("Table_FoodResults.details")}
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
                                            {t("Table_FoodResults.modify")}
                                        </button>
                                    )}
                                </td>
                                <th className="flex items-center justify-center h-[55px] md:h-auto">
                                    {comparisonFoods.map((f) => f.code).includes(item.code) ? (
                                        <button
                                            onClick={() => removeFromComparison(item.code)}
                                            className="flex items-center justify-center w-full h-[45px] rounded-[6px] border-none
                                                cursor-pointer transition-all duration-200 ease-in-out bg-[#ecc1c1] text-[#c31a3f]
                                                hover:bg-[#fecaca]"
                                            aria-label="Eliminar"
                                        >
                                            <Minus size={16}/>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                addToComparison({
                                                    code: item.code,
                                                    name: item.commonName[selectedLanguage] ?? "",
                                                })
                                            }
                                            className="flex items-center justify-center w-full h-[45px] rounded-[6px] border-none
                                                cursor-pointer transition-all duration-200 ease-in-out bg-[#a8dbc1] text-[#059669]
                                                hover:bg-[#a7f3d0]"
                                            aria-label="Comparar"
                                        >
                                            <Plus size={16}/>
                                        </button>
                                    )}
                                </th>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                    {npage > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            npage={npage}
                            onPageChange={changePage}
                        />
                    )}
                </>
            )}
        </div>
    );
}
