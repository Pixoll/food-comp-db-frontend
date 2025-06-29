import { useTranslation } from "@/context/I18nContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type ChangeEvent, type JSX, useState } from "react";

type GramsAdjusterProps = {
    initialGrams?: number;
    onGramsChange: (grams: number) => void;
};

export default function GramsAdjuster({ initialGrams = 100, onGramsChange }: GramsAdjusterProps): JSX.Element {
    const { t } = useTranslation();
    const [inputGrams, setInputGrams] = useState<string>(initialGrams.toString());
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [currentGrams, setCurrentGrams] = useState<number>(initialGrams);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setInputGrams(value);
        }
    };

    const applyGramsChange = (): void => {
        const parsedValue = inputGrams === "" ? 0 : +(inputGrams);
        //default
        if (parsedValue <= 0) {
            setInputGrams("100");
            setCurrentGrams(100);
            onGramsChange(100);
        } else {
            setCurrentGrams(parsedValue);
            onGramsChange(parsedValue);
        }
        setIsExpanded(false);
    };

    const toggleExpand = (): void => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setInputGrams(currentGrams.toString());
        }
    };

    return (
        <div className="relative mb-[12px]">
            <div
                onClick={toggleExpand}
                className="
                flex
                items-center
                justify-between
                p-[8px]
                pl-[12px]
                border-[1px]
                rounded-[4px]
                bg-[#f8f9fa]
                cursor-pointer
                hover:bg-[#eaecef]
                transition-colors
                duration-200
                "
            >
                <div className="flex items-center">
                    <span className="text-[14px] font-medium text-[#495057] mr-[6px]">
                        {t.gramsAdjuster.quantity}
                    </span>
                    <span className="text-[15px] font-semibold text-[#333]">
                        {currentGrams}g
                    </span>
                </div>
                <div className="flex items-center">
                    <button
                        className="
                        px-[8px]
                        py-[4px]
                        text-[13px]
                        text-[#5fa16c]
                        hover:text-[#4c8a58]
                        font-medium
                        "
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand();
                        }}
                    >
                        {t.gramsAdjuster.adjust}
                        {isExpanded
                            ? <ChevronUp size={16} className="inline ml-[4px]"/>
                            : <ChevronDown size={16} className="inline ml-[4px]"/>
                        }
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div
                    className="
                    absolute
                    z-10
                    mt-[4px]
                    p-[12px]
                    border-[1px]
                    rounded-[4px]
                    shadow-[0_4px_10px_rgba(0,0,0,0.15)]
                    bg-[white]
                    w-full
                    animate-fadeIn
                    "
                >
                    <div className="flex items-center justify-between gap-[12px]">
                        <div className="flex items-center gap-[8px]">
                            <input
                                type="text"
                                value={inputGrams}
                                onChange={handleInputChange}
                                className="
                                w-[70px]
                                py-[6px]
                                px-[10px]
                                border-[1.5px]
                                border-[#ced4da]
                                rounded-[4px]
                                text-[15px]
                                font-[500]
                                text-center
                                focus:outline-none
                                focus:border-[#5fa16c]
                                focus:ring-[2px]
                                focus:ring-[#5fa16c25]
                                "
                                aria-label="Cantidad en gramos"
                            />
                            <span className="text-[14px] text-[#666]">{t.gramsAdjuster.grams}</span>
                        </div>

                        <div className="flex gap-[8px]">
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="
                                px-[12px]
                                py-[6px]
                                border-[1px]
                                border-[#dee2e6]
                                rounded-[4px]
                                text-[13px]
                                font-[600]
                                bg-[#f8f9fa]
                                text-[#495057]
                                hover:bg-[#e2e6ea]
                                "
                            >
                                {t.gramsAdjuster.cancel}
                            </button>
                            <button
                                onClick={applyGramsChange}
                                className="
                                bg-[#5fa16c]
                                text-[white]
                                px-[12px]
                                py-[6px]
                                border-none
                                rounded-[4px]
                                text-[13px]
                                font-[600]
                                cursor-pointer
                                hover:bg-[#4c8a58]
                                "
                            >
                                {t.gramsAdjuster.apply}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
