"use client";

import type { Author } from "@/api";
import SelectorWithInput from "@/app/components/Selector/SelectorWithInput";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

type NewAuthorsProps = {
    authorIds?: number[];
    newAuthors?: string[];
    data: Author[];
    updateAuthors: (authors: Author[]) => void;
};

const convert = (authorIds?: number[], newAuthors?: string[], authors?: Author[]): Author[] => {
    const list: Author[] = [];

    authorIds?.forEach((authorId) => {
        const existingAuthor = authors?.find((author) => author.id === authorId);
        if (existingAuthor) {
            list.push({ ...existingAuthor });
        }
    });

    newAuthors?.forEach((name) => {
        if (name) list.push({ id: -1, name });
    });

    return list;
};

export default function Authors({ authorIds, newAuthors, data, updateAuthors }: NewAuthorsProps): JSX.Element {
    const { t } = useTranslation();
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>(convert(authorIds, newAuthors, data));
    const [selectors, setSelectors] = useState<number[]>(
        Array.from({ length: selectedAuthors.length }, (_, i) => i)
    );

    const updateParent = useCallback(() => {
        updateAuthors(selectedAuthors);
    }, [selectedAuthors, updateAuthors]);

    const handleSelectAuthor = (index: number, id: number | undefined, name: string): void => {
        const updatedAuthors = [...selectedAuthors];
        if (id) {
            const selectedAuthor = data.find((author) => author.id === id);
            if (selectedAuthor && !updatedAuthors.some((a) => a.id === id)) {
                updatedAuthors[index] = selectedAuthor;
            }
        } else if (name) {
            updatedAuthors[index] = { id: -1, name };
        }
        setSelectedAuthors(updatedAuthors);
        updateAuthors(updatedAuthors);
    };

    const handleRemoveRow = (index: number): void => {
        const updatedAuthors = selectedAuthors.filter((_, i) => i !== index);
        const updatedSelectors = selectors.filter((_, i) => i !== index);
        setSelectedAuthors(updatedAuthors);
        setSelectors(updatedSelectors);
        updateParent();
    };

    const handleAddSelector = (): void => {
        setSelectors([...selectors, selectors.length]);
        setSelectedAuthors([...selectedAuthors, { id: 0, name: "" }]);
    };

    return (
        <div className="container mx-auto px-[16px] md:px-[24px]">
            <div className="flex flex-col gap-[8px] w-full">
                {selectors.map((_, index) => (
                    <div key={index} className="w-full mb-[8px]">
                        <div className="flex flex-col sm:flex-row gap-[8px] items-start sm:items-center">
                            <div className="flex-grow w-full">
                                <SelectorWithInput
                                    options={data}
                                    newValueMaxLength={200}
                                    placeholder={t("Authors.author")}
                                    selectedValue={selectedAuthors[index]?.name || ""}
                                    onSelect={(id, name) => handleSelectAuthor(index, id, name)}
                                />
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => handleRemoveRow(index)}
                                    className="
                                    px-[12px]
                                    py-[6px]
                                    border
                                    border-[#dc2626]
                                    text-[#dc2626]
                                    rounded-[4px]
                                    hover:bg-[#fee2e2]
                                    transition-colors
                                    duration-[200ms]
                                    font-[500]
                                    text-[14px]
                                    "
                                >
                                    {t("Authors.Eliminate")}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h4 className="text-[18px] font-[600] mt-[16px] mb-[8px] text-[#1f2937]">
                {t("Authors.Select")}
            </h4>

            <ul className="border border-[#e5e7eb] rounded-[8px] divide-y divide-[#e5e7eb] mb-[16px] overflow-hidden">
                {selectedAuthors.map((author, index) => (
                    <li
                        key={author.id || index}
                        className="px-[16px] py-[12px] bg-[white] hover:bg-[#f9fafb] transition-colors duration-[200ms]"
                    >
                        {author.name || t("Authors.No_selected")}
                    </li>
                ))}
                {selectedAuthors.length === 0 && (
                    <li className="px-[16px] py-[12px] bg-[white] text-[#6b7280] italic">
                        {t("Authors.No_selected")}
                    </li>
                )}
            </ul>

            <button
                onClick={handleAddSelector}
                className="
                px-[16px]
                py-[8px]
                bg-[#2563eb]
                text-[white]
                border-none
                rounded-[4px]
                hover:bg-[#1d4ed8]
                transition-colors
                duration-[200ms]
                font-[500]
                text-[14px]
                shadow-sm
                "
            >
                {t("Authors.Add")}
            </button>
        </div>
    );
}
