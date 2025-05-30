'use client'

import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Modal from "@/app/components/Modal/Modal";

type NutrientConvert = {
    id: number;
    name: string;
    selected: boolean;
};

type ModalReferencesProps = {
    nutrients: NutrientConvert[];
    show: boolean;
    onHide: () => void;
    onSelectReferenceForNutrients: (nutrientIds: number[], referenceId: number) => void;
    selectedReference: number | null;
};

export default function ModalReferences({
                                            nutrients,
                                            show,
                                            onHide,
                                            onSelectReferenceForNutrients,
                                            selectedReference,
                                        }: ModalReferencesProps) {
    const [selectedNutrientIds, setSelectedNutrientIds] = useState<number[]>([]);
    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            const initialSelectedIds = nutrients
                .filter((n) => n.selected)
                .map((n) => n.id);
            setSelectedNutrientIds(initialSelectedIds);
        }
    }, [nutrients, show]);

    const handleSelect = (id: number) => {
        setSelectedNutrientIds((prev) =>
            prev.includes(id)
                ? prev.filter((nid) => nid !== id)
                : [...prev, id]
        );
    };

    const handleAddReference = () => {
        if (selectedReference !== null) {
            onSelectReferenceForNutrients(selectedNutrientIds, selectedReference);
            onHide();
        }
    };

    if (!show) return null;

    return (
        <Modal
            width={600}
            header={t("ModalReferences.Select")}
            onClose={onHide}
        >
            <div className="flex-1 overflow-y-auto p-[16px]">
                <ul className="list-none p-[0px] m-[0px] rounded-[4px] border-solid border-[1px] ">
                    {nutrients.map((nutrient) => (
                        <li
                            key={nutrient.id}
                            onClick={() => handleSelect(nutrient.id)}
                            className={`
                                py-[12px] px-[16px]
                                border-b-[1px] border-[#e5f1eb]
                                cursor-pointer
                                transition-colors duration-[150ms]
                                ${selectedNutrientIds.includes(nutrient.id)
                                ? 'bg-[#047857] text-[white]'
                                : 'bg-transparent'
                                }
                                last:border-b-[0px]
                              `}
                        >
                            {nutrient.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-end g-[8px] mt-[20px]">
                <button
                    onClick={onHide}
                    className="px-[8px] py-[16px] bg-[#f96740] text-[white] border-none rounded-[4px] cursor-pointer"
                >
                    {t("ModalReferences.Close")}
                </button>
                <button
                    onClick={handleAddReference}
                    disabled={selectedReference === null}
                    className={`
            px-[8px] py-[16px] 
            bg-[#61d98b]
            text-[white]
            border-none rounded-[4px]
            cursor-pointer 
            ${selectedReference === null
                        ? 'bg-[#6c757d] [opacity:0.65] cursor-not-allowed'
                        : 'bg-[#0d6efd] hover:bg-[#0b5ed7]'
                    }
          `}
                >
                    {t("ModalReferences.Save")}
                </button>
            </div>
        </Modal>
    );
}
