'use client'

import {useState} from "react";
import {ChevronDown, ChevronRight, Trash2, PlusCircle} from 'lucide-react';
import {useTranslation} from "react-i18next";
import {LangualCode} from "@/hooks";
import {Pagination} from "@/app/search/components";

type NewLangualCodeProps = {
    langualCodes: LangualCode[];
    selectedLangualCodes: number[];
    onLangualCodesChange: (updatedLangualCodeId: number) => void;
};

export default function AddLangualCode({
                                           langualCodes,
                                           selectedLangualCodes,
                                           onLangualCodesChange
                                       }: NewLangualCodeProps) {

    const [searchTerm, setSearchTerm] = useState("");
    const [expandedParents, setExpandedParents] = useState<number[]>([]);
    const [childrenPages, setChildrenPages] = useState<Record<number, number>>({});

    const {t} = useTranslation();

    const matchesSearchTerm = (text: string) =>
        text.toLowerCase().includes(searchTerm.toLowerCase());

    const parentCodes = langualCodes.filter(code => code.parentId === null);

    const getChildCodes = (parentId: number) =>
        langualCodes.filter(code => code.parentId === parentId);

    const getFilteredParentAndChildren = () => {
        if (!searchTerm) return parentCodes;

        return parentCodes.filter(parent => {
            const parentMatches =
                matchesSearchTerm(parent.code)

            const children = getChildCodes(parent.id);
            const childrenMatch = children.some(child =>
                matchesSearchTerm(child.code)
            );

            if ((parentMatches || childrenMatch) && !expandedParents.includes(parent.id)) {
                setExpandedParents(prev => [...prev, parent.id]);
            }

            return parentMatches || childrenMatch;
        });
    };

    const getFilteredChildCodes = (parentId: number) => {
        const children = getChildCodes(parentId);

        if (!searchTerm) return children;

        return children.filter(child =>
            matchesSearchTerm(child.code) ||
            matchesSearchTerm(child.descriptor)
        );
    };

    const toggleExpand = (parentId: number) => {
        setExpandedParents(prev =>
            prev.includes(parentId)
                ? prev.filter(id => id !== parentId)
                : [...prev, parentId]
        );
        if (!childrenPages[parentId]) {
            setChildrenPages(prev => ({...prev, [parentId]: 1}));
        }
    };

    const handleChildSelection = (childId: number) => {
        onLangualCodesChange(childId);
    };

    const handleChildPageChange = (parentId: number, page: number) => {
        setChildrenPages(prev => ({...prev, [parentId]: page}));
    };

    const ITEMS_PER_PAGE = 5;

    const getPaginatedChildren = (parentId: number) => {
        const children = getFilteredChildCodes(parentId);
        const currentPage = childrenPages[parentId] || 1;
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return {
            children: children.slice(startIndex, endIndex),
            totalPages: Math.ceil(children.length / ITEMS_PER_PAGE),
            currentPage
        };
    };

    const filteredParentCodes = getFilteredParentAndChildren();

    return (
        <div className="space-y-[16px] py-[16px] max-w-[1000px] mx-auto">
            <div className="mb-[16px]">
                <input
                    type="text"
                    placeholder={t("LangualCode.Search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-[42px] px-[12px] border-[1px] border-[#d1d5db] rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                  focus:outline-none focus:ring-[2px] focus:ring-[#047857] focus:border-[#047857]"
                />
            </div>

            {filteredParentCodes.map(parent => {
                const {children, totalPages, currentPage} = getPaginatedChildren(parent.id);

                return (
                    <div key={parent.id}
                         className="mb-[16px] rounded-[8px] border-[1px] border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                        <div
                            className="bg-[#f9fafb] p-[12px] rounded-t-[8px] cursor-pointer hover:bg-[#f3f4f6] transition-all duration-[200ms]"
                            onClick={() => toggleExpand(parent.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-[8px]">
                                    {expandedParents.includes(parent.id) ? (
                                        <ChevronDown className="text-[#6b7280]" size={20}/>
                                    ) : (
                                        <ChevronRight className="text-[#6b7280]" size={20}/>
                                    )}
                                    <span className="font-[600] text-[#1f2937]">
                                    {parent.code} - {parent.descriptor}
                                </span>
                                </div>
                            </div>
                        </div>

                        {expandedParents.includes(parent.id) && (
                            <div className="divide-y divide-[#e5e7eb]">
                                {children.map(child => {
                                    const isSelected = selectedLangualCodes.includes(child.id);

                                    return (
                                        <div key={child.id} className="flex flex-row">
                                            <div className="flex-grow p-[12px]">
                                                <div className="font-[500] mb-[4px] text-[#1f2937]">{child.code}</div>
                                                <div className="text-[#6b7280] text-[14px]">{child.descriptor}</div>
                                            </div>
                                            <div className="w-[100px]">
                                                <button
                                                    className={`w-full h-full flex flex-col items-center justify-center p-[12px]
                                                        ${isSelected
                                                        ? 'bg-[#ef4444] hover:bg-[#dc2626]'
                                                        : 'bg-[#10b981] hover:bg-[#059669]'
                                                    }text-white transition-colors duration-[200ms]`}
                                                    onClick={() => handleChildSelection(child.id)}
                                                    >
                                                    <div className="flex flex-col items-center">
                                                        {isSelected ? (
                                                            <>
                                                                <Trash2 size={20} className="mb-[4px]"/>
                                                                <span
                                                                    className="text-[12px]">{t("LangualCode.Eliminate")}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <PlusCircle size={20} className="mb-[4px] border-transparent"/>
                                                                <span
                                                                    className="text-[12px]">{t("LangualCode.Add")}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {totalPages > 1 && (
                                    <div className="p-[12px] border-t-[1px] border-[#e5e7eb]">
                                        <Pagination
                                            currentPage={currentPage}
                                            npage={totalPages}
                                            onPageChange={(page) => handleChildPageChange(parent.id, page)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
