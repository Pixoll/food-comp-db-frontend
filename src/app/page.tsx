'use client'
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useTranslation} from "react-i18next";
import background from "../../public/main_page_bg.jpg";
import Footer from "./components/Footer";

export default function HomePage() {
    const {t} = useTranslation();
    const router = useRouter();
    const [foodName, setFoodName] = useState("");
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (foodName.trim()) {
            toSearchPage(foodName);
        }
    };
    const toSearchPage = (foodName: string) => {
        const trimmedName = foodName.trim();
        router.push(`/search?foodName=${encodeURIComponent(JSON.stringify({foodName: trimmedName}))}`);
    };
    return (
        <>
            <div
                // bg image obtained from https://www.pexels.com/photo/assorted-vegetables-on-brown-surface-616404/
                // marked as free to use by the photographe
                style={{
                    backgroundImage: `url(${background.src}), radial-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%)`
                }}
                className={`
                    bg-blend-overlay
                    bg-cover
                    bg-center
                    h-screen
                    m-[0px]
                    text-[white]
                    text-center
                    `}>
                <div className="container mx-auto h-full">
                    <div className="h-full flex justify-center items-center">
                        <div>
                            <h1
                                className="
                                    font-[700]
                                    text-[48px]
                                    text-shadow-[2px_2px_8px_rgba(0,0,0,0.7)]
                                    font-[Poppins,_sans-serif]
                                    ">
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
                                <div className="flex w-full h-[60px] max-w-xl mx-auto mb-[20px]">
                                    <input
                                        type="text"
                                        placeholder={t("search.placeholder")}
                                        value={foodName}
                                        onChange={(e) => setFoodName(e.target.value)}
                                        className="
                                          w-full
                                          py-[12px]
                                          px-[24px]
                                          text-[18px]
                                          border-[2px]
                                          border-gray-200
                                          rounded-l-full
                                          focus:outline-none
                                          focus:border-green-500
                                          shadow-[2px_2px_8px_rgba(0,0,0,0.9)]
                                        "
                                        aria-label="Buscar alimentos"
                                    />
                                    <button
                                        type="submit"
                                        className="
                                          py-[12px]
                                          px-[32px]
                                          text-[18px]
                                          text-[black]
                                          font-[500]
                                          bg-[#28a745]
                                          hover:bg-[#19732f]
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
                                bg-[#28a745]
                                text-[white]
                                border-none
                                rounded-[5px]
                                border-[#28a745]
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
        </>
    )
}
