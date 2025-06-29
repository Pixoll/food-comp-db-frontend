import { type JSX, type ReactNode, useRef, useState } from "react";

type TooltipProps = {
    content: string;
    children?: ReactNode;
};

export default function Tooltip({ content, children }: TooltipProps): JSX.Element {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef(null);

    return (
        <div
            className="relative inline-block cursor-help"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className="
                    absolute z-[50]
                    bg-[#333]
                    text-[white]
                    text-[12px]
                    px-[8px]
                    py-[4px]
                    rounded-[4px]
                    whitespace-nowrap
                    bottom-[100%]
                    left-[50%]
                    transform
                    -translate-x-[50%]
                    mb-[8px]
                    shadow-lg
                    "
                >
                    {content}
                    <div
                        className="
                        absolute
                        w-[0px]
                        h-[0px]
                        left-[50%]
                        transform
                        -translate-x-[50%]
                        bottom-[-4px]
                        border-l-[4px]
                        border-l-transparent border-r-[4px]
                        border-r-transparent border-t-[4px]
                        border-t-[#333]
                        "
                    />
                </div>
            )}
        </div>
    );
};
