"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "./components/Footer";

export default function HomePage(): JSX.Element {
    const { t } = useTranslation();
    const router = useRouter();
    const [foodName, setFoodName] = useState("");

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();
        if (foodName) {
            toSearchPage(foodName);
        }
    };

    const toSearchPage = (foodName: string): void => {
        router.push(`/search?foodName=${encodeURIComponent(foodName)}`);
    };

    return <>
        <div
            // bg image obtained from https://www.pexels.com/photo/assorted-vegetables-on-brown-surface-616404/
            // marked as free to use by the photographer
            style={{
                backgroundImage: "url(/main_page_bg.jpg), radial-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%)",
            }}
            className="
            bg-blend-overlay
            bg-cover
            bg-center
            h-screen
            m-[0px]
            text-[white]
            text-center
            py-[16px]
            "
        >
            <div className="container mx-auto h-full">
                <div className="h-full flex justify-center items-center">
                    <div>
                        <h1
                            className="
                            font-[700]
                            text-[48px]
                            text-shadow-[2px_2px_8px_rgba(0,0,0,0.7)]
                            font-[Poppins,_sans-serif]
                            "
                        >
                            {t("homepage.title")}
                        </h1>
                        <p
                            className="
                            text-[18px]
                            mb-[30px]
                            text-shadow-[2px_2px_8px_rgba(0,0,0,0.7)]
                            font-[Poppins,_sans-serif]
                            "
                        >
                            {t("homepage.subtitle")}
                        </p>

                        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                            <div className="flex w-full h-[60px] max-w-[568px] mx-auto mb-[20px]">
                                <input
                                    type="text"
                                    placeholder={t("search.placeholder")}
                                    value={foodName}
                                    onChange={(e) => setFoodName(e.target.value.trim())}
                                    className="
                                    w-full
                                    py-[12px]
                                    px-[24px]
                                    text-[18px]
                                    ml-[12px]
                                    border-[2px]
                                    border-gray-200
                                    rounded-l-full
                                    focus:outline-none
                                    focus:border-green-500
                                    shadow-[2px_2px_6px_rgba(0,0,0,0.9)]
                                    "
                                    aria-label="Buscar alimentos"
                                />
                                <button
                                    type="submit"
                                    className="
                                    py-[12px]
                                    px-[32px]
                                    text-[18px]
                                    text-[white]
                                    mr-[12px]
                                    font-[500]
                                    bg-[#015746]
                                    hover:bg-[#20703a]
                                    border-none
                                    cursor-pointer
                                    rounded-r-full
                                    transition-colors
                                    duration-200
                                    shadow-[2px_2px_8px_rgba(0,0,0,0.9)]
                                    "
                                >
                                    {t("search.button")}
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-[20px]">
                            <button
                                className="
                                py-[10px]
                                px-[20px]
                                text-xl
                                bg-[#015746]
                                text-[white]
                                border-none
                                rounded-[5px]
                                border-[#015746]
                                cursor-pointer
                                "
                                onClick={() => router.push("/search")}
                            >
                                {t("search.advancedSearch")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>;
}
