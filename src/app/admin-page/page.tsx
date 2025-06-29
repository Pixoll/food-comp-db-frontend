"use client";

import { useTranslation } from "@/context/I18nContext";
import Link from "next/link";
import type { JSX } from "react";
import styles from "./admin-page.module.css";

export default function AdminPage(): JSX.Element {
    const { t } = useTranslation();

    return (
        <div className="p-[36px] h-auto flex flex-col bg-gradient-to-b from-[#f0f9ff] to-[#e9f8d9]">
            <h1
                className="
                text-center
                text-[36px]
                font-[700]
                mb-[32px]
                text-[#333]
                border-b-[2px]
                pb-[16px]
                border-[#eaeaea]
                "
            >
                {t.adminPage.title}
            </h1>

            <div
                className={styles["grid-container"]}
            >
                <div
                    className="
                    bg-[#f8f9fa]
                    rounded-[8px]
                    shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                    overflow-hidden
                    border-[1px]
                    border-[#e9ecef]
                    hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]
                    transition-shadow
                    duration-[300ms]
                    flex
                    flex-col
                    "
                >
                    <div className="p-[20px] flex-grow flex flex-col">
                        <h3 className="text-[20px] font-[600] mb-[12px] text-[#2c3e50]">
                            {t.adminPage.addSubspecies.title}
                        </h3>
                        <p className="text-[16px] text-[#495057] leading-[1.6] flex-grow">
                            {t.adminPage.addSubspecies.description}
                        </p>
                        <div className="mt-[16px] flex justify-center">
                            <Link
                                href="/admin-page/add-subspecies"
                                className="
                                w-full
                                text-center
                                py-[12px]
                                px-[24px]
                                bg-[#3498db]
                                text-[#ffffff]
                                rounded-[6px]
                                font-[600]
                                hover:bg-[#2980b9]
                                transition-colors
                                duration-[200ms]
                                shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                                "
                            >
                                {t.adminPage.addSubspecies.title}
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    className="
                    bg-[#f8f9fa]
                    rounded-[8px]
                    shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                    overflow-hidden
                    border-[1px]
                    border-[#e9ecef]
                    hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]
                    transition-shadow
                    duration-[300ms]
                    flex
                    flex-col
                    "
                >
                    <div className="p-[20px] flex-grow flex flex-col">
                        <h3 className="text-[20px] font-[600] mb-[12px] text-[#2c3e50]">
                            {t.adminPage.addFood.title}
                        </h3>
                        <p className="text-[16px] text-[#495057] leading-[1.6] flex-grow">
                            {t.adminPage.addFood.description}
                        </p>
                        <div className="mt-[16px] flex justify-center">
                            <Link
                                href="/admin-page/add-food"
                                className="
                                w-full
                                text-center
                                py-[12px]
                                px-[24px]
                                bg-[#2ecc71]
                                text-[#ffffff]
                                rounded-[6px]
                                font-[600]
                                hover:bg-[#27ae60]
                                transition-colors
                                duration-[200ms]
                                shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                                "
                            >
                                {t.adminPage.addFood.title}
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    className="
                    bg-[#f8f9fa]
                    rounded-[8px]
                    shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                    overflow-hidden
                    border-[1px]
                    border-[#e9ecef]
                    hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]
                    transition-shadow
                    duration-[300ms]
                    flex
                    flex-col
                    "
                >
                    <div className="p-[20px] flex-grow flex flex-col">
                        <h3 className="text-[20px] font-[600] mb-[12px] text-[#2c3e50]">
                            {t.adminPage.addByFile.title}
                        </h3>
                        <p className="text-[16px] text-[#495057] leading-[1.6] flex-grow">
                            {t.adminPage.addByFile.description}
                        </p>
                        <div className="mt-[16px] flex justify-center">
                            <Link
                                href="/admin-page/add-foods-and-references"
                                className="
                                w-full
                                text-center
                                py-[12px]
                                px-[24px]
                                bg-[#9b59b6]
                                text-[#ffffff]
                                rounded-[6px]
                                font-[600]
                                hover:bg-[#8e44ad]
                                transition-colors
                                duration-[200ms]
                                shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                                "
                            >
                                {t.adminPage.addByFile.title}
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    className="
                    bg-[#f8f9fa]
                    rounded-[8px]
                    shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                    overflow-hidden
                    border-[1px]
                    border-[#e9ecef]
                    hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]
                    transition-shadow
                    duration-[300ms]
                    flex
                    flex-col
                    "
                >
                    <div className="p-[20px] flex-grow flex flex-col">
                        <h3 className="text-[20px] font-[600] mb-[12px] text-[#2c3e50]">
                            {t.adminPage.addReference.title}
                        </h3>
                        <p className="text-[16px] text-[#495057] leading-[1.6] flex-grow">
                            {t.adminPage.addReference.description}
                        </p>
                        <div className="mt-[16px] flex justify-center">
                            <Link
                                href="/admin-page/add-reference"
                                className="
                                w-full
                                text-center
                                py-[12px]
                                px-[24px]
                                bg-[#e74c3c]
                                text-[#ffffff]
                                rounded-[6px]
                                font-[600]
                                hover:bg-[#c0392b]
                                transition-colors
                                duration-[200ms]
                                shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                                "
                            >
                                {t.adminPage.addReference.title}
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    className="
                    bg-[#f8f9fa]
                    rounded-[8px]
                    shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                    overflow-hidden
                    border-[1px]
                    border-[#e9ecef]
                    hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]
                    transition-shadow
                    duration-[300ms]
                    flex
                    flex-col
                    "
                >
                    <div className="p-[20px] flex-grow flex flex-col">
                        <h3 className="text-[20px] font-[600] mb-[12px] text-[#2c3e50]">
                            {t.adminPage.addScientificName.title}
                        </h3>
                        <p className="text-[16px] text-[#495057] leading-[1.6] flex-grow">
                            {t.adminPage.addScientificName.description}
                        </p>
                        <div className="mt-[16px] flex justify-center">
                            <Link
                                href="/admin-page/add-scientific-name"
                                className="
                                w-full
                                text-center
                                py-[12px]
                                px-[24px]
                                bg-[#f39c12]
                                text-[#ffffff]
                                rounded-[6px]
                                font-[600]
                                hover:bg-[#d35400]
                                transition-colors
                                duration-[200ms]
                                shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                                "
                            >
                                {t.adminPage.addScientificName.title}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
