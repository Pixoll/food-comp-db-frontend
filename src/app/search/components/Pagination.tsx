import { tw } from "@/utils/tailwind";
import type { JSX } from "react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps): JSX.Element {
    const getPageNumbers = (): Array<number | string> => {
        const pageLimit = 5;
        const sidePages = 2;
        const numbers = [...Array(totalPages + 1).keys()].slice(1);
        let pages: Array<number | string>;

        if (totalPages <= pageLimit) {
            pages = numbers;
        } else {
            if (currentPage <= sidePages + 1) {
                pages = [...numbers.slice(0, sidePages + 2), "...", totalPages];
            } else if (currentPage >= totalPages - sidePages) {
                pages = [1, "...", ...numbers.slice(totalPages - (sidePages + 2))];
            } else {
                pages = [
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages,
                ];
            }
        }

        return pages;
    };

    const baseLinkClasses = tw`
        py-[10px]
        px-[18px]
        no-underline
        text-[rgb(3,33,31)]
        text-[16px]
        font-[600]
        rounded-[8px]
        transition-all
        duration-300
        ease-in-out
        inline-block
        cursor-pointer
        min-w-[50px]
        text-center
        bg-white
        border-2
        border-[#e0e0e0]
        hover:bg-[#37a86a]
        hover:text-white
        hover:scale-105
        hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]
        md:py-[10px]
        md:px-[16px]
        md:text-[14px]
        md:min-w-[40px]
    `;

    return (
        <nav>
            <ul
                className="
                flex
                justify-center
                py-[15px]
                px-0
                my-[25px]
                mx-0
                list-none
                bg-[#f8f9fa]
                rounded-[15px]
                shadow-[0_6px_12px_rgba(0,0,0,0.1)]
                whitespace-nowrap
                items-center
                md:justify-around
                md:overflow-x-auto
                md:py-[10px]
                md:my-[15px]
                "
            >
                <li className="my-0 mx-[8px] md:mx-[4px]">
                    <span
                        className={baseLinkClasses}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        {"<"}
                    </span>
                </li>

                {getPageNumbers().map((n, i) => (
                    <li
                        className={`
                        my-0
                        mx-[8px]
                        md:mx-[4px]
                        ${currentPage === n
                            ? `
                            bg-[#37a86a]
                            text-white
                            font-bold
                            pointer-events-none
                            transform-none
                            shadow-[0_3px_6px_rgba(0,0,0,0.15)]
                            `
                            : ""
                        }`}
                        key={i}
                    >
                        {typeof n === "number" ? (
                            <span
                                className={baseLinkClasses}
                                onClick={() => onPageChange(n)}
                            >
                                {n}
                            </span>
                        ) : (
                            <span className={`${baseLinkClasses} pointer-events-none`}>
                                {n}
                            </span>
                        )}
                    </li>
                ))}

                <li className="my-0 mx-[8px] md:mx-[4px]">
                    <span
                        className={baseLinkClasses}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        {">"}
                    </span>
                </li>
            </ul>
        </nav>
    );
}
